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
import { getTimeAgo } from "~/utils/format";
import { db } from "~/drizzle/db.server";
import {
	guestBookTable,
	projectsTable,
	usersTable,
} from "~/drizzle/schema.server";
import { Await, Link, redirect, useLoaderData } from "@remix-run/react";
import { InferSelectModel, eq } from "drizzle-orm";
import React, { Suspense } from "react";
import { RiContactsBookLine, RiStackLine, RiUserLine } from "@remixicon/react";

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

type User = InferSelectModel<typeof usersTable>;
type GuestBook = InferSelectModel<typeof guestBookTable>;
type Projects = InferSelectModel<typeof projectsTable>;

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const guestBookParam = url.searchParams.get("guestBook");
	const LIMIT = 10;

	const guestBookCount = await db.$count(guestBookTable);

	let offset;
	if (Number(guestBookParam) < 0 || guestBookCount < Number(guestBookParam)) {
		const url = new URL(request.url);
		url.searchParams.set("guestBook", "0");
		throw redirect(url.pathname);
	} else if (guestBookParam) {
		offset = parseInt(guestBookParam);
	} else {
		offset = 0;
	}

	const [user] = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.id, 1));

	const guestBook = await db
		.select()
		.from(guestBookTable)
		.offset(offset)
		.limit(LIMIT);

	const projects = await db.select().from(projectsTable);

	return { user, guestBook, guestBookCount, projects, offset, LIMIT };
}

export default function Index() {
	const { user, guestBook, guestBookCount, projects, offset, LIMIT } =
		useLoaderData<{
			user: User;
			guestBook: GuestBook[];
			guestBookCount: number;
			projects: Projects[];
			offset: number;
			LIMIT: number;
		}>();

	return (
		<Suspense fallback={<Spinner />}>
			<Await resolve={[user, guestBook, projects]}>
				<div className="htmlRoot">
					<Box width={"full"} maxWidth={"800px"} mx={"auto"}>
						<Card size="3">
							<Flex direction="column" gap="3">
								<Heading size={"8"} weight="bold" mt={"8"}>
									wflore19 Portfolio
								</Heading>

								<Flex>
									<Avatar
										src={user.profilePicture}
										fallback={user.name[0]}
										alt={user.name}
										size={"8"}
										radius={"full"}
										mt={"3"}
									/>
									<Flex
										direction={"column"}
										gap={"2"}
										ml={"3"}
										mt={"3"}>
										<Flex direction={"column"} gap={"0"}>
											<Text size={"4"} weight={"bold"}>
												Name
											</Text>
											<Text size={"4"}>{user.name}</Text>
										</Flex>
										<Flex direction={"column"} gap={"0"}>
											<Text size={"4"} weight={"bold"}>
												Created At
											</Text>
											<Text size={"4"}>
												{getTimeAgo(user.createdAt)}
											</Text>
										</Flex>
									</Flex>
								</Flex>

								<Tabs.Root defaultValue="guest book" mt={"3"}>
									<Tabs.List size={"2"}>
										<Tabs.Trigger value="profile">
											<Flex align={"center"}>
												<RiUserLine size={20} />
												<Text size={"5"} ml={"2"}>
													Profile
												</Text>
											</Flex>
										</Tabs.Trigger>
										<Tabs.Trigger value="guest book">
											<Flex align={"center"}>
												<RiContactsBookLine size={20} />
												<Text size={"5"} ml={"2"}>
													Guest Book
												</Text>
											</Flex>
										</Tabs.Trigger>
										<Tabs.Trigger value="projects">
											<Flex align={"center"}>
												<RiStackLine size={20} />
												<Text size={"5"} ml={"2"}>
													Projects
												</Text>
											</Flex>
										</Tabs.Trigger>
									</Tabs.List>

									<Tabs.Content value="profile">
										<Box my={"5"}></Box>
									</Tabs.Content>

									<Tabs.Content value="guest book">
										<Box my={"5"}>
											{guestBook.map((guestBookItem) => {
												return (
													<React.Fragment key={guestBookItem.id}>
														<Card key={guestBookItem.id} my={"3"}>
															<Text size={"2"}>
																{guestBookItem.id}
															</Text>
															<Flex direction={"column"}>
																<Text>
																	FIRST NAME:{" "}
																	{guestBookItem.firstName}
																</Text>
																<Text>
																	LAST NAME:
																	{guestBookItem.lastName}
																</Text>
																<Text>
																	EMAIL: {guestBookItem.email}
																</Text>
																<Text>
																	MESG: {guestBookItem.message}
																</Text>
															</Flex>
														</Card>
													</React.Fragment>
												);
											})}
										</Box>

										<Flex justify={"center"} gap={"3"}>
											{offset + 5 >= guestBookCount && (
												<Link to={`/?guestBook=${offset - LIMIT}`}>
													Prev
												</Link>
											)}
											{offset > 0 &&
												offset + LIMIT < guestBookCount && (
													<React.Fragment>
														<Link
															to={`/?guestBook=${
																offset - LIMIT
															}`}>
															Prev
														</Link>
														<Link
															to={`/?guestBook=${
																offset + LIMIT
															}`}>
															Next
														</Link>
													</React.Fragment>
												)}
											{offset === 0 && (
												<Link to={`/?guestBook=${offset + LIMIT}`}>
													Next
												</Link>
											)}
										</Flex>
										<Flex justify={"center"}>
											<Text size={"2"}>
												{`${offset}-${guestBookCount}`}
											</Text>
										</Flex>
									</Tabs.Content>

									<Tabs.Content value="projects">
										<Box my={"5"}></Box>
									</Tabs.Content>
								</Tabs.Root>
							</Flex>
						</Card>
					</Box>
				</div>
			</Await>
		</Suspense>
	);
}

// function NotificationItem({ notification }: { notification: any }) {
// 	return (
// 		<Flex
// 			p="3"
// 			gap="3"
// 			align="start"
// 			style={{
// 				borderBottom: "1px solid var(--gray-5)",
// 			}}>
// 			<Flex direction="column" gap="1">
// 				<Flex gap="2" align="center">
// 					<Text weight="bold">{notification.type}</Text>
// 					<Text size="1" color="gray">
// 						{getTimeAgo(new Date(notification.createdAt))}
// 					</Text>
// 				</Flex>

// 				<Text>{notification.message}</Text>
// 			</Flex>
// 		</Flex>
// 	);
// }
