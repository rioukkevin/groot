import { talkSchema } from "@/shared/talk";
import getEmailTemplate from "@/templates/email/project";
import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function POST(request: Request) {
  const params = await request.formData();

  const files: Mail.Attachment[] = [];

  const formDataEntryValues = Array.from(params.values());
  for (const formDataEntryValue of formDataEntryValues) {
    if (
      typeof formDataEntryValue === "object" &&
      "arrayBuffer" in formDataEntryValue
    ) {
      const file = formDataEntryValue as unknown as Blob;
      const buffer = Buffer.from(await file.arrayBuffer());
      files.push({
        filename: formDataEntryValue.name,
        content: buffer,
      });
    }
  }

  const name = params.get("name")?.toString();
  const company = params.get("company")?.toString();
  const job = params.get("job")?.toString();
  const contact = params.get("contact")?.toString();
  const description = params.get("description")?.toString();

  const { error, value } = talkSchema.validate(
    {
      name,
      company,
      job,
      contact,
      description,
    },
    { abortEarly: false }
  );

  if (error) {
    return NextResponse.json({ status: 400, error });
  }

  const transporter = createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: process.env.GMAIL_FROM,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  try {
    await transporter.sendMail({
      from: '"Ooof.dev"<no-reply@ooof.dev>',
      to: "kevin+project@ooof.dev",
      replyTo: "kevin.trash@ooof.dev",
      subject: `NEW PROJECT | ${name} from ${company}`,
      text: `
My name is ${name} from ${company}.
I'm looking for a(n) ${job}.
My project is the following ${description}.
You can contact me at ${contact}
      `,
      html: getEmailTemplate(value),
      attachments: files,
    });
    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 });
  }
}
