import { config } from "dotenv";

config();

if (!process.env.GOOGLE_ANALYTICS)
	console.warn("Google Analytics ID is not provided");

if (!process.env.GOOGLE_CLIENT_ID)
	console.warn("Google Client ID is not provided");

if (!process.env.GOOGLE_CLIENT_SECRET)
	console.warn("Google Client Secret is not provided");

if (!process.env.APP_URL) console.warn("App URL is not provided");

if (!process.env.SESSION_SECRET) console.warn("Session Secret is not provided");

if (!process.env.STORAGE_ACCESS_KEY)
	console.warn("Storage Access Key is not provided");

if (!process.env.STORAGE_SECRET) console.warn("Storage Secret is not provided");

if (!process.env.STORAGE_ENDPOINT)
	console.warn("Storage Endpoint is not provided");

export const GOOGLE_ANALYTICS = process.env.GOOGLE_ANALYTICS || "";
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const APP_URL = process.env.APP_URL || "";
export const SESSION_SECRET = process.env.SESSION_SECRET || "";
export const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY || "";
export const STORAGE_SECRET = process.env.STORAGE_SECRET || "";
export const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT || "";
export const DATABASE_URL = process.env.DATABASE_URL || "";
