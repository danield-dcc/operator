import { anthropic } from "@ai-sdk/anthropic";
import { TRPCError } from "@trpc/server";
import { generateObject } from "ai";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/db";
import { roastIssues, roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

// --- AI schema ---

const aiOutputSchema = z.object({
	score: z.number().describe("Code quality score, 0 = disaster, 10 = flawless"),
	verdict: z.enum([
		"excellent",
		"good",
		"needs_improvement",
		"needs_serious_help",
		"disaster",
	]),
	roastQuote: z
		.string()
		.describe("Memorable one-liner verdict that captures the code quality"),
	issues: z
		.array(
			z.object({
				severity: z.enum(["critical", "warning", "good"]),
				title: z.string(),
				description: z.string(),
			}),
		)
		.describe("Key findings — mix critical issues with genuine positives"),
	suggestedCode: z
		.string()
		.nullable()
		.describe(
			"Full improved version of the code, or null if no changes needed",
		),
});

// --- Prompt builder ---

function buildPrompt(
	code: string,
	language: string,
	roastMode: boolean,
): string {
	const tone = roastMode
		? "Be brutally sarcastic and funny, like a senior dev who has seen too much bad code. Use dark humor. Be savage."
		: "Be professional and constructive, like a kind senior engineer doing a thorough code review.";

	return `You are a code review AI. Analyze the following ${language} code and produce a structured review.

${tone}

Rules:
- score: 0–10 where 0 = unreadable disaster, 10 = flawless. Most real-world code lands between 3–7.
- verdict: must match the score (disaster <2, needs_serious_help 2–4, needs_improvement 4–6, good 6–8, excellent 8+).
- roastQuote: one punchy quote summarizing the overall quality. ${roastMode ? "Be savage and memorable." : "Be honest but kind."}
- issues: 2–4 findings. Always include at least one positive finding (severity: "good"). Be specific and technical.
- suggestedCode: the complete improved version of the code if there are meaningful improvements to make. Return null if the code is already excellent or only needs minor stylistic tweaks.

Code to analyze:
\`\`\`${language}
${code}
\`\`\``;
}

// --- Router ---

export const roastsRouter = createTRPCRouter({
	createRoast: baseProcedure
		.input(
			z.object({
				code: z.string().min(1).max(2500),
				language: z.string(),
				roastMode: z.boolean(),
			}),
		)
		.mutation(async ({ input }) => {
			const { code, language, roastMode } = input;

			let object: Awaited<
				ReturnType<typeof generateObject<typeof aiOutputSchema>>
			>["object"];
			try {
				const result = await generateObject({
					model: anthropic("claude-haiku-4-5"),
					schema: aiOutputSchema,
					prompt: buildPrompt(code, language, roastMode),
				});
				object = result.object;
			} catch (e) {
				console.error("createRoast AI generation failed", e);

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "AI analysis failed. Please try again later.",
					cause: e,
				});
			}

			const shareId = nanoid(8);
			const lineCount = code.split("\n").length;
			const normalizedScore = Math.max(0, Math.min(10, object.score));
			const normalizedIssues = object.issues.slice(0, 4);

			const [roast] = await db
				.insert(roasts)
				.values({
					shareId,
					code,
					language,
					lineCount,
					roastMode,
					score: normalizedScore,
					verdict: object.verdict,
					roastQuote: object.roastQuote,
					suggestedCode: object.suggestedCode ?? null,
					aiModel: "claude-haiku-4-5",
				})
				.returning();

			if (normalizedIssues.length > 0) {
				await db.insert(roastIssues).values(
					normalizedIssues.map((issue, i) => ({
						roastId: roast.id,
						severity: issue.severity,
						title: issue.title,
						description: issue.description,
						order: i,
					})),
				);
			}

			return { shareId };
		}),

	getRoastByShareId: baseProcedure
		.input(z.object({ shareId: z.string() }))
		.query(async ({ input }) => {
			const [roast] = await db
				.select()
				.from(roasts)
				.where(eq(roasts.shareId, input.shareId));

			if (!roast) throw new TRPCError({ code: "NOT_FOUND" });

			const issues = await db
				.select()
				.from(roastIssues)
				.where(eq(roastIssues.roastId, roast.id))
				.orderBy(asc(roastIssues.order));

			return { ...roast, issues };
		}),
});
