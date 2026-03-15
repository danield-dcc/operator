import { sql } from "drizzle-orm";
import { roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/server/trpc/init";


export const roastRouter = createTRPCRouter({
  getStats: baseProcedure.query(async ({ ctx }) => {
    const [row] = await ctx.db
      .select({
        totalRoasts: sql<number>`count(*)`,
        avgScore: sql<number>`avg(${roasts.score})`,
      })
      .from(roasts);

    const totalRoasts = Number(row?.totalRoasts ?? 0);
    const avgScoreRaw = row?.avgScore ? Number(row.avgScore) : 0;
    const avgScore = Math.round(avgScoreRaw * 10) / 10;

    return {
      totalRoasts,
      avgScore,
    };
  })
});