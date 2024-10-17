"use client";

import { useScopedI18n } from "@/lib/locales/client";
import useScreenSize from "@/lib/screen";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, FC } from "react";

const SCREEN_SIZE_WARNING_TIMEOUT = 10000;
const SCREEN_MIN_WIDTH = 1280;
const SCREEN_MIN_HEIGHT = 720;

export const ScreenSizeWarning: FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { width: screenWidth, height: screenHeight } = useScreenSize();

  const t = useScopedI18n("screenSizeWarning");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, SCREEN_SIZE_WARNING_TIMEOUT);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const isSmallScreen =
    screenWidth < SCREEN_MIN_WIDTH || screenHeight < SCREEN_MIN_HEIGHT;

  const shouldShow = isVisible && isSmallScreen;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", bounce: 0 }}
          className="fixed left-[20px] top-[20px] z-50 flex w-56 items-center justify-center rounded-lg bg-neutral-800/80 p-4 text-center text-white backdrop-blur-lg"
        >
          <p>{t("message")}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
