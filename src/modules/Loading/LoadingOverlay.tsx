import React, { useState, useEffect } from "react";
import { useBackground } from "../Theme/Background";
import {
  motion,
  AnimatePresence,
  SpringOptions,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/cn";

type AnimatedNumber = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
};

export const AnimatedNumber = ({
  value,
  className,
  springOptions,
}: AnimatedNumber) => {
  const spring = useSpring(value, springOptions);
  const display = useTransform(spring, (current: number) =>
    Math.round(current).toLocaleString(),
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  );
};

export const LoadingOverlay = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentBackground } = useBackground();
  const [percentage, setPercentage] = useState(0);
  useEffect(() => {
    if (currentBackground) {
      const img = new Image();
      img.src = currentBackground;
      img.onload = () => {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      };
    }
  }, [currentBackground]);

  useEffect(() => {
    setPercentage(100);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-700"
          initial={{
            opacity: 1,
            rotateX: 0,
            filter: "brightness(100%)",
            backgroundColor: "#000000",
          }}
          exit={{
            opacity: 0,
            rotateX: 90,
            filter: "brightness(200%)",
            transition: { duration: 0.5, ease: "anticipate" },
            backgroundColor: "#FFFFFF",
          }}
        >
          <div className="relative size-full">
            <div className="absolute bottom-10 right-10 text-9xl font-bold text-white">
              <AnimatedNumber
                value={percentage}
                springOptions={{ bounce: 0 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
