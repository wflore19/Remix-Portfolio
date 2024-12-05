import { Session, createCookieSessionStorage } from "@remix-run/node";
import { getUserById } from "../drizzle/queries/users";
import { SESSION_SECRET } from "./env";

// JSDocs for getSession, commitSession, and destroySession
/**
 * Get the session object from the request
 * @param request - The request object
 * @returns The session object
 */
/**
 * Commit the session object to the cookie
 * @param session - The session object
 * @returns The cookie string
 * @example
 * const cookieString = await commitSession(session);
 * response = new Response('Hello, world!', {
 *    headers: {
 *       'Set-Cookie': cookieString,
 *   },
 * });
 * return response;
 */
const {
	getSession: _getSession,
	commitSession,
	destroySession,
} = createCookieSessionStorage({
	cookie: {
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 365,
		name: "__session_wflore19_portfolio",
		secrets: [SESSION_SECRET!],
		secure: process.env.NODE_ENV === "production",
	},
});

export { commitSession, destroySession };

export async function getSession(request: Request) {
	const cookieString = request.headers.get("Cookie");
	return _getSession(cookieString);
}

/**
 * Ensure the user is authenticated
 * @param request - The request object
 * @param options - The options object
 * @returns The session object if the user is authenticated, otherwise redirects to the login page
 */
export async function ensureUserAuthenticated(
	request: Request
): Promise<Session | undefined> {
	const session = await getSession(request);
	if (!session.has("user_id")) {
		return undefined;
	}

	const userId = await user(session);
	const isExistingUser = await getUserById(userId);

	if (!isExistingUser) {
		return undefined;
	}

	return session;
}

/**
 * Get the user ID from the session
 * @param session - The session object
 * @returns The user ID
 */
export function user(session: Session): number {
	const sessionId = parseInt(session.get("user_id"));
	return sessionId;
}
