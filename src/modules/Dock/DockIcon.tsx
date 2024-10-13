"use client";

import { cn } from "@/lib/cn";
import { motion, MotionValue, useTransform } from "framer-motion";

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  width?: MotionValue<number>;
};

export function DockIcon({ children, className, width }: DockIconProps) {
  const widthTransform = useTransform(width!, (val) => val / 2);

  return (
    <motion.div
      style={{ width: widthTransform }}
      className={cn("flex items-center justify-center", className)}
    >
      {children}
    </motion.div>
  );
}
