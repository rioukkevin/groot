import { motion } from "framer-motion";
import Image from "next/image";
import React, { FC } from "react";

import IMGMe from "@/assets/me.png";
import { useScopedI18n } from "@/lib/locales/client";
import { TextEffect } from "@/modules/TextEffect/TextEffect";
import { WindowComponentProps } from "@/modules/WindowManager";

export const WhoWindow: FC<WindowComponentProps> = () => {
  const t = useScopedI18n("who");

  return (
    <div className="flex w-full flex-col gap-4">
      <motion.div
        animate={{ y: 0 }}
        className="flex flex-col items-center gap-4"
        initial={{ y: 50 }}
      >
        <motion.div
          animate={{ scale: 1, filter: "blur(0px)" }}
          initial={{ scale: 0.8, filter: "blur(10px)" }}
          transition={{ delay: 0.2 }}
        >
          <Image
            alt="Kevin"
            className="grayscale"
            height={350}
            quality={100}
            src={IMGMe}
            width={350}
          />
        </motion.div>
        <motion.h1
          animate={{ opacity: 1 }}
          className="text-pretty text-5xl font-light uppercase text-neutral-200"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          {t("title")}
        </motion.h1>
        <motion.hr
          animate={{ width: "100%" }}
          className="w-full border-neutral-200/50"
          initial={{ width: 0 }}
        />
        <motion.div
          animate={{ opacity: 1 }}
          className="flex w-full items-stretch justify-evenly gap-2"
          initial={{ opacity: 0 }}
        >
          <motion.div
            className="flex flex-col items-center"
            transition={{ delay: 0.5 }}
            whileInView={{ scale: 1.1 }}
          >
            <p className="text-5xl font-light text-neutral-200">7+</p>
            <p className="text-sm font-extrabold text-neutral-200">
              {t("years")}
            </p>
          </motion.div>
          <div className="w-px bg-neutral-200/50" />
          <motion.div
            className="flex flex-col items-center"
            transition={{ delay: 0.5 }}
            whileInView={{ scale: 1.1 }}
          >
            <p className="text-5xl font-light text-neutral-200">40+</p>
            <p className="text-sm font-extrabold text-neutral-200">
              {t("projects")}
            </p>
          </motion.div>
        </motion.div>
        <motion.hr
          animate={{ width: "100%" }}
          className="w-full border-neutral-200/50"
          initial={{ width: 0 }}
        />
        <motion.h2
          animate={{ opacity: 1 }}
          className="w-full text-lg font-bold uppercase text-neutral-200"
          initial={{ opacity: 0 }}
        >
          <TextEffect per="char" preset="fade">
            {t("about")}
          </TextEffect>
        </motion.h2>
        <motion.p
          animate={{ opacity: 1 }}
          className="w-full text-neutral-200"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          {t("description1")}
        </motion.p>
        <motion.p
          animate={{ opacity: 1 }}
          className="w-full text-neutral-200"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          {t("description2")}
        </motion.p>
      </motion.div>
    </div>
  );
};
