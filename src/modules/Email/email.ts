"use server";

import { getTokenByEmail } from "../Unsubscribe/appwrite";

export interface EmailProps {
  lang: string;
  from: string;
  to: string;
  preview: string;
  subject: string;
  baseUrl: string;
}

export type EmailErrors =
  | "invalidEmail"
  | "invalidToken"
  | "internalServerError"
  | "invalidEmailProvided";

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getUnsubscribeLink = async (
  baseUrl: string,
  lang: string,
  email: string,
) => {
  const token = await getTokenByEmail(email);
  if (!token) {
    console.error("No document found for email:", email);
    return null;
  }

  const encodedEmail = encodeURIComponent(email);

  return `${baseUrl}/${lang}/unsubscribe?token=${token}&email=${encodedEmail}`;
};
