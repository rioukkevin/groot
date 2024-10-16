"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWindowManager } from "../WindowManager/WindowManagerContext";
import { cn } from "@/lib/cn";
import { useScopedI18n } from "@/lib/locales/client";
import { Cookie } from "lucide-react";

export const Cookies = () => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useScopedI18n("cookies");
  const { openWindow } = useWindowManager();

  useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem("cookiesAccepted");
    if (!hasAcceptedCookies) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  const handleMoreInfo = () => {
    openWindow({
      title: t("cookiePolicy"),
      children: () => <div>{t("cookiePolicyContent")}</div>,
      size: { width: 400, height: 300 },
    });
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", bounce: 0 }}
      className={cn(
        "fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-4 rounded-lg bg-neutral-800/50 p-4 shadow-lg backdrop-blur-lg",
        "border border-neutral-600/20",
      )}
    >
      <div className="flex items-center gap-4">
        <Cookie className="aspect-square text-neutral-300" size={80} />
        <p className="text-sm text-neutral-300">{t("cookieMessage")}</p>
      </div>
      <div className="flex items-center justify-end gap-4 space-x-2">
        <button
          onClick={handleMoreInfo}
          className="text-sm text-neutral-400 hover:text-neutral-200"
        >
          {t("moreInfo")}
        </button>
        <button
          onClick={handleAccept}
          className="rounded-lg bg-neutral-700 px-4 py-2 text-lg font-bold text-neutral-300 transition-colors hover:bg-neutral-600"
        >
          {t("accept")}
        </button>
      </div>
    </motion.div>
  );
};
