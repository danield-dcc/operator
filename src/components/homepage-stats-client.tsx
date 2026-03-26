"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";

type HomepageStatsClientProps = {
	totalRoasts: number;
	avgScore: number;
};

export function HomepageStatsClient({
	totalRoasts,
	avgScore,
}: HomepageStatsClientProps) {
	const [animated, setAnimated] = useState(false);

	useEffect(() => {
		setAnimated(true);
	}, []);

	return (
		<p className="text-xs text-tertiary">
			<NumberFlow value={animated ? totalRoasts : 0} locales="en-US" /> codes
			roasted · avg score:{" "}
			<NumberFlow
				value={animated ? avgScore : 0}
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
