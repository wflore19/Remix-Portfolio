import { InferSelectModel, eq } from "drizzle-orm";
import { usersTable } from "../schema.server";
import { db } from "../db.server";

export type User = InferSelectModel<typeof usersTable>;

export async function getUserById(id: number) {
	const [user] = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.id, id));

	return user;
}

/**
 * Get a user by email
 * @param email - User email
 * @returns {Promise<User>} - The user
 */
export async function getUserByEmail(email: string) {
	const userData = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.email, email));

	if (!userData) throw new Error("User not found");

	return userData[0];
}

/**
 * Create a new user
 * @param email - User email
 * @param firstName - User first name
 * @param lastName - User last name
 * @returns {Promise<{ insertedId: number }>} - The inserted user ID
 */
export async function createUser(
	email: string,
	firstName: string,
	lastName: string
) {
	return await db
		.insert(usersTable)
		.values({ email, firstName, lastName })
		.returning({ insertedId: usersTable.id });
}

/**
 * Update a user
 * @param id - User ID
 * @param data - User data
 */
export async function updateUser(id: number, data: Partial<User>) {
	if (Object.keys(data).length === 0) return;

	await db.update(usersTable).set(data).where(eq(usersTable.id, id));
}
