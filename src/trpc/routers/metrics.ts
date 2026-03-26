import { asc, avg, count } from "drizzle-orm";
import { cacheLife } from "next/cache";
import { type BundledLanguage, codeToHtml } from "shiki";
import { db } from "@/db";
import { roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

// --- Cached data-fetching functions ---

async function fetchHomepageStats() {
	"use cache";
	cacheLife({ expire: 3600 });

	const [result] = await db
		.select({ totalRoasts: count(roasts.id), avgScore: avg(roasts.score) })
		.from(roasts);

	const rawAvg = result?.avgScore ? Number.parseFloat(result.avgScore) : 0;

	return {
		totalRoasts: result?.totalRoasts ?? 0,
		avgScore: Math.round(rawAvg * 10) / 10,
	};
}

async function fetchFullLeaderboard() {
	"use cache";
	cacheLife({ expire: 3600 });

	const [statsResult, worstRoasts] = await Promise.all([
		db
			.select({ totalRoasts: count(roasts.id), avgScore: avg(roasts.score) })
			.from(roasts),
		db
			.select({
				shareId: roasts.shareId,
				code: roasts.code,
				language: roasts.language,
				score: roasts.score,
			})
			.from(roasts)
			.orderBy(asc(roasts.score))
			.limit(20),
	]);

	const [stats] = statsResult;
	const rawAvg = stats?.avgScore ? Number.parseFloat(stats.avgScore) : 0;

	const entries = await Promise.all(
		worstRoasts.map(async (r, i) => {
			const lang = (r.language ?? "text") as BundledLanguage;
			let highlightedHtml: string;
			try {
				highlightedHtml = await codeToHtml(r.code, { lang, theme: "vesper" });
			} catch {
				highlightedHtml = await codeToHtml(r.code, {
					lang: "text",
					theme: "vesper",
				});
			}
			return {
				rank: i + 1,
				shareId: r.shareId,
				codePreview: r.code.split("\n").slice(0, 3).join("\n"),
				language: lang,
				score: r.score ?? 0,
				lineCount: r.code.split("\n").length,
				highlightedHtml,
			};
		}),
	);

	return {
		totalRoasts: stats?.totalRoasts ?? 0,
		avgScore: Math.round(rawAvg * 10) / 10,
		entries,
	};
}

async function fetchShameLeaderboard() {
	"use cache";
	cacheLife({ expire: 3600 });

	// Run both queries in parallel to avoid sequential round-trips to the DB
	const [statsResult, worstRoasts] = await Promise.all([
		db
			.select({ totalRoasts: count(roasts.id), avgScore: avg(roasts.score) })
			.from(roasts),
		db
			.select({
				shareId: roasts.shareId,
				code: roasts.code,
				language: roasts.language,
				score: roasts.score,
			})
			.from(roasts)
			.orderBy(asc(roasts.score))
			.limit(3),
	]);

	const [stats] = statsResult;
	const rawAvg = stats?.avgScore ? Number.parseFloat(stats.avgScore) : 0;

	const entries = await Promise.all(
		worstRoasts.map(async (r, i) => {
			const lang = (r.language ?? "text") as BundledLanguage;
			let highlightedHtml: string;
			try {
				highlightedHtml = await codeToHtml(r.code, { lang, theme: "vesper" });
			} catch {
				highlightedHtml = await codeToHtml(r.code, {
					lang: "text",
					theme: "vesper",
				});
			}

			return {
				rank: i + 1,
				shareId: r.shareId,
				codePreview: r.code.split("\n").slice(0, 3).join("\n"),
				language: lang,
				score: r.score ?? 0,
				lineCount: r.code.split("\n").length,
				highlightedHtml,
			};
		}),
	);

	return {
		totalRoasts: stats?.totalRoasts ?? 0,
		avgScore: Math.round(rawAvg * 10) / 10,
		entries,
	};
}

// --- Router ---

export const metricsRouter = createTRPCRouter({
	getHomepageStats: baseProcedure.query(() => fetchHomepageStats()),
	getFullLeaderboard: baseProcedure.query(() => fetchFullLeaderboard()),
	getShameLeaderboard: baseProcedure.query(() => fetchShameLeaderboard()),
});
