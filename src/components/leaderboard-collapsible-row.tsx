"use client";

import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <div className="flex items-start gap-6 px-5 pt-3 font-mono text-xs">
        <TableRowRank>#{rank}</TableRowRank>
        <TableRowScore tone={tone}>{score}</TableRowScore>

        <div className="min-w-0 flex-1 pb-3">
          {open ? (
            <div
              data-shiki
              // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki-generated HTML
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <span className="whitespace-pre-wrap break-all line-clamp-3 text-xs text-secondary">
              {codePreview}
            </span>
          )}
        </div>

        <TableRowLanguage>{language}</TableRowLanguage>
      </div>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center border-t border-border px-5 pb-3 pt-2 text-xs text-tertiary hover:text-secondary transition-colors cursor-pointer font-mono"
      >
        {open ? "show less ▴" : "show me more ▾"}
      </button>
    </div>
  );
}
