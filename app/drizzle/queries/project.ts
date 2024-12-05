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

export async function createProject(
	name: string,
	description: string,
	githubUrl: string,
	imageUrl: string,
	websiteUrl: string,
	tags: string
) {
	await db.insert(projectsTable).values({
		name,
		description,
		githubUrl,
		imageUrl,
		websiteUrl,
		tags,
	});
}
