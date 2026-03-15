"use client";

import Link from "next/link";
import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import {
  TableRowCode,
  TableRowLanguage,
  TableRowRank,
  TableRowRoot,
  TableRowScore,
} from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";

type LeaderboardRow = {
  rank: number;
  score: number;
  codePreview: string;
  language: string;
  tone: "critical" | "warning" | "good" | "neutral";
};

const leaderboardData: LeaderboardRow[] = [
  {
    rank: 1,
    score: 1.2,
    codePreview:
      'eval(prompt("enter code")) document.write(response) // trust the user lol',
    tone: "critical",
    language: "javascript",
  },
  {
    rank: 2,
    score: 1.8,
    codePreview:
      "if (x == true) { return true; } else if (x == false) { return false; }",
    tone: "critical",
    language: "typescript",
  },
  {
    rank: 3,
    score: 2.1,
    codePreview: "SELECT * FROM users WHERE 1=1 -- TODO: add authentication",
    tone: "critical",
    language: "sql",
  },
];

export default function Home() {
  const [code, setCode] = useState("");

  return (
    <main className="mx-auto flex max-w-240 flex-col items-center gap-8 px-10 pb-16 pt-20">
      {/* Hero */}
      <section className="flex flex-col items-center gap-3">
        <h1 className="flex items-center gap-3 text-4xl font-bold">
          <span className="text-accent-green">$</span>
          paste your code. get roasted.
        </h1>

        <p className="text-sm text-secondary">
          {
            "// drop your code below and we'll rate it — brutally honest or full roast mode"
          }
        </p>
      </section>

      {/* Code Editor */}
      <CodeEditor
        code={code}
        onChange={setCode}
        placeholder="// paste your code here..."
        className="max-w-195"
      />

      {/* Actions Bar */}
      <div className="flex w-full max-w-195 items-center justify-between">
        <div className="flex items-center gap-4">
          <Toggle label="roast mode" defaultChecked />
          <span className="text-xs text-tertiary">
            {"// maximum sarcasm enabled"}
          </span>
        </div>

        <Button variant="primary">$ roast_my_code</Button>
      </div>

      {/* Footer Stats */}
      <p className="text-xs text-tertiary">
        2,847 codes roasted · avg score: 4.2/10
      </p>

      {/* Spacer */}
      <div className="h-15" />

      {/* Leaderboard Preview */}
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
          {leaderboardData.map((row) => (
            <TableRowRoot key={row.rank}>
              <TableRowRank>#{row.rank}</TableRowRank>
              <TableRowScore tone={row.tone}>{row.score}</TableRowScore>
              <TableRowCode>{row.codePreview}</TableRowCode>
              <TableRowLanguage>{row.language}</TableRowLanguage>
            </TableRowRoot>
          ))}
        </div>

        <p className="py-2 text-center text-xs text-tertiary">
          showing top 3 of 2,847 ·{" "}
          <Link
            href="/leaderboard"
            className="transition-colors hover:text-primary"
          >
            {"view full leaderboard >>"}
          </Link>
        </p>
      </section>
    </main>
  );
}
