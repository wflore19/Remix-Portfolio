import {
	Avatar,
	Box,
	Button,
	Flex,
	Spinner,
	TextArea,
	Text,
	Separator,
} from "@radix-ui/themes";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Await, Form, redirect, useLoaderData } from "@remix-run/react";
import { RiEditLine } from "@remixicon/react";
import React, { Suspense } from "react";
import {
	FeedPost,
	createFeedPost,
	getFeedPostsWithOffset,
} from "~/drizzle/queries/feed";
import { getUserById } from "~/drizzle/queries/users";
import { getGoogleAuthURL } from "~/utils/auth";
import { getTimeAgo } from "~/utils/format";
import { ensureUserAuthenticated, user } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await ensureUserAuthenticated(request);
	const feed = await getFeedPostsWithOffset(0);

	let userId;
	if (session) {
		userId = user(session);
		const userProfile = await getUserById(userId);

		if (userProfile.email === process.env.EMAIL) {
			return { feed: feed ?? [], userId };
		}
	}

	const googleAuthURL: string = await getGoogleAuthURL();
	return { feed: feed ?? [], userId: undefined, googleAuthURL };
}

export default function FeedPage() {
	const { feed, userId } = useLoaderData() as {
		feed: FeedPost[];
		userId: number | undefined;
	};

	const [textAreaValue, setTextAreaValue] = React.useState("");

	return (
		<Suspense fallback={<Spinner />}>
			<Await resolve={[feed]}>
				<Box my={"5"}>
					{userId && (
						<Box my={"5"}>
							<Form method="post">
								<Flex direction="column" gap="2">
									<TextArea
										name="message"
										size={"3"}
										placeholder="What's on your mind?"
										value={textAreaValue}
										onChange={(event) => {
											setTextAreaValue(
												event.target.value
											);
										}}
									/>
									<Box>
										<Button
											type="submit"
											variant="solid"
											size={{ initial: "3", md: "2" }}
											disabled={!textAreaValue}>
											<RiEditLine size={20} /> Post
										</Button>
									</Box>
								</Flex>
							</Form>
						</Box>
					)}
					<Box>
						{feed.map((post, idx) => {
							return (
								<Box key={idx}>
									<Box width={"full"}>
										<Flex justify={"between"}>
											<Box>
												<Flex
													gap="3"
													align="center"
													mb="2">
													<Avatar
														src={
															post.profilePicture ||
															undefined
														}
														radius="full"
														fallback={
															post.firstName![0]
														}
													/>
													<Flex
														direction="column"
														gap={{
															initial: "0",
															md: "1",
														}}>
														<Text
															size={{
																initial: "4",
																md: "2",
															}}
															weight="medium">
															{`${post.firstName}`}
														</Text>
														<Text
															size={{
																initial: "1",
																md: "2",
															}}>
															{getTimeAgo(
																post.createdAt!
															)}
														</Text>
													</Flex>
												</Flex>
											</Box>
										</Flex>
										<Text
											as="p"
											size={{ initial: "3", md: "2" }}
											mb="2"
											dangerouslySetInnerHTML={{
												__html: post.message!,
											}}
										/>
									</Box>

									{idx !== post.message!.length - 1 && (
										<Separator
											my="5"
											size="4"
											color="gray"
										/>
									)}
								</Box>
							);
						})}
					</Box>
				</Box>
			</Await>
		</Suspense>
	);
}

export async function action({ request }: ActionFunctionArgs) {
	const session = await ensureUserAuthenticated(request);
	if (!session) {
		throw redirect("/feed");
	}

	const userId = user(session);

	const formData = await request.formData();
	const message = String(formData.get("message"));

	try {
		await createFeedPost(userId, message);
		return redirect("/feed");
	} catch (error) {
		throw new Error("Failed to create post");
	}
}
