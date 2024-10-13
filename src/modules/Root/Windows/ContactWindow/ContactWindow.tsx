import { FC } from "react";
import { ContactData, data } from "./data";
import Link from "next/link";

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

export const ContactWindow = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Contact</h1>
      <div className="flex flex-col gap-2">
        {data.map((item) => (
          <ContactItem key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
};
