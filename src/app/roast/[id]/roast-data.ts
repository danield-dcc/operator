import "server-only";

import { notFound } from "next/navigation";
import { getCaller } from "@/trpc/server";

export type VerdictStatus = "critical" | "warning" | "good";

export function getVerdictStatus(verdict: string): VerdictStatus {
	if (verdict === "disaster" || verdict === "needs_serious_help") {
		return "critical";
	}

	if (verdict === "needs_improvement") {
		return "warning";
	}

	return "good";
}

export function getVerdictColor(status: VerdictStatus) {
	switch (status) {
		case "critical":
			return "#EF4444";
		case "warning":
			return "#F59E0B";
		default:
			return "#10B981";
	}
}

export function getRoastOgImagePath(shareId: string) {
	return `/roast/${shareId}/opengraph-image`;
}

export function buildRoastDescription(
	roastQuote: string,
	score: number,
	verdict: string,
) {
	const safeQuote = roastQuote.replace(/\s+/g, " ").trim();
	return `${verdict} · ${score.toFixed(1)}/10 · ${safeQuote}`;
}

export function truncateRoastQuote(quote: string, maxLength = 72) {
	const normalized = quote.replace(/\s+/g, " ").trim();

	if (normalized.length <= maxLength) {
		return normalized;
	}

	return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
}

export async function getRoastByShareIdOrThrow(shareId: string) {
	const caller = await getCaller();

	return caller.roasts.getRoastByShareId({ shareId }).catch(() => notFound());
}
