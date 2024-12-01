import { seed } from "drizzle-seed";
import { guestBookTable, projectsTable, usersTable } from "./schema.server";
import { db } from "./db.server";

async function main() {
	// await seed(db, { users: usersTable }, { count: 23 });
	await seed(db, { guestBook: guestBookTable }, { count: 23 });
	// await seed(db, { projects: projectsTable }, { count: 60 });
}
main();
