import { Box, Flex, Text, Heading, Avatar } from "@radix-ui/themes";
import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { NavLink, Outlet } from "@remix-run/react";
import { RiContactsBookLine, RiStackLine, RiUserLine } from "@remixicon/react";
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
	},
	{
		title: "Guest Book",
		path: "/book",
		icon: <RiContactsBookLine size={20} />,
	},
	{
		title: "Projects",
		path: "/projects",
		icon: <RiStackLine size={20} />,
	},
];
type Page = {
	title: string;
	path: string;
	icon: React.ReactNode;
};

export type HomeData = {
	hasAuth: boolean;
	googleAuthURL: string;
};

export default function Layout() {
	return (
		<Box width={"full"} maxWidth={"800px"} my={"7"} mx={"auto"}>
			<Flex direction="column" gap="3">
				<Heading weight="bold">wflore19 Portfolio</Heading>

				<Flex>
					<Avatar
						src="https://campus-connect.nyc3.cdn.digitaloceanspaces.com/Wilfredo-Flores-18.jpg"
						fallback="https://campus-connect.nyc3.digitaloceanspaces.com/Wilfredo-Flores-18.jpg"
						alt="Wilfredo Flores profile picture"
						radius={"full"}
						mt={"3"}
					/>
					<Flex direction={"column"} ml={"3"} mt={"7"}>
						<Flex direction={"column"} gap={"0"}>
							<Text>Wilfredo Flores</Text>
						</Flex>

						<Text>Full-stack web developer</Text>
					</Flex>
				</Flex>

				<Box minWidth={"100%"} mx={"auto"}>
					<Flex justify={"center"}>
						{pages.map((page, idx) => {
							return <NavItem key={idx} page={page} />;
						})}
					</Flex>
				</Box>

				<Outlet />
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
						{page.icon}
						<Text size={"5"} ml={"2"}>
							{page.title}
						</Text>
					</Flex>
				</React.Fragment>
			)}
		</NavLink>
	);
}
