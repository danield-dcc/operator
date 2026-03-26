import { diffLines } from "diff";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { BundledLanguage } from "shiki";
import {
	AnalysisCardDescription,
	AnalysisCardRoot,
	AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCaller } from "@/trpc/server";

// --- Types ---

type DiffLineData = {
	id: string;
	type: "added" | "removed" | "context";
	code: string;
};

// --- Helpers ---

function getVerdictStatus(verdict: string): "critical" | "warning" | "good" {
	if (verdict === "disaster" || verdict === "needs_serious_help")
		return "critical";
	if (verdict === "needs_improvement") return "warning";
	return "good";
}

function buildDiffLines(original: string, suggested: string): DiffLineData[] {
	return diffLines(original, suggested).flatMap((part, partIndex) => {
		const lines = part.value.replace(/\n$/, "").split("\n");
		const type = part.added ? "added" : part.removed ? "removed" : "context";
		return lines.map((code, lineIndex) => ({
			id: `${type}-${partIndex}-${lineIndex}`,
			type,
			code,
		}));
	});
}

function SectionTitle({ children }: { children: string }) {
	return (
		<div className="flex items-center gap-2">
			<span className="text-sm font-bold text-accent-green">{"//"}</span>
			<h2 className="text-sm font-bold">{children}</h2>
		</div>
	);
}

// --- Metadata ---

type PageProps = {
	params: Promise<{ id: string }>;
};

function RoastResultSkeleton() {
	return (
		<main className="mx-auto flex max-w-240 flex-col gap-10 px-10 pb-16 pt-10">
			<div className="flex items-center gap-12">
				<div className="h-28 w-28 animate-pulse rounded-full bg-elevated" />
				<div className="flex flex-1 flex-col gap-4">
					<div className="h-6 w-40 animate-pulse rounded bg-elevated" />
					<div className="h-8 w-3/4 animate-pulse rounded bg-elevated" />
					<div className="h-4 w-48 animate-pulse rounded bg-elevated" />
				</div>
			</div>
			<hr className="border-border" />
			<div className="h-64 animate-pulse rounded border border-border bg-elevated" />
		</main>
	);
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { id } = await params;

	return {
		title: `roast ${id.slice(0, 8)} | devroast`,
		description:
			"Code roast result — see the score, analysis, and suggested fixes.",
	};
}

// --- Page ---

async function RoastResultContent({ params }: PageProps) {
	const { id } = await params;

	const caller = await getCaller();
	const roast = await caller.roasts
		.getRoastByShareId({ shareId: id })
		.catch(() => notFound());

	const verdictStatus = getVerdictStatus(roast.verdict);
	const language = (roast.language ?? "text") as BundledLanguage;
	const diffLines_ = roast.suggestedCode
		? buildDiffLines(roast.code, roast.suggestedCode)
		: null;

	return (
		<main className="mx-auto flex max-w-240 flex-col gap-10 px-10 pb-16 pt-10">
			{/* 1. Score Hero */}
			<section className="flex items-center gap-12">
				<ScoreRing score={roast.score} />

				<div className="flex min-w-0 flex-1 flex-col gap-4">
					<StatusBadge status={verdictStatus}>
						verdict: {roast.verdict}
					</StatusBadge>

					<p className="text-xl leading-relaxed">{roast.roastQuote}</p>

					<div className="flex items-center gap-4">
						<span className="text-xs text-tertiary">lang: {language}</span>
						<span className="text-xs text-tertiary">·</span>
						<span className="text-xs text-tertiary">
							{roast.lineCount} lines
						</span>
					</div>

					<div>
						<Button variant="secondary">$ share_roast</Button>
					</div>
				</div>
			</section>

			{/* Divider */}
			<hr className="border-border" />

			{/* 2. Submitted Code */}
			<section className="flex flex-col gap-4">
				<SectionTitle>your_submission</SectionTitle>

				<CodeBlock
					code={roast.code}
					lang={language}
					showHeader={false}
					showLineNumbers
				/>
			</section>

			{/* Divider */}
			<hr className="border-border" />

			{/* 3. Detailed Analysis */}
			<section className="flex flex-col gap-6">
				<SectionTitle>detailed_analysis</SectionTitle>

				<div className="grid grid-cols-2 gap-5">
					{roast.issues.map((issue) => (
						<AnalysisCardRoot key={issue.title}>
							<StatusBadge status={issue.severity}>
								{issue.severity}
							</StatusBadge>
							<AnalysisCardTitle>{issue.title}</AnalysisCardTitle>
							<AnalysisCardDescription>
								{issue.description}
							</AnalysisCardDescription>
						</AnalysisCardRoot>
					))}
				</div>
			</section>

			{/* 4. Suggested Fix */}
			{diffLines_ && (
				<>
					{/* Divider */}
					<hr className="border-border" />

					<section className="flex flex-col gap-6">
						<SectionTitle>suggested_fix</SectionTitle>

						<div className="overflow-hidden rounded border border-border bg-input">
							<div className="flex h-10 items-center border-b border-border px-4">
								<span className="font-mono text-xs font-medium text-secondary">
									your_code.{language} → improved_code.{language}
								</span>
							</div>

							<div className="py-1">
								{diffLines_.map((line) => (
									<DiffLine key={line.id} type={line.type}>
										{line.code}
									</DiffLine>
								))}
							</div>
						</div>
					</section>
				</>
			)}
		</main>
	);
}

export default function RoastResultPage({ params }: PageProps) {
	return (
		<Suspense fallback={<RoastResultSkeleton />}>
			<RoastResultContent params={params} />
		</Suspense>
	);
}
