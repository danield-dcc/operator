"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import {
	TableRowRank,
	TableRowScore,
	TableRowCode,
	TableRowLanguage,
} from "@/components/ui/table-row";

type Tone = "critical" | "warning" | "good" | "neutral";

type Props = {
	rank: number;
	score: number;
	language: string;
	lineCount: number;
	codePreview: string;
	highlightedHtml: string;
	tone: Tone;
};

export function LeaderboardCollapsibleRow({
	rank,
	score,
	language,
	lineCount,
	codePreview,
	highlightedHtml,
	tone,
}: Props) {
	return (
		<Collapsible.Root>
			<Collapsible.Trigger className="flex w-full items-center gap-6 border-b border-border px-5 h-12 font-mono text-xs text-left hover:bg-surface/50 transition-colors group cursor-pointer">
				<TableRowRank>#{rank}</TableRowRank>
				<TableRowScore tone={tone}>{score}</TableRowScore>
				<TableRowCode>{codePreview}</TableRowCode>
				<TableRowLanguage>{language}</TableRowLanguage>
				<span className="ml-auto text-tertiary transition-transform group-data-[open]:rotate-180">
					▾
				</span>
			</Collapsible.Trigger>

			<Collapsible.Panel>
				<div className="border-b border-border">
					<div className="flex items-center justify-between border-b border-border px-5 py-1.5 text-xs text-tertiary font-mono">
						<span>{language}</span>
						<span>
							{lineCount} {lineCount === 1 ? "line" : "lines"}
						</span>
					</div>
					<div
						data-shiki
						// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki-generated HTML
						dangerouslySetInnerHTML={{ __html: highlightedHtml }}
					/>
				</div>
			</Collapsible.Panel>
		</Collapsible.Root>
	);
}
