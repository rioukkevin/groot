import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { sendEmail } from "@/lib/nodemailer";
import { EmailSubscribed } from "@/modules/Email/EmailSubscribed";
import { getCurrentLocale, getScopedI18n } from "@/lib/locales/server";
import { EmailErrors, validateEmail } from "@/modules/Email/email";
import {
  databases,
  DEFAULT_NEWS_DATABASE_ID,
  DEFAULT_NEWS_COLLECTION_ID,
} from "@/lib/appwrite";
import { ID, Query } from "appwrite";

interface CheckAndCreateSubscriptionResponse {
  isSuccess: boolean;
  message: string;
  id?: string;
}

async function checkAndCreateSubscription(
  email: string,
): Promise<CheckAndCreateSubscriptionResponse> {
  try {
    const existingDocuments = await databases.listDocuments(
      DEFAULT_NEWS_DATABASE_ID,
      DEFAULT_NEWS_COLLECTION_ID,
      [Query.equal("email", email)],
    );

    if (existingDocuments.documents.length > 0) {
      throw new Error("alreadySubscribed" as EmailErrors);
    }

    const doc = await databases.createDocument(
      DEFAULT_NEWS_DATABASE_ID,
      DEFAULT_NEWS_COLLECTION_ID,
      ID.unique(),
      { email, subscriptionDate: new Date() },
    );

    return { isSuccess: true, message: "Subscription successful", id: doc.$id };
  } catch (error) {
    console.error("Error checking/creating subscription:", error);
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message as EmailErrors };
    }
    return { isSuccess: false, message: "internalServerError" as EmailErrors };
  }
}

export async function POST(request: Request) {
  try {
    const lang = await getCurrentLocale();
    const tContent = await getScopedI18n("email.subscribed");

    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      throw new Error("invalidEmailProvided" as EmailErrors);
    }
    if (!validateEmail(email)) {
      throw new Error("invalidEmail" as EmailErrors);
    }

    const { isSuccess, message } = await checkAndCreateSubscription(email);

    if (!isSuccess) {
      throw new Error(message as EmailErrors);
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

    const htmlEmail = await render(<EmailSubscribed {...data} {...config} />);

    await sendEmail(htmlEmail, data.textEmail, data.subject, email);

    return NextResponse.json(
      { message: "Subscription successful" },
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
      if (error.message === "alreadySubscribed") {
        return NextResponse.json(
          { message: tError("alreadySubscribed") },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { message: tError("internalServerError") },
      { status: 500 },
    );
  }
}
