import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config(); // <-- add this if missing

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	casing: "snake_case",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
