import { Box, Flex, Text, Heading, Avatar, Link } from "@radix-ui/themes";
import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { NavLink, Outlet } from "@remix-run/react";
import {
	RiContactsBookFill,
	RiContactsBookLine,
	RiGithubFill,
	RiGithubLine,
	RiLink,
	RiLinkedinFill,
	RiLinkedinLine,
	RiStackFill,
	RiStackLine,
	RiTwitterFill,
	RiTwitterLine,
	RiUserFill,
	RiUserLine,
} from "@remixicon/react";
import React from "react";
import { getGoogleAuthURL } from "~/utils/auth";
import { ensureUserAuthenticated } from "~/utils/session.server";

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
	const isAuth = await ensureUserAuthenticated(request);
	const googleAuthURL: string = await getGoogleAuthURL();
	if (!isAuth) {
		return { hasAuth: false, googleAuthURL }; // Not authenticated
	}

	return { hasAuth: true, googleAuthURL: "" }; // Authenticated
}

const pages = [
	{
		title: "Feed",
		path: "/feed",
		icon: <RiUserLine size={20} />,
		hoverIcon: <RiUserFill size={20} />,
	},
	{
		title: "Guest Book",
		path: "/book",
		icon: <RiContactsBookLine size={20} />,
		hoverIcon: <RiContactsBookFill size={20} />,
	},
	{
		title: "Projects",
		path: "/projects",
		icon: <RiStackLine size={20} />,
		hoverIcon: <RiStackFill size={20} />,
	},
];

const socials = [
	{
		title: "wflore19",
		path: "https://github.com/wflore19",
		icon: <RiGithubLine size={16} />,
		hoverIcon: <RiGithubFill size={16} />,
	},
	{
		title: "wflore19",
		path: "https://www.linkedin.com/in/wflore19/",
		icon: <RiLinkedinLine size={16} />,
		hoverIcon: <RiLinkedinFill size={16} />,
	},
	{
		title: "wflore19",
		path: "https://twitter.com/wflore19",
		icon: <RiTwitterLine size={16} />,
		hoverIcon: <RiTwitterFill size={16} />,
	},
];

type Social = {
	title: string;
	path: string;
	icon: React.ReactNode;
	hoverIcon: React.ReactNode;
};

type Page = {
	title: string;
	path: string;
	icon: React.ReactNode;
	hoverIcon: React.ReactNode;
};

export type HomeData = {
	hasAuth: boolean;
	googleAuthURL: string;
};

export default function Layout() {
	return (
		<Box width={"full"} maxWidth={"800px"} my={"7"} mx={"auto"}>
			<Flex direction="column" gap="3">
				<Heading weight="bold">wflore19&apos;s Portfolio</Heading>

				<Flex align={"center"} gap={"3"}>
					<Avatar
						src="https://campus-connect.nyc3.cdn.digitaloceanspaces.com/Wilfredo-Flores-18.jpg"
						fallback="https://campus-connect.nyc3.digitaloceanspaces.com/Wilfredo-Flores-18.jpg"
						alt="Wilfredo Flores profile picture"
						radius={"full"}
						size={"7"}
					/>
					<Flex direction={"column"}>
						<Text weight={"bold"}>Wilfredo Flores</Text>

						<Text mt={"3"}>
							Building{" "}
							<Link href={"https://campusconnect.space"}>
								<Flex
									align={"center"}
									gap={"1"}
									style={{
										display: "inline",
									}}>
									<RiLink size={12} /> https://campusconnect.space
								</Flex>
							</Link>
						</Text>
						<Flex gap={"3"}>
							{socials.map((social, idx) => {
								return <SocialLink key={idx} social={social} />;
							})}
						</Flex>
					</Flex>
				</Flex>

				<Box minWidth={"100%"} mx={"auto"}>
					<Flex justify={"center"}>
						{pages.map((page, idx) => {
							return <NavItem key={idx} page={page} />;
						})}
					</Flex>
				</Box>

				<Box>
					<Outlet />
				</Box>
			</Flex>
		</Box>
	);
}

function NavItem({ page }: { page: Page }) {
	const [isHover, setIsHover] = React.useState(false);

	return (
		<NavLink
			to={page.path}
			style={{
				textDecoration: "none",
				color: "inherit",
				width: "33%",
			}}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}>
			{({ isActive }) => (
				<React.Fragment>
					<Flex
						align={"center"}
						justify={"center"}
						style={{
							minHeight: "3rem",
							backgroundColor: isActive
								? "var(--blue-3)"
								: isHover
								? "var(--blue-2)"
								: "transparent",
							transition: "background-color 0.2s ease-in-out",
						}}>
						{isActive ? page.hoverIcon : page.icon}
						<Text size={{ initial: "3", md: "5" }} ml={"2"}>
							{page.title}
						</Text>
					</Flex>
				</React.Fragment>
			)}
		</NavLink>
	);
}

function SocialLink({ social }: { social: Social }) {
	const [isHover, setIsHover] = React.useState(false);

	return (
		<Link
			href={social.path}
			rel="noreferrer "
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}>
			<Flex align={"center"} justify={"center"} gap={"1"}>
				{isHover ? social.hoverIcon : social.icon}
				<Text>{social.title}</Text>
			</Flex>
		</Link>
	);
}
