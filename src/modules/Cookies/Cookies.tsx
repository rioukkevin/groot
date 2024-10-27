"use client";

import { motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/cn";
import { useScopedI18n } from "@/lib/locales/client";


import { useRootWindow } from "../WindowManager";

export const Cookies = () => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useScopedI18n("cookies");
  const { openWindow, registerWindows, unregisterWindows } = useRootWindow();

  useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem("cookiesAccepted");
    if (!hasAcceptedCookies) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    const ids = registerWindows([
      {
        id: "cookies-details",
        title: t("cookiePolicy"),
        component: () => <div>{t("cookiePolicyContent")}</div>,
        defaultSize: { width: 400, height: 300 },
      },
    ]);
    return () => unregisterWindows(ids);
  }, [t, registerWindows, unregisterWindows]);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  const handleMoreInfo = () => {
    openWindow("cookies-details");
  };

  if (!isVisible) return null;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-4 rounded-lg bg-neutral-800/50 p-4 shadow-lg backdrop-blur-lg",
        "border border-neutral-600/20",
      )}
      exit={{ opacity: 0, y: 50 }}
      initial={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", bounce: 0 }}
    >
      <div className="flex items-center gap-4">
        <Cookie className="aspect-square text-neutral-300" size={80} />
        <p className="text-sm text-neutral-300">{t("cookieMessage")}</p>
      </div>
      <div className="flex items-center justify-end gap-4 space-x-2">
        <button
          className="text-sm text-neutral-400 hover:text-neutral-200"
          onClick={handleMoreInfo}
        >
          {t("moreInfo")}
        </button>
        <button
          className="rounded-lg bg-neutral-700 px-4 py-2 text-lg font-bold text-neutral-300 transition-colors hover:bg-neutral-600"
          onClick={handleAccept}
        >
          {t("accept")}
        </button>
      </div>
    </motion.div>
  );
};
