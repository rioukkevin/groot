"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

import { cn } from "@/lib/cn";

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  width?: MotionValue<number>;
};

export function DockIcon({ children, className, width }: DockIconProps) {
  const widthTransform = useTransform(width!, (val) => val / 2);

  return (
    <motion.div
      className={cn("flex items-center justify-center", className)}
      style={{ width: widthTransform }}
    >
      {children}
    </motion.div>
  );
}
