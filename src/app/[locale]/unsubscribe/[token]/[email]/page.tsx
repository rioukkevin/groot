"use server-only";

import { LoadingOverlay } from "@/modules/Loading";
import { Metadata } from "next";
import { BreadcrumbJsonLd } from "next-seo";
import { UnsubscribePage } from "@/modules/Unsubscribe";

export const metadata: Metadata = {
  robots: "noindex",
};

export interface UnsubscribeParams {
  locale: string;
  token: string;
  email: string;
}

export default function Unsubscribe({ params }: { params: UnsubscribeParams }) {
  return (
    <>
      <BreadcrumbJsonLd
        useAppDir
        itemListElements={[
          {
            position: 1,
            name: "Unsubscribe",
            item: "https://kevin.riou.pro/unsubscribe",
          },
        ]}
      />
      <LoadingOverlay />
      <UnsubscribePage {...params} />
    </>
  );
}
