import type { Metadata } from "next";
import { Suspense } from "react";
import { LeaderboardFull } from "@/components/leaderboard-full";
import { LeaderboardFullSkeleton } from "@/components/leaderboard-full-skeleton";

export const metadata: Metadata = {
  title: "shame_leaderboard | devroast",
  description: "The most roasted code on the internet, ranked by shame.",
};

export default function LeaderboardPage() {
  return (
    <main className="mx-auto flex max-w-240 flex-col gap-10 px-10 pb-16 pt-10">
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
      </section>

      <Suspense fallback={<LeaderboardFullSkeleton />}>
        <LeaderboardFull />
      </Suspense>
    </main>
  );
}
