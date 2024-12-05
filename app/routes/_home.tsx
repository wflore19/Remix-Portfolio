import {
	Box,
	Card,
	Flex,
	Tabs,
	Text,
	Spinner,
	Heading,
	Avatar,
} from "@radix-ui/themes";
import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { db } from "~/drizzle/db.server";
import { usersTable } from "~/drizzle/schema.server";
import { Await, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { RiContactsBookLine, RiStackLine, RiUserLine } from "@remixicon/react";
import { User } from "~/drizzle/queries/users";
import { getGoogleAuthURL } from "~/utils/auth";
import { getSession } from "~/utils/session.server";

export const meta: MetaFunction = () => {
	return [
		{ title: "wflore19 Portfolio" },
		{
			name: "description",
			content:
				"wflore19 Portfolio. Built with Remix, Drizzle, PostgreSQL, and Radix Themes.",
		},
	];
};

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request);

	const [user] = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.id, 1));

	if (!session.has("user_id")) {
		const googleAuthURL: string = await getGoogleAuthURL();
		return { user, googleAuthURL };
	}

	return { user, googleAuthURL: undefined };
}

export default function Layout() {
	const { user } = useLoaderData<{
		user: User;
	}>();

	return (
		<Suspense fallback={<Spinner />}>
			<Await resolve={[user]}>
				<div className="htmlRoot">
					<Box width={"full"} maxWidth={"800px"} mx={"auto"}>
						<Card size="3">
							<Flex direction="column" gap="3">
								<Heading size={"8"} weight="bold" mt={"8"}>
									wflore19 Portfolio
								</Heading>

								<Flex>
									<Avatar
										src={user.profilePicture!}
										fallback={user.firstName[0]}
										alt={user.firstName}
										size={"8"}
										radius={"full"}
										mt={"3"}
									/>
									<Flex
										direction={"column"}
										ml={"3"}
										mt={"7"}>
										<Flex direction={"column"} gap={"0"}>
											<Text>{user.firstName}</Text>
										</Flex>

										<Text>Full-stack web developer</Text>
									</Flex>
								</Flex>

								<Tabs.Root defaultValue="feed" mt={"3"}>
									<Tabs.List size={"2"}>
										<Tabs.Trigger value="feed">
											<NavLink
												to="/feed"
												style={{
													textDecoration: "none",
													color: "inherit",
													width: "100%",
												}}>
												<Flex align={"center"}>
													<RiUserLine size={20} />
													<Text size={"5"} ml={"2"}>
														Feed
													</Text>
												</Flex>
											</NavLink>
										</Tabs.Trigger>
										<Tabs.Trigger value="book">
											<NavLink
												to="/book"
												style={{
													textDecoration: "none",
													color: "inherit",
													width: "100%",
												}}>
												<Flex align={"center"}>
													<RiContactsBookLine
														size={20}
													/>
													<Text size={"5"} ml={"2"}>
														Guest Book
													</Text>
												</Flex>
											</NavLink>
										</Tabs.Trigger>
										<Tabs.Trigger value="projects">
											<NavLink
												to="/projects"
												style={{
													textDecoration: "none",
													color: "inherit",
													width: "100%",
												}}>
												<Flex align={"center"}>
													<RiStackLine size={20} />
													<Text size={"5"} ml={"2"}>
														Projects
													</Text>
												</Flex>
											</NavLink>
										</Tabs.Trigger>
									</Tabs.List>
								</Tabs.Root>
								<Outlet />
							</Flex>
						</Card>
					</Box>
				</div>
			</Await>
		</Suspense>
	);
}
