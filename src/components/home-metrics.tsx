"use client";

import NumberFlow from "@number-flow/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTRPC } from "@/server/trpc/client";

type MetricsState = {
  totalRoasts: number;
  avgScore: number;
};

export function HomeMetrics() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.roast.getStats.queryOptions());
  const [display, setDisplay] = useState<MetricsState>({
    totalRoasts: 0,
    avgScore: 0,
  });

  useEffect(() => {
    setDisplay({
      totalRoasts: data.totalRoasts,
      avgScore: data.avgScore,
    });
  }, [data.avgScore, data.totalRoasts]);

  return (
    <p className="text-xs text-tertiary">
      <NumberFlow
        className="font-mono tabular-nums"
        format={{ maximumFractionDigits: 0 }}
        value={display.totalRoasts}
      />
      {" codes roasted · avg score: "}
      <NumberFlow
        className="font-mono tabular-nums"
        format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        value={display.avgScore}
      />
      /10
    </p>
  );
}
