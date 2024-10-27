"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";

import { useScopedI18n } from "@/lib/locales/client";
import { profanity } from "@/lib/profanity";
import { WindowComponentProps } from "@/modules/WindowManager";

import { useAddChatMessage, useChatMessages } from "../../appwrite";

import { ChatBubble } from "./ChatBubble";
import { useChatUser, useSetupChatUser } from "./ChatUserProvider";

export const ChatWindow: FC<WindowComponentProps> = () => {
  const t = useScopedI18n("chat");
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  const { messages, error: messagesError } = useChatMessages();
  const {
    addMessage: sendMessage,
    error: sendMessageError,
    isLoading: isSendingMessageLoading,
  } = useAddChatMessage();
  const { username, userId } = useChatUser();
  const setUsername = useSetupChatUser();

  const isUserDefined = username && userId;

  const handleSendMessage = () => {
    if (!isUserDefined) return;

    const cleanedInput = profanity.censor(inputValue);

    sendMessage({ content: cleanedInput, username, userId });
    setInputValue("");
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleKeyUpUsername = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveUsername();
    }
  };

  const handleSaveUsername = () => {
    const cleanedUsername = profanity.censor(usernameInput);

    if (!cleanedUsername) return;
    if (cleanedUsername.length < 1) return;
    setUsername(cleanedUsername);
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex size-full flex-col items-center justify-center gap-4"
      exit={{ opacity: 0, y: 20 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {isUserDefined ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative -my-4 flex h-[calc(100%+32px)] w-full flex-col"
            exit={{ opacity: 0, y: 20 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={messageContainerRef}
              className="flex flex-col gap-1 overflow-y-auto pb-[80px] pt-4"
            >
              <div className="rounded-lg border border-neutral-400 p-3 text-sm text-neutral-200">
                {t("liveDescription")}
              </div>
              {messagesError && (
                <div className="rounded-lg border border-red-400 p-3 text-sm text-red-400">
                  {messagesError}
                </div>
              )}
              {sendMessageError && (
                <div className="rounded-lg border border-red-400 p-3 text-sm text-red-400">
                  {sendMessageError}
                </div>
              )}
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChatBubble
                      {...message}
                      hideUsername={
                        index > 0 &&
                        messages[index - 1]?.userId === message.userId
                      }
                      isInGroup={messages[index + 1]?.userId === message.userId}
                      isSelf={message.userId === userId}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-x-0 bottom-4 flex w-full gap-2"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="relative flex grow items-center gap-2">
                <input
                  className="h-11 w-full rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200"
                  id="chatInput"
                  placeholder={t("inputPlaceholder")}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyUp={handleKeyUp}
                />
                <motion.button
                  className="flex h-10 w-24 items-center justify-center rounded-lg bg-neutral-600 px-4 py-1 text-sm text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                >
                  {isSendingMessageLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    t("send")
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <>
            <motion.input
              animate={{ opacity: 1, y: 0 }}
              className="h-10 w-full rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 pr-28 text-sm text-neutral-200"
              exit={{ opacity: 0, y: -20 }}
              id="chatInput"
              initial={{ opacity: 0, y: 20 }}
              placeholder={t("chooseUsername")}
              transition={{ duration: 0.3 }}
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              onKeyUp={handleKeyUpUsername}
            />
            <motion.button
              animate={{ opacity: 1, y: 0 }}
              className="h-10 w-full rounded-lg bg-neutral-600 px-4 py-1 text-sm text-white"
              exit={{ opacity: 0, y: 20 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveUsername}
            >
              {t("saveUsername")}
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
