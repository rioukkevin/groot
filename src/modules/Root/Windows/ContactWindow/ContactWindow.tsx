import { motion } from "framer-motion";
import Link from "next/link";
import React, { FC } from "react";

import { WindowComponentProps } from "@/modules/WindowManager";

import { ContactData, useContactData } from "./data";

const ContactItem: FC<ContactData> = ({ label, value, href, icon }) => {
  return (
    <div className="flex items-center gap-2">
      {icon && (
        <span className="fill-neutral-500 text-neutral-500">{icon}</span>
      )}
      <span className="min-w-[120px] text-sm text-neutral-500">{label}</span>
      <Link
        className="text-base text-neutral-200"
        href={href ?? value}
        target="_blank"
      >
        {value}
      </Link>
    </div>
  );
};

export const ContactWindow: FC<WindowComponentProps> = () => {
  const data = useContactData();

  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => (
        <motion.div
          key={item.label}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          <ContactItem {...item} />
        </motion.div>
      ))}
    </div>
  );
};
