import type { Metadata } from "next";
import type { BundledLanguage } from "shiki";
import { CodeBlock } from "@/components/ui/code-block";

// --- Metadata (SEO) ---

export const metadata: Metadata = {
  title: "shame_leaderboard | devroast",
  description: "The most roasted code on the internet, ranked by shame.",
};

// --- Types ---

type LeaderboardEntry = {
  rank: number;
  score: number;
  language: BundledLanguage;
  code: string;
  lineCount: number;
};

// --- Helpers ---

function getScoreColor(score: number): string {
  if (score < 3) return "text-accent-red";
  if (score < 6) return "text-accent-amber";
  return "text-accent-green";
}

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
}

// --- Static Data ---

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    score: 1.2,
    language: "javascript",
    lineCount: 3,
    code: 'eval(prompt("enter code"))\ndocument.write(response)\n// trust the user lol',
  },
  {
    rank: 2,
    score: 1.8,
    language: "typescript",
    lineCount: 3,
    code: "if (x == true) { return true; }\nelse if (x == false) { return false; }\nelse { return !false; }",
  },
  {
    rank: 3,
    score: 2.1,
    language: "sql",
    lineCount: 2,
    code: "SELECT * FROM users WHERE 1=1\n-- TODO: add authentication",
  },
  {
    rank: 4,
    score: 2.3,
    language: "java",
    lineCount: 3,
    code: "catch (e) {\n  // ignore\n}",
  },
  {
    rank: 5,
    score: 2.5,
    language: "javascript",
    lineCount: 3,
    code: "const sleep = (ms) =>\n  new Date(Date.now() + ms)\n  while(new Date() < end) {}",
  },
];

// --- Page ---

export default function LeaderboardPage() {
  return (
    <main className="mx-auto flex max-w-240 flex-col gap-10 px-10 pb-16 pt-10">
      {/* Hero Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[32px] font-bold text-accent-green">
            {">"}
          </span>
          <h1 className="font-mono text-[28px] font-bold">shame_leaderboard</h1>
        </div>

        <p className="text-sm text-secondary">
          {"// the most roasted code on the internet"}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-xs text-tertiary">2,847 submissions</span>
          <span className="text-xs text-tertiary">·</span>
          <span className="text-xs text-tertiary">avg score: 4.2/10</span>
        </div>
      </section>

      {/* Leaderboard Entries */}
      <section className="flex flex-col gap-5">
        {leaderboardData.map((entry) => (
          <article
            key={entry.rank}
            className="overflow-hidden rounded border border-border"
          >
            {/* Meta Row - header code blocks*/}
            <div className="flex h-12 items-center justify-between border-b border-border px-5">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-tertiary">#</span>
                  <span className="text-sm font-bold text-accent-amber">
                    {entry.rank}
                  </span>
                </span>

                <span className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-tertiary">score</span>
                  <span
                    className={`text-sm font-bold ${getScoreColor(entry.score)}`}
                  >
                    {entry.score}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-secondary">
                  {entry.language}
                </span>
                <span className="font-mono text-xs text-tertiary">
                  {pluralize(entry.lineCount, "line", "lines")}
                </span>
              </div>
            </div>

            {/* Code Block */}
            <CodeBlock
              code={entry.code}
              lang={entry.language}
              showHeader={false}
              showLineNumbers
              className="rounded-none border-0"
            />
          </article>
        ))}
      </section>
    </main>
  );
}
