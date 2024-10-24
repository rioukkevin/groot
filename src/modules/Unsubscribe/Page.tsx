"use server";

import { getCurrentLocale, getScopedI18n } from "@/lib/locales/server";
import Link from "next/link";
import { FC } from "react";
import { cn } from "@/lib/cn";
import { CheckCircle, XCircle } from "lucide-react";

export interface UnsubscribePageProps {
  locale: string;
  token: string;
  email: string;
}

interface UnsubscribeResponse {
  isSuccess: boolean;
  message: "error" | "success";
}

const unsubscribe = async (
  locale: "en" | "fr",
  token: string,
  email: string,
): Promise<UnsubscribeResponse> => {
  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_URL}/${locale}/api/email/unsubscribed`,
    {
      method: "POST",
      cache: "no-cache",
      mode: "no-cors",
      body: JSON.stringify({ token, email }),
    },
  );

  if (!response.ok) {
    console.error(await response.json());
    return {
      isSuccess: false,
      message: "error",
    };
  }

  return {
    isSuccess: true,
    message: "success",
  };
};

export const Page: FC<UnsubscribePageProps> = async ({
  token,
  email: emailProp,
}) => {
  const email = decodeURIComponent(emailProp);

  const t = await getScopedI18n("unsubscribe");
  const locale = getCurrentLocale();

  const { message, isSuccess } = await unsubscribe(locale, token, email);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      {isSuccess ? (
        <CheckCircle className="mb-4 size-16 text-green-500" />
      ) : (
        <XCircle className="mb-4 size-16 text-red-500" />
      )}
      <h1
        className={cn(
          "text-2xl font-bold",
          isSuccess ? "text-neutral-200" : "text-red-500",
        )}
      >
        {t(message)}
      </h1>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-neutral-700 px-4 py-2 text-lg font-bold text-neutral-300 transition-colors hover:bg-neutral-600"
      >
        {t("returnHome")}
      </Link>
    </div>
  );
};
