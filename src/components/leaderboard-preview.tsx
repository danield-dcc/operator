"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeaderboardCollapsibleRow } from "@/components/leaderboard-collapsible-row";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

type Tone = "critical" | "warning" | "good" | "neutral";

function getScoreTone(score: number): Tone {
	if (score < 3) return "critical";
	if (score < 6) return "warning";
	return "good";
}

export function LeaderboardPreview() {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(
		trpc.metrics.getShameLeaderboard.queryOptions(),
	);

	return (
		<section className="flex w-full flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="flex items-center gap-2 text-sm font-bold">
					<span className="text-accent-green">{"//"}</span>
					shame_leaderboard
				</h2>

				<Button variant="ghost">{"$ view_all >>"}</Button>
			</div>

			<p className="text-[13px] text-tertiary">
				{"// the worst code on the internet, ranked by shame"}
			</p>

			<div className="overflow-hidden rounded border border-border">
				{/* Table Header */}
				<div className="flex h-10 items-center gap-6 border-b border-border bg-surface px-5 text-xs font-medium text-tertiary">
					<span className="w-10 shrink-0">#</span>
					<span className="w-15 shrink-0">score</span>
					<span className="min-w-0 flex-1">code</span>
					<span className="w-25 shrink-0 text-right">lang</span>
				</div>

				{/* Table Rows */}
				{data.entries.map((row) => (
					<LeaderboardCollapsibleRow
						key={row.rank}
						rank={row.rank}
						score={row.score}
						language={row.language}
						lineCount={row.lineCount}
						codePreview={row.codePreview}
						highlightedHtml={row.highlightedHtml}
						tone={getScoreTone(row.score)}
					/>
				))}
			</div>

			<p className="py-2 text-center text-xs text-tertiary">
				showing top 3 of {data.totalRoasts.toLocaleString("en-US")} ·{" "}
				<Link
					href="/leaderboard"
					className="transition-colors hover:text-primary"
				>
					{"view full leaderboard >>"}
				</Link>
			</p>
		</section>
	);
}
