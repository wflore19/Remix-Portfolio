import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from "~/utils/env";

const connectionString = DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL is not set");
}

export const db = drizzle(connectionString);
