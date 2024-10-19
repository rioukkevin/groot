import Image from "next/image";
import { FC } from "react";
import { WindowChildrenProps } from "@/modules/Window";
import { useScopedI18n } from "@/lib/locales/client";
import { motion } from "framer-motion";

import IMGMe from "@/assets/me.png";
import { TextEffect } from "@/modules/TextEffect/TextEffect";

export const WhoWindow: FC<WindowChildrenProps> = () => {
  const t = useScopedI18n("who");

  return (
    <div className="flex w-full flex-col gap-4">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8, filter: "blur(10px)" }}
          animate={{ scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.2 }}
        >
          <Image
            src={IMGMe}
            alt="Kevin"
            width={350}
            height={350}
            quality={100}
            className="grayscale"
          />
        </motion.div>
        <motion.h1
          className="text-pretty text-5xl font-light uppercase text-neutral-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t("title")}
        </motion.h1>
        <motion.hr
          className="w-full border-neutral-200/50"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
        />
        <motion.div
          className="flex w-full items-stretch justify-evenly gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="flex flex-col items-center"
            whileInView={{ scale: 1.1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-5xl font-light text-neutral-200">7+</p>
            <p className="text-sm font-extrabold text-neutral-200">
              {t("years")}
            </p>
          </motion.div>
          <div className="w-px bg-neutral-200/50" />
          <motion.div
            className="flex flex-col items-center"
            whileInView={{ scale: 1.1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-5xl font-light text-neutral-200">40+</p>
            <p className="text-sm font-extrabold text-neutral-200">
              {t("projects")}
            </p>
          </motion.div>
        </motion.div>
        <motion.hr
          className="w-full border-neutral-200/50"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
        />
        <motion.h2
          className="w-full text-lg font-bold uppercase text-neutral-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <TextEffect per="char" preset="fade">
            {t("about")}
          </TextEffect>
        </motion.h2>
        <motion.p
          className="w-full text-neutral-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t("description1")}
        </motion.p>
        <motion.p
          className="w-full text-neutral-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {t("description2")}
        </motion.p>
      </motion.div>
    </div>
  );
};
