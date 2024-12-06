import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./styles.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import React from "react";

export const links: LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export async function loader() {
	return { gaTrackingId: process.env.GA_TRACKING_ID };
}

export function Layout({ children }: { children: React.ReactNode }) {
	const { gaTrackingId } = useLoaderData<typeof loader>();

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Meta />
				<Links />
			</head>
			<body>
				{process.env.NODE_ENV === "development" || !gaTrackingId ? null : (
					<>
						<script
							async
							src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
						/>
						<script
							async
							id="gtag-init"
							dangerouslySetInnerHTML={{
								__html: `
									window.dataLayer = window.dataLayer || [];
									function gtag(){dataLayer.push(arguments);}
									gtag('js', new Date());

									gtag('config', '${gaTrackingId}', {
										page_path: window.location.pathname,
									});
								`,
							}}
						/>
					</>
				)}
				<Theme
					accentColor="blue"
					appearance="dark"
					radius="small"
					grayColor="mauve">
					{children}
				</Theme>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
