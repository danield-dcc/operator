"use client";

import NumberFlow from "@number-flow/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";

export function HomepageStats() {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(
		trpc.metrics.getHomepageStats.queryOptions(),
	);

	const [animated, setAnimated] = useState(false);

	useEffect(() => {
		setAnimated(true);
	}, []);

	return (
		<p className="text-xs text-tertiary">
			<NumberFlow value={animated ? data.totalRoasts : 0} locales="en-US" />{" "}
			codes roasted · avg score:{" "}
			<NumberFlow
				value={animated ? data.avgScore : 0}
				locales="en-US"
				format={{
					minimumFractionDigits: 1,
					maximumFractionDigits: 1,
				}}
			/>
			/10
		</p>
	);
}
