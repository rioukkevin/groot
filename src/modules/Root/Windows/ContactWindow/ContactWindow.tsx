import { FC } from "react";
import { ContactData, useContactData } from "./data";
import Link from "next/link";
import { WindowChildrenProps } from "@/modules/Window";
import { motion } from "framer-motion";

const ContactItem: FC<ContactData> = ({ label, value, href, icon }) => {
  return (
    <div className="flex items-center gap-2">
      {icon && (
        <span className="fill-neutral-500 text-neutral-500">{icon}</span>
      )}
      <span className="min-w-[120px] text-sm text-neutral-500">{label}</span>
      <Link href={href ?? value} target="_blank" className="text-base">
        {value}
      </Link>
    </div>
  );
};

export const ContactWindow: FC<WindowChildrenProps> = () => {
  const data = useContactData();

  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          <ContactItem {...item} />
        </motion.div>
      ))}
    </div>
  );
};
