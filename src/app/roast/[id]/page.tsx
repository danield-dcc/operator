import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
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

// --- Types ---

type Issue = {
	severity: "critical" | "warning" | "good";
	title: string;
	description: string;
};

type DiffLineData = {
	type: "added" | "removed" | "context";
	code: string;
};

type RoastData = {
	id: string;
	score: number;
	verdict: string;
	verdictStatus: "critical" | "warning" | "good";
	roastQuote: string;
	language: string;
	lineCount: number;
	code: string;
	issues: Issue[];
	diff: {
		filename: string;
		lines: DiffLineData[];
	};
};

// --- Static Data ---

const roastData: RoastData = {
	id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	score: 3.5,
	verdict: "needs_serious_help",
	verdictStatus: "critical",
	roastQuote:
		'"this code looks like it was written during a power outage... in 2005."',
	language: "javascript",
	lineCount: 16,
	code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }

  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`,
	issues: [
		{
			severity: "critical",
			title: "using var instead of const/let",
			description:
				"var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
		},
		{
			severity: "warning",
			title: "imperative loop pattern",
			description:
				"for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
		},
		{
			severity: "good",
			title: "clear naming conventions",
			description:
				"calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
		},
		{
			severity: "good",
			title: "single responsibility",
			description:
				"the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
		},
	],
	diff: {
		filename: "your_code.ts → improved_code.ts",
		lines: [
			{ type: "context", code: "function calculateTotal(items) {" },
			{ type: "removed", code: "  var total = 0;" },
			{
				type: "removed",
				code: "  for (var i = 0; i < items.length; i++) {",
			},
			{ type: "removed", code: "    total = total + items[i].price;" },
			{ type: "removed", code: "  }" },
			{ type: "removed", code: "  return total;" },
			{
				type: "added",
				code: "  return items.reduce((sum, item) => sum + item.price, 0);",
			},
			{ type: "context", code: "}" },
		],
	},
};

// --- Helpers ---

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
	await connection();

	const { id } = await params;

	// For now, ignore the id and use static data
	void id;

	return (
		<main className="mx-auto flex max-w-240 flex-col gap-10 px-10 pb-16 pt-10">
			{/* 1. Score Hero */}
			<section className="flex items-center gap-12">
				<ScoreRing score={roastData.score} />

				<div className="flex min-w-0 flex-1 flex-col gap-4">
					<StatusBadge status={roastData.verdictStatus}>
						verdict: {roastData.verdict}
					</StatusBadge>

					<p className="text-xl leading-relaxed">{roastData.roastQuote}</p>

					<div className="flex items-center gap-4">
						<span className="text-xs text-tertiary">
							lang: {roastData.language}
						</span>
						<span className="text-xs text-tertiary">·</span>
						<span className="text-xs text-tertiary">
							{roastData.lineCount} lines
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
					code={roastData.code}
					lang="javascript"
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
					{roastData.issues.map((issue) => (
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

			{/* Divider */}
			<hr className="border-border" />

			{/* 4. Suggested Fix */}
			<section className="flex flex-col gap-6">
				<SectionTitle>suggested_fix</SectionTitle>

				<div className="overflow-hidden rounded border border-border bg-input">
					<div className="flex h-10 items-center border-b border-border px-4">
						<span className="font-mono text-xs font-medium text-secondary">
							{roastData.diff.filename}
						</span>
					</div>

					<div className="py-1">
						{roastData.diff.lines.map((line) => (
							<DiffLine key={`${line.type}-${line.code}`} type={line.type}>
								{line.code}
							</DiffLine>
						))}
					</div>
				</div>
			</section>
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
