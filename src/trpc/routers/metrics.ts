import { avg, count, asc } from "drizzle-orm";
import { roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";
import { codeToHtml, type BundledLanguage } from "shiki";

export const metricsRouter = createTRPCRouter({
	getHomepageStats: baseProcedure.query(async ({ ctx }) => {
		const [result] = await ctx.db
			.select({
				totalRoasts: count(roasts.id),
				avgScore: avg(roasts.score),
			})
			.from(roasts);

		const rawAvg = result?.avgScore ? Number.parseFloat(result.avgScore) : 0;

		return {
			totalRoasts: result?.totalRoasts ?? 0,
			avgScore: Math.round(rawAvg * 10) / 10,
		};
	}),

	getShameLeaderboard: baseProcedure.query(async ({ ctx }) => {
		// Run both queries in parallel to avoid sequential round-trips to the DB
		const [statsResult, worstRoasts] = await Promise.all([
			ctx.db.select({ totalRoasts: count(roasts.id) }).from(roasts),
			ctx.db
				.select({
					shareId: roasts.shareId,
					code: roasts.code,
					language: roasts.language,
					score: roasts.score,
				})
				.from(roasts)
				.orderBy(asc(roasts.score))
				.limit(3),
		]);

		const [stats] = statsResult;

		const entries = await Promise.all(
			worstRoasts.map(async (r, i) => {
				const lang = (r.language ?? "text") as BundledLanguage;
				let highlightedHtml: string;
				try {
					highlightedHtml = await codeToHtml(r.code, { lang, theme: "vesper" });
				} catch {
					highlightedHtml = await codeToHtml(r.code, {
						lang: "text",
						theme: "vesper",
					});
				}

				return {
					rank: i + 1,
					shareId: r.shareId,
					codePreview: r.code.split("\n")[0]?.slice(0, 60) ?? "",
					language: lang,
					score: r.score ?? 0,
					lineCount: r.code.split("\n").length,
					highlightedHtml,
				};
			}),
		);

		return {
			totalRoasts: stats?.totalRoasts ?? 0,
			entries,
		};
	}),
});
