"use client";

import {
  motion,
  type SpringOptions,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useMemo } from "react";

import { cn } from "@/lib/cn";

import { DockProvider } from "./DockContext";

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 80;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 72;

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

export function DockContainer({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      className="mx-2 flex max-w-full items-end overflow-x-auto"
      style={{
        height: height,
        scrollbarWidth: "none",
      }}
    >
      <motion.div
        aria-label="Application dock"
        className={cn(
          "mx-auto flex w-fit gap-4 rounded-2xl bg-neutral-800/80 px-4 shadow-lg backdrop-blur-md",
          className,
        )}
        role="toolbar"
        style={{ height: panelHeight }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        onMouseMove={({ pageX }: { pageX: number }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
      >
        <DockProvider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockProvider>
      </motion.div>
    </motion.div>
  );
}
