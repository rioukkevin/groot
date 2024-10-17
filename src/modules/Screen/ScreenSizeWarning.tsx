"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, FC } from "react";

export const ScreenSizeWarning: FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1280 || window.innerHeight < 720);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Hide the component after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      clearTimeout(timer);
    };
  }, []);

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
          <p>
            Cette expérience est conçue pour ordinateur principalement pour un
            écran HD minimum
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
