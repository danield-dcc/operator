import { avg, count } from "drizzle-orm";
import { roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

export const metricsRouter = createTRPCRouter({
	getHomepageStats: baseProcedure.query(async ({ ctx }) => {
		const [result] = await ctx.db
			.select({
				totalRoasts: count(roasts.id),
				avgScore: avg(roasts.score),
			})
			.from(roasts);

		const rawAvg = result?.avgScore ? Number.parseFloat(result.avgScore) : 0;

		return {
			totalRoasts: result?.totalRoasts ?? 0,
			avgScore: Math.round(rawAvg * 10) / 10,
		};
	}),
});
