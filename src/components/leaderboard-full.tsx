import { LeaderboardCollapsibleRow } from "@/components/leaderboard-collapsible-row";
import { getCaller } from "@/trpc/server";

type Tone = "critical" | "warning" | "good" | "neutral";

function getScoreTone(score: number): Tone {
  if (score < 3) return "critical";
  if (score < 6) return "warning";
  return "good";
}

export async function LeaderboardFull() {
  const caller = await getCaller();
  const data = await caller.metrics.getFullLeaderboard();

  return (
    <>
      <div className="flex items-center gap-2 font-mono text-xs text-tertiary">
        <span>{data.totalRoasts.toLocaleString("en-US")} submissions</span>
        <span>·</span>
        <span>avg score: {data.avgScore}/10</span>
      </div>

      <div className="overflow-hidden rounded border border-border">
        <div className="flex h-10 items-center gap-6 border-b border-border bg-surface px-5 text-xs font-medium text-tertiary">
          <span className="w-10 shrink-0">#</span>
          <span className="w-15 shrink-0">score</span>
          <span className="min-w-0 flex-1">code</span>
          <span className="w-25 shrink-0 text-right">lang</span>
        </div>

        {data.entries.map((row) => (
          <LeaderboardCollapsibleRow
            key={row.rank}
            rank={row.rank}
            score={row.score}
            language={row.language}
            codePreview={row.codePreview}
            highlightedHtml={row.highlightedHtml}
            tone={getScoreTone(row.score)}
          />
        ))}
      </div>
    </>
  );
}
