import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	createdAt: timestamp({ precision: 6, withTimezone: true })
		.defaultNow()
		.notNull(),
	name: varchar({ length: 255 }).notNull(),
	firstName: varchar({ length: 55 }).notNull(),
	lastName: varchar({ length: 55 }).notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
	profilePicture: varchar({ length: 255 }).default("").notNull(),
});

export const guestBookTable = pgTable("guestBook", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	createdAt: timestamp({ precision: 6, withTimezone: true })
		.defaultNow()
		.notNull(),
	firstName: varchar({ length: 55 }).notNull(),
	lastName: varchar({ length: 55 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	message: varchar({ length: 255 }).notNull(),
	profilePicture: varchar({ length: 255 }).default("").notNull(),
});

export const projectsTable = pgTable("projects", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	createdAt: timestamp({ precision: 6, withTimezone: true })
		.defaultNow()
		.notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }).notNull(),
	githubUrl: varchar({ length: 255 }).notNull(),
	imageUrl: varchar({ length: 255 }).notNull(),
});
