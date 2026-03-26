"use client";

import { HomepageHero } from "@/components/homepage-hero";
import { TRPCReactProvider } from "@/trpc/client";

export function HomepageHeroProvider() {
	return (
		<TRPCReactProvider>
			<HomepageHero />
		</TRPCReactProvider>
	);
}
