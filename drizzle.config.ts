import type { Config } from "drizzle-kit";

export default {
	schema: "./app/drizzle/schema.server.ts",
	out: "./app/drizzle/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
} satisfies Config;
