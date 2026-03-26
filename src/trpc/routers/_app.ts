import { createTRPCRouter } from "../init";
import { metricsRouter } from "./metrics";
import { roastsRouter } from "./roasts";

export const appRouter = createTRPCRouter({
	metrics: metricsRouter,
	roasts: roastsRouter,
});

export type AppRouter = typeof appRouter;
