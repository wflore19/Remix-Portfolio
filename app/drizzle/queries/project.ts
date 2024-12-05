import { db } from "../db.server";
import { projectsTable } from "../schema.server";
import { eq, InferSelectModel } from "drizzle-orm";

export type Projects = InferSelectModel<typeof projectsTable>;

export async function getProjects() {
	const projects = await db.select().from(projectsTable);

	return projects;
}

export async function getProject(id: number) {
	const project = await db
		.select()
		.from(projectsTable)
		.where(eq(projectsTable.id, id));
	return project;
}
