import { db } from "./db.server.js";
import { reset } from "drizzle-seed";
import { guestBookTable, projectsTable, usersTable } from "./schema.server.js";

async function main() {
	// await reset(db, { users: usersTable });
	await reset(db, { guestBook: guestBookTable });
	// await reset(db, { projects: projectsTable });
}

main();
