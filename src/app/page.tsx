import { Suspense } from "react";
import { HomepageHero } from "@/components/homepage-hero";
import { HomepageStats } from "@/components/homepage-stats";
import { HomepageStatsSkeleton } from "@/components/homepage-stats-skeleton";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { LeaderboardPreviewSkeleton } from "@/components/leaderboard-preview-skeleton";

export default function Home() {
	return (
		<main className="mx-auto flex max-w-240 flex-col items-center gap-8 px-10 pb-16 pt-20">
			<HomepageHero />

			<Suspense fallback={<HomepageStatsSkeleton />}>
				<HomepageStats />
			</Suspense>

			<div className="h-15" />

			<Suspense fallback={<LeaderboardPreviewSkeleton />}>
				<LeaderboardPreview />
			</Suspense>
		</main>
	);
}
