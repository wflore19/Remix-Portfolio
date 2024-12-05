import { createProject } from "../queries/project";

async function main() {
	await createProject(
		"Campus Connect",
		"A platform for students to connect with each other and share resources",
		"https://github.com/wflore19/CampusConnect",
		"https://campus-connect.nyc3.cdn.digitaloceanspaces.com/campusconnect.jpg",
		"https://campusconnect.space",
		"Remix,React,Drizzle,Radix UI,PostgreSQL,DigitalOcean"
	);
	await createProject(
		"ColorStack UMD Website",
		"A website for the ColorStack UMD club",
		"https://github.com/wflore19/colorstackumd-website",
		"https://campus-connect.nyc3.cdn.digitaloceanspaces.com/colorstackumd.jpg",
		"https://wflore19.github.io/colorstackumd-website/",
		"Astro,Bootstrap,Github"
	);
}
main();
