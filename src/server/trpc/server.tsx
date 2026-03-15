import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "@/server/trpc/init";
import { makeQueryClient } from "@/server/trpc/query-client";
import { appRouter } from "@/server/trpc/routers/_app";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
	ctx: createTRPCContext,
	router: appRouter,
	queryClient: getQueryClient,
});

export function HydrateClient({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			{children}
		</HydrationBoundary>
	);
}
