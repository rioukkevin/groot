"use server";

import { Query } from "appwrite";

import {
  databases,
  DEFAULT_NEWS_COLLECTION_ID,
  DEFAULT_NEWS_DATABASE_ID,
} from "@/lib/appwrite";

export interface UnsubscribeResponse {
  isSuccess: boolean;
  message: "success" | "error" | "subscriptionNotFound" | "invalidEmail";
}

export const getTokenByEmail = async (
  email: string,
): Promise<string | null> => {
  try {
    const response = await databases.listDocuments(
      DEFAULT_NEWS_DATABASE_ID,
      DEFAULT_NEWS_COLLECTION_ID,
      [Query.equal("email", email)],
    );

    if (response.documents.length > 0) {
      return response.documents[0].$id;
    }
    return null;
  } catch (error) {
    console.error("Error fetching document by email:", error);
    return null;
  }
};
