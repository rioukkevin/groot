"use client";

import { AnimatePresence, motion, MotionValue } from "framer-motion";
import { FC, useEffect, useState } from "react";

import { cn } from "@/lib/cn";

interface WindowButtonTooltipProps {
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
}

export const WindowButtonTooltip: FC<WindowButtonTooltipProps> = ({
  children,
  isHovered,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered!.on("change", (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{ opacity: 1, y: -8 }}
          className={cn(
            "absolute top-7 z-50 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700",
          )}
          exit={{ opacity: 0, y: -10 }}
          initial={{ opacity: 0, y: -10 }}
          role="tooltip"
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
