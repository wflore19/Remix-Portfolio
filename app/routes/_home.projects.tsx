import {
	Badge,
	Box,
	Flex,
	Heading,
	Link,
	Separator,
	Spinner,
	Text,
} from "@radix-ui/themes";
import { Await, useLoaderData } from "@remix-run/react";
import { RiLink } from "@remixicon/react";
import { Suspense } from "react";
import { db } from "~/drizzle/db.server";
import { Projects } from "~/drizzle/queries/project";
import { projectsTable } from "~/drizzle/schema.server";
import { Colors, getRandomColor } from "~/utils/colors";

export async function loader() {
	const projects: Projects[] = await db.select().from(projectsTable);
	return projects;
}

export default function ProjectsPage() {
	const projects = useLoaderData() as Projects[];

	return (
		<Suspense fallback={<Spinner />}>
			<Await resolve={[projects]}>
				{projects.map((project, idx) => {
					return (
						<Box key={idx} my={"3"}>
							<Link href={project.websiteUrl} target={"_blank"}>
								<div
									style={{
										borderRadius: "10% 30% 50% 70%; !important",
									}}>
									<img
										src={project.imageUrl}
										alt={project.name}
										style={{
											objectFit: "cover",
											width: "100%",
											height: "15rem",
											objectPosition: "50% 5%",
											borderRadius: "10% 30% 50% 70%; !important",
										}}
									/>
								</div>
							</Link>
							<Flex gap={"1"} direction={"column"}>
								<Flex key={idx} gap={"1"} align={"center"} mt={"2"}>
									{project.tags.split(",").map((tag, idx) => {
										const color = getRandomColor() as Colors;
										return (
											<Badge
												key={idx}
												variant="outline"
												color={color}>
												{tag.charAt(0).toUpperCase() + tag.slice(1)}
											</Badge>
										);
									})}
								</Flex>
								<Heading>{project.name}</Heading>
								<Box>
									<Link
										href={project.githubUrl}
										target={"_blank"}
										style={{ display: "inline-block" }}>
										<Flex gap={"1"} align={"center"}>
											<RiLink size={12} />
											<Text size={"1"}>{project.githubUrl}</Text>
										</Flex>
									</Link>
								</Box>
							</Flex>
							<Text>{project.description}</Text>

							{idx !== projects.length - 1 && (
								<Separator my="5" size="4" color="gray" />
							)}
						</Box>
					);
				})}
			</Await>
		</Suspense>
	);
}
