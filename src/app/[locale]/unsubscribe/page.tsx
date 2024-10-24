import { LoadingOverlay } from "@/modules/Loading";
import { Metadata } from "next";
import { UnsubscribePage } from "@/modules/Unsubscribe";

export const metadata: Metadata = {
  robots: "noindex",
};

export interface UnsubscribeParams {
  locale: string;
}

export interface UnsubscribeSearchParams {
  token: string;
  email: string;
}

export default function Unsubscribe({
  params,
  searchParams,
}: {
  params: UnsubscribeParams;
  searchParams: UnsubscribeSearchParams;
}) {
  console.log(params, searchParams);

  return (
    <>
      <LoadingOverlay />
      <UnsubscribePage {...params} {...searchParams} />
    </>
  );
}
