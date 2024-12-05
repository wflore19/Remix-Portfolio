import {
	Avatar,
	Box,
	Button,
	Flex,
	Separator,
	Spinner,
	Text,
	TextArea,
} from "@radix-ui/themes";
import { ActionFunctionArgs } from "@remix-run/node";
import {
	Await,
	Form,
	redirect,
	useLoaderData,
	useRouteLoaderData,
} from "@remix-run/react";
import { RiEditLine } from "@remixicon/react";
import React, { Suspense } from "react";
import { GoogleButton } from "~/components/googleButton";
import {
	createGuestBookEntry,
	getGuestBookEntries,
	GuestBookEntry,
} from "~/drizzle/queries/book";
import { getTimeAgo } from "~/utils/format";
import {
	ensureUserAuthenticated,
	getSession,
	user,
} from "~/utils/session.server";
import { HomeData } from "./_home";

export async function loader() {
	const guestBook = await getGuestBookEntries();

	return guestBook;
}

export default function BookPage() {
	const { hasAuth, googleAuthURL } = useRouteLoaderData(
		"routes/_home"
	) as HomeData;
	const guestBook = useLoaderData() as GuestBookEntry[];

	const [textAreaValue, setTextAreaValue] = React.useState("");

	React.useEffect(() => {
		setTextAreaValue("");
	}, []);

	return (
		<Suspense fallback={<Spinner />}>
			<Await resolve={[guestBook]}>
				{!hasAuth ? (
					<Flex direction={"column"} gap={"3"} align={"center"}>
						<Text>Sign the guest book</Text>
						<GoogleButton href={`${googleAuthURL}`} />
					</Flex>
				) : (
					<Box mb={"7"}>
						<Form method="post" reloadDocument>
							<Flex direction="column" gap="2">
								<TextArea
									name="message"
									size={"3"}
									placeholder="Leave a message :)"
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
				)}
				<Box>
					{guestBook.map((post, idx) => {
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
													<Text
														size={{
															initial: "1",
															md: "2",
														}}>
														{getTimeAgo(post.createdAt!)}
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

								{idx !== post.message!.length && (
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
		throw redirect("/book");
	}

	try {
		const formData = await request.formData();
		const session = await getSession(request);
		const userId = user(session);

		const message = formData.get("message");

		if (!message) throw new Error("Message is required");

		await createGuestBookEntry(userId, message.toString());
		return redirect("/book");
	} catch (error) {
		throw new Error("Failed to create post");
	}
}
