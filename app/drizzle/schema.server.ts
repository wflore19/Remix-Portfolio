import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
		.defaultNow()
		.notNull(),
	firstName: varchar("first_name", { length: 55 }).notNull(),
	lastName: varchar("last_name", { length: 55 }).notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
	profilePicture: varchar("profile_picture", { length: 255 }).default(""),
});

export const guestBookTable = pgTable("guest_book", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
		.defaultNow()
		.notNull(),
	userId: integer("user_id")
		.notNull()
		.references(() => usersTable.id),
	message: varchar({ length: 255 }).notNull(),
});

export const projectsTable = pgTable("project", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
		.defaultNow()
		.notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }).notNull(),
	githubUrl: varchar("github_url", { length: 255 }).notNull(),
	imageUrl: varchar("image_url", { length: 255 }).notNull(),
});

export const feedTable = pgTable("feed", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
		.defaultNow()
		.notNull(),
	userId: integer("user_id")
		.notNull()
		.references(() => usersTable.id),
	message: varchar({ length: 255 }).notNull(),
});

export const tagsTable = pgTable("tags", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
		.defaultNow()
		.notNull(),
	projectId: integer("project_id")
		.notNull()
		.references(() => projectsTable.id),
	name: varchar({ length: 255 }).notNull(),
});
