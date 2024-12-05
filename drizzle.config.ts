import type { Config } from "drizzle-kit";
import { DATABASE_URL } from "./app/utils/env";

export default {
	schema: "./app/drizzle/schema.server.ts",
	out: "./app/drizzle/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: DATABASE_URL as string,
	},
} satisfies Config;
