import {
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

export async function loader() {
	const projects: Projects[] = await db.select().from(projectsTable);
	return projects;
}

export default function ProjectsPage() {
	const projects = useLoaderData() as Projects[];

	return (
		<Suspense fallback={<Spinner />}>
			<Await resolve={[projects]}>
				<Box>
					{projects.map((project, idx) => {
						return (
							<Box key={idx} my={"3"}>
								<img
									src={project.imageUrl}
									alt={project.name}
									style={{
										objectFit: "cover",
										width: "100%",
										height: "13rem",
										objectPosition: "50% 5%",
									}}
								/>
								<Flex
									gap={"1"}
									align={{ initial: "start", sm: "center" }}
									direction={{
										initial: "column",
										sm: "row",
									}}>
									<Heading size={"3"}>{project.name}</Heading>
									<Box>
										<Link
											href={project.githubUrl}
											target={"_blank"}>
											<Flex gap={"1"} align={"center"}>
												<RiLink size={12} />
												<Text size={"1"}>
													{project.githubUrl}
												</Text>
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
				</Box>
			</Await>
		</Suspense>
	);
}
