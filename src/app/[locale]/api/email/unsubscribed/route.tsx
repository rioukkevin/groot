"use server";

import { render } from "@react-email/render";
import { AppwriteException } from "appwrite";
import { NextResponse } from "next/server";
import React from "react";

import {
  databases,
  DEFAULT_NEWS_COLLECTION_ID,
  DEFAULT_NEWS_DATABASE_ID,
} from "@/lib/appwrite";
import { getCurrentLocale, getScopedI18n } from "@/lib/locales/server";
import { sendEmail } from "@/lib/nodemailer";
import { EmailErrors, validateEmail } from "@/modules/Email/email";
import { EmailUnsubscribed } from "@/modules/Email/EmailUnsubscribed";
import { UnsubscribeResponse } from "@/modules/Unsubscribe/appwrite";

const unsubscribe = async (
  token: string,
  email: string,
): Promise<UnsubscribeResponse> => {
  try {
    const document = await databases.getDocument(
      DEFAULT_NEWS_DATABASE_ID,
      DEFAULT_NEWS_COLLECTION_ID,
      token,
    );

    if (document && document.email === email) {
      await databases.deleteDocument(
        DEFAULT_NEWS_DATABASE_ID,
        DEFAULT_NEWS_COLLECTION_ID,
        token,
      );
      return { isSuccess: true, message: "success" };
    } else {
      return {
        isSuccess: false,
        message: "invalidEmail",
      };
    }
  } catch (error) {
    console.error("Subscription unsubscribe error:", error);

    if (error instanceof AppwriteException) {
      if (error.code === 404) {
        return { isSuccess: false, message: "subscriptionNotFound" };
      }
    }

    return { isSuccess: false, message: "error" };
  }
};

export async function POST(request: Request) {
  try {
    const lang = await getCurrentLocale();
    const tContent = await getScopedI18n("email.unsubscribed");

    const { email, token } = await request.json();
    if (!email || typeof email !== "string") {
      throw new Error("invalidEmailProvided" as EmailErrors);
    }
    if (!token || typeof token !== "string") {
      throw new Error("invalidToken" as EmailErrors);
    }
    if (!validateEmail(email)) {
      throw new Error("invalidEmail" as EmailErrors);
    }

    const unsubscribeResponse = await unsubscribe(token, email);

    if (!unsubscribeResponse.isSuccess) {
      throw new Error(unsubscribeResponse.message);
    }

    const baseUrl = process.env.URL
      ? `https://${process.env.URL}`
      : "http://localhost:3000";

    const config = {
      lang,
      baseUrl,
    };

    const data = {
      subject: tContent("subject"),
      from: process.env.GMAIL_FROM ?? "",
      to: email,
      preview: tContent("preview"),
      textEmail: tContent("textEmail"),
    };

    const htmlEmail = await render(<EmailUnsubscribed {...data} {...config} />);

    await sendEmail(htmlEmail, data.textEmail, data.subject, email);

    return NextResponse.json(
      { message: "Unsubscription successful" },
      { status: 200 },
    );
  } catch (error) {
    const tError = await getScopedI18n("email.error");
    if (error instanceof Error) {
      if (error.message === "invalidEmailProvided") {
        return NextResponse.json(
          { message: tError("invalidEmailProvided") },
          { status: 400 },
        );
      }
      if (error.message === "invalidEmail") {
        return NextResponse.json(
          { message: tError("invalidEmail") },
          { status: 400 },
        );
      }
      if (error.message === "internalServerError") {
        return NextResponse.json(
          { message: tError("internalServerError") },
          { status: 500 },
        );
      }
      if (error.message === "invalidToken") {
        return NextResponse.json(
          { message: tError("invalidToken") },
          { status: 400 },
        );
      }
      if (error.message === "subscriptionNotFound") {
        return NextResponse.json(
          { message: tError("subscriptionNotFound") },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { message: tError("internalServerError") },
      { status: 500 },
    );
  }
}
