"use client";

import { motion } from "framer-motion";
import { FC } from "react";

import { cn } from "@/lib/cn";

interface ChatBubbleProps {
  content: string;
  username: string;
  isSelf: boolean;
  time: Date;
  hideUsername?: boolean;
  isInGroup?: boolean;
}

export const ChatBubble: FC<ChatBubbleProps> = ({
  content,
  username,
  isSelf,
  hideUsername = false,
  isInGroup = false,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-0",
        isSelf ? "items-end" : "items-start",
      )}
    >
      {!hideUsername && (
        <p className="pb-1 text-sm text-neutral-300">{username}</p>
      )}
      <motion.p
        animate={{ opacity: 1 }}
        className={cn(
          "max-w-[70%] px-2 py-1 duration-300",
          isSelf
            ? "rounded-l-lg bg-violet-400 text-white"
            : "rounded-r-lg bg-neutral-500 text-white",
          !isInGroup && (isSelf ? "rounded-br-lg" : "rounded-bl-lg"),
        )}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.p>
    </div>
  );
};
