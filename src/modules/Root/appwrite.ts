import { ID, Query, type RealtimeResponseEvent } from "appwrite";
import { useEffect, useState } from "react";

import {
  client,
  databases,
  DEFAULT_CHAT_COLLECTION_ID,
  DEFAULT_CHAT_DATABASE_ID,
} from "@/lib/appwrite";
import { getIp } from "@/lib/ip";
import { useCurrentLocale, useScopedI18n } from "@/lib/locales/client";
import { useUmami } from "@/lib/umami";

interface Message {
  id: string;
  content: string;
  username: string;
  userId: string;
  time: Date;
  ip: string;
}

const useChatMessages = (
  databaseId: string = DEFAULT_CHAT_DATABASE_ID,
  collectionId: string = DEFAULT_CHAT_COLLECTION_ID,
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const t = useScopedI18n("chat");

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
    setError(null);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [databaseId, collectionId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await databases.listDocuments(
          databaseId,
          collectionId,
          [Query.orderDesc("time"), Query.limit(20)],
        );
        setMessages(response.documents.reverse() as unknown as Message[]);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(t("error.fetchMessages"));
      }
    };

    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { messages, error };
};

const useAddChatMessage = (
  databaseId: string = DEFAULT_CHAT_DATABASE_ID,
  collectionId: string = DEFAULT_CHAT_COLLECTION_ID,
) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const t = useScopedI18n("chat");

  const addMessage = async (message: Omit<Message, "id" | "time" | "ip">) => {
    try {
      setIsLoading(true);

      const ip = await getIp();

      const response = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          ...message,
          time: new Date(),
          ip,
        },
      );
      setError(null);
      return response;
    } catch (error) {
      console.error("Error adding message:", error);
      setError(t("error.sendMessage"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { addMessage, error, isLoading };
};

const useSubscribeToNews = () => {
  const { track } = useUmami();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const t = useScopedI18n("news");
  const locale = useCurrentLocale();

  const subscribeEmail = async (email: string) => {
    try {
      setIsLoading(true);

      const protocol = process.env.NEXT_PUBLIC_URL?.includes("localhost")
        ? "http"
        : "https";

      const response = await fetch(
        `${protocol}://${process.env.NEXT_PUBLIC_URL}/${locale}/api/email/subscribed`,
        {
          method: "POST",
          cache: "no-cache",
          mode: "no-cors",
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        const result = await response.json();

        throw new Error(result.message);
      }

      track?.("subscribe", { email });

      setError(null);
      return response;
    } catch (error) {
      console.error("Error subscribing to news:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(t("error.subscribe"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { subscribeEmail, error, isLoading };
};

export { useChatMessages, useAddChatMessage, useSubscribeToNews };
