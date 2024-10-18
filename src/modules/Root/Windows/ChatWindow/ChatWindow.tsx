"use client";

import { useAddChatMessage, useChatMessages } from "@/lib/appwrite";
import { WindowChildrenProps } from "@/modules/Window";
import { FC, useEffect, useRef, useState } from "react";
import { useChatUser, useSetupChatUser } from "./ChatUserProvider";
import { ChatBubble } from "./ChatBubble";
import { useScopedI18n } from "@/lib/locales/client";
import { motion, AnimatePresence } from "framer-motion";

export const ChatWindow: FC<WindowChildrenProps> = () => {
  const t = useScopedI18n("chat");
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  const messages = useChatMessages();
  const sendMessage = useAddChatMessage();
  const { username, userId } = useChatUser();
  const setUsername = useSetupChatUser();

  const isUserDefined = username && userId;

  const handleSendMessage = () => {
    if (!isUserDefined) return;

    sendMessage({ content: inputValue, username, userId });
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
    if (!usernameInput) return;
    if (usernameInput.length < 1) return;
    setUsername(usernameInput);
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="flex size-full flex-col items-center justify-center gap-4"
    >
      <AnimatePresence>
        {isUserDefined ? (
          <motion.div
            className="relative -my-4 flex h-[calc(100%+32px)] w-full flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex flex-col gap-1 overflow-y-auto pb-[80px] pt-4"
              ref={messageContainerRef}
            >
              <div className="rounded-lg border border-neutral-400 p-3 text-sm text-neutral-200">
                {t("liveDescription")}
              </div>
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChatBubble
                      {...message}
                      isSelf={message.userId === userId}
                      hideUsername={
                        index > 0 &&
                        messages[index - 1]?.userId === message.userId
                      }
                      isInGroup={messages[index + 1]?.userId === message.userId}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="absolute inset-x-0 bottom-4 flex w-full gap-2"
            >
              <div className="relative flex grow items-center gap-2">
                <input
                  type="text"
                  id="chatInput"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyUp={handleKeyUp}
                  placeholder={t("inputPlaceholder")}
                  className="h-11 w-full rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="h-10 w-24 rounded-lg bg-neutral-600 px-4 py-1 text-sm text-white"
                >
                  {t("send")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <>
            <motion.input
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              type="text"
              id="chatInput"
              value={usernameInput}
              onKeyUp={handleKeyUpUsername}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder={t("chooseUsername")}
              className="h-10 w-full rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 pr-28 text-sm text-neutral-200"
            />
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveUsername}
              className="h-10 w-full rounded-lg bg-neutral-600 px-4 py-1 text-sm text-white"
            >
              {t("saveUsername")}
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
