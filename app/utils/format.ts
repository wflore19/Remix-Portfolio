export const MINUTE_IN_SECONDS = 60;
export const HOURS_IN_SECONDS = 3600;
export const DAYS_IN_SECONDS = 86400;

export function getTimeAgo(createdAt: Date): string {
	const now = new Date();
	now.setSeconds(now.getSeconds() + 3); // Add 1 second buffer
	const postDate = new Date(createdAt);
	const diffInSeconds = Math.max(
		1,
		Math.floor((now.getTime() - postDate.getTime()) / 1000)
	);

	if (diffInSeconds < 60) {
		return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
	} else if (diffInSeconds < 3600) {
		const minutes = Math.floor(diffInSeconds / 60);
		return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
	} else if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600);
		return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
	} else {
		const days = Math.floor(diffInSeconds / 86400);
		return `${days} day${days !== 1 ? "s" : ""} ago`;
	}
}

export function isNew(createdAt: Date): boolean {
	const now = new Date();
	now.setSeconds(now.getSeconds() + 3); // Add 1 second buffer
	const postDate = new Date(createdAt);
	const diffInSeconds = Math.max(
		1,
		Math.floor((now.getTime() - postDate.getTime()) / 1000)
	);

	return diffInSeconds < 12 * MINUTE_IN_SECONDS;
}
