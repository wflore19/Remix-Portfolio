import {
	Avatar,
	Box,
	Flex,
	Spinner,
	Text,
	Separator,
	Badge,
} from "@radix-ui/themes";
import { ActionFunctionArgs } from "@remix-run/node";
import { Await, redirect, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { FeedPost, createFeedPost, getFeedPosts } from "~/drizzle/queries/feed";
import { getTimeAgo, isNew } from "~/utils/format";
import {
	ensureUserAuthenticated,
	getSession,
	getUserId,
} from "~/utils/session.server";

export async function loader() {
	const feed = await getFeedPosts();

	return feed;
}

export default function FeedPage() {
	const feed = useLoaderData() as FeedPost[];

	return (
		<Suspense fallback={<Spinner />}>
			<Await resolve={[feed]}>
				{/* {userId && (
						<Box my={"5"}>
							<Form method="post">
								<Flex direction="column" gap="2">
									<TextArea
										name="message"
										size={"3"}
										placeholder="What's on your mind?"
										value={textAreaValue}
										onChange={(event) => {
											setTextAreaValue(event.target.value);
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
					)} */}
				<Box>
					{feed.map((post, idx) => {
						return (
							<Box key={idx}>
								<Box width={"full"}>
									<Flex justify={"between"}>
										<Box>
											<Flex gap="3" align="center" mb="2">
												<Avatar
													src={post.profilePicture || undefined}
													radius="full"
													fallback={post.firstName![0]}
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
													<Text size={"1"}>
														{getTimeAgo(post.createdAt!)}
														{isNew(post.createdAt!) && (
															<Badge
																variant="outline"
																color="green">
																New
															</Badge>
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

export async function action({ request }: ActionFunctionArgs) {
	const hasAuth = await ensureUserAuthenticated(request);
	if (!hasAuth) {
		throw redirect("/feed");
	}

	try {
		const formData = await request.formData();
		const session = await getSession(request);
		const userId = getUserId(session);

		const message = String(formData.get("message"));
		if (!message) throw new Error("Message is required");

		await createFeedPost(userId, message.toString());
		return redirect("/feed");
	} catch (error) {
		throw new Error("Failed to create post");
	}
}
