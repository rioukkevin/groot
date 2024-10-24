"use client";

import { LoadingOverlay } from "@/modules/Loading";
import { Metadata } from "next";
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
      <LoadingOverlay />
      <UnsubscribePage {...params} />
    </>
  );
}
