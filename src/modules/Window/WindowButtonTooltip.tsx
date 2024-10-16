"use client";

import { cn } from "@/lib/cn";
import { AnimatePresence, motion, MotionValue } from "framer-motion";
import { FC, useEffect, useState } from "react";

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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: -8 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute top-7 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700",
          )}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
