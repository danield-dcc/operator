"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import {
  TableRowRank,
  TableRowScore,
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
      <div className="flex items-start gap-6 border-border px-5 pt-3 font-mono text-xs">
        <TableRowRank>#{rank}</TableRowRank>
        <TableRowScore tone={tone}>{score}</TableRowScore>

        <span className="min-w-0 flex-1 whitespace-pre-wrap break-all line-clamp-3 text-xs text-secondary pb-3">
          {codePreview}
        </span>

        <TableRowLanguage>{language}</TableRowLanguage>
      </div>

      <Collapsible.Trigger className="w-full flex items-center justify-center border-b border-t border-border px-5 pb-3 pt-2 text-left text-xs text-tertiary hover:text-secondary transition-colors cursor-pointer font-mono">
        show me more ▾
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
