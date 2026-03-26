import { getCaller } from "@/trpc/server";
import { HomepageStatsClient } from "./homepage-stats-client";

export async function HomepageStats() {
	const caller = await getCaller();
	const data = await caller.metrics.getHomepageStats();

	return (
		<HomepageStatsClient
			totalRoasts={data.totalRoasts}
			avgScore={data.avgScore}
		/>
	);
}
