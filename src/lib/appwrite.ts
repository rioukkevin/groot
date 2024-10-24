import { Client } from "appwrite";
import { Databases } from "appwrite";

export const DEFAULT_CHAT_DATABASE_ID = "671250cb000fd45f7a7b";
export const DEFAULT_CHAT_COLLECTION_ID = "671250d60030823cccc8";

export const DEFAULT_NEWS_DATABASE_ID = "671250cb000fd45f7a7b";
export const DEFAULT_NEWS_COLLECTION_ID = "6716260a000f599ab708";

export const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "");

export const databases = new Databases(client);
