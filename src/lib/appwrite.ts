"use client";

import { Client, ID } from "appwrite";
import { Databases, RealtimeResponseEvent } from "appwrite";
import { useState, useEffect } from "react";

const DEFAULT_DATABASE_ID = "671250cb000fd45f7a7b";
const DEFAULT_COLLECTION_ID = "671250d60030823cccc8";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "");

const databases = new Databases(client);

interface Message {
  id: string;
  content: string;
  username: string;
  userId: string;
  time: Date;
}

const useChatMessages = (
  databaseId: string = DEFAULT_DATABASE_ID,
  collectionId: string = DEFAULT_COLLECTION_ID,
) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${databaseId}.collections.${collectionId}.documents`,
      (response: RealtimeResponseEvent<Message>) => {
        const { events, payload } = response;

        if (events.includes("databases.*.collections.*.documents.*.create")) {
          setMessages((prevMessages) => [...prevMessages, payload as Message]);
        } else if (
          events.includes("databases.*.collections.*.documents.*.update")
        ) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === payload.id ? (payload as Message) : msg,
            ),
          );
        } else if (
          events.includes("databases.*.collections.*.documents.*.delete")
        ) {
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== payload.id),
          );
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, [databaseId, collectionId]);

  return messages;
};

const useAddChatMessage = (
  databaseId: string = DEFAULT_DATABASE_ID,
  collectionId: string = DEFAULT_COLLECTION_ID,
) => {
  const addMessage = async (message: Omit<Message, "id" | "time">) => {
    try {
      const response = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          ...message,
          time: new Date(),
        },
      );
      return response;
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  };

  return addMessage;
};

export { useChatMessages, useAddChatMessage };
