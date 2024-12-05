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
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
	Await,
	Form,
	redirect,
	useFetcher,
	useLoaderData,
} from "@remix-run/react";
import { RiEditLine } from "@remixicon/react";
import React, { Suspense } from "react";
import { GoogleButton } from "~/components/googleButton";
import {
	GuestBookEntry,
	createGuestBookEntry,
	getGuestBookEntries,
} from "~/drizzle/queries/book";
import { getGoogleAuthURL } from "~/utils/auth";
import { getTimeAgo } from "~/utils/format";
import { ensureUserAuthenticated, user } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await ensureUserAuthenticated(request);
	const guestBook = await getGuestBookEntries();

	let userId;
	if (session) {
		userId = user(session);
		return { guestBook, userId, googleAuthURL: undefined };
	}

	const googleAuthURL: string = getGoogleAuthURL();

	return { guestBook, userId: undefined, googleAuthURL };
}

export default function BookPage() {
	const { guestBook, userId, googleAuthURL } = useLoaderData<
		typeof loader
	>() as {
		guestBook: GuestBookEntry[];
		userId: number | undefined;
		googleAuthURL: string | undefined;
	};

	const fetcher = useFetcher();
	const [textAreaValue, setTextAreaValue] = React.useState("");

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		fetcher.submit(event.currentTarget, { method: "post" });
		setTextAreaValue("");
	};
	return (
		<Suspense fallback={<Spinner />}>
			<Await resolve={[guestBook]}>
				<Box my={"5"}>
					{!userId ? (
						<Flex direction={"column"} gap={"3"} align={"center"}>
							<Text>Sign the guest book</Text>
							<GoogleButton href={`${googleAuthURL}`} />
						</Flex>
					) : (
						<Box my={"5"}>
							<Form method="post" onSubmit={handleSubmit}>
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
						{guestBook.map((post, idx) => {
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

									{idx !== post.message!.length && (
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
		throw redirect("/book");
	}

	const userId = user(session);

	const formData = await request.formData();
	const message = String(formData.get("message"));

	try {
		await createGuestBookEntry(userId, message);
		return redirect("/book");
	} catch (error) {
		throw new Error("Failed to create post");
	}
}
