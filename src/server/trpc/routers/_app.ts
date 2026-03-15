import { createTRPCRouter } from "../init";
import { roastRouter } from "./roats";


export const appRouter = createTRPCRouter({
	roast: roastRouter,
});

export type AppRouter = typeof appRouter;