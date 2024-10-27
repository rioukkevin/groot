"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Children, cloneElement, useRef } from "react";

import { cn } from "@/lib/cn";

import { useWindowCountById } from "../WindowManager";

import { useDock } from "./DockContext";

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  windowId: string;
  onClick: () => void;
};

export function DockItem({
  children,
  className,
  onClick,
  windowId,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const openedWindowCount = useWindowCountById(windowId);
  const { distance, magnification, mouseX, spring } = useDock();
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });

  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [40, magnification, 40],
  );

  const width = useSpring(widthTransform, spring);

  return (
    <motion.div
      ref={ref}
      aria-haspopup="true"
      className={cn(
        "relative mb-2 inline-flex items-center justify-center",
        className,
      )}
      role="button"
      style={{ width }}
      tabIndex={0}
      whileTap={{ scale: 0.8 }}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      onFocus={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onHoverStart={() => isHovered.set(1)}
    >
      {Children.map(children, (child) =>
        cloneElement(child as React.ReactElement, { width, isHovered }),
      )}
      {openedWindowCount > 0 && (
        <motion.div
          className="absolute -bottom-2 flex h-1 w-fit flex-nowrap justify-between gap-0.5 overflow-hidden"
          layout
        >
          <AnimatePresence>
            {Array.from({ length: openedWindowCount }).map((_, idx) => (
              <motion.div
                key={idx}
                animate={{ width: 4, opacity: 1 }}
                className="size-1 min-w-1 rounded-full bg-white shadow-md"
                exit={{ width: 0, opacity: 0 }}
                initial={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", bounce: 0 }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
