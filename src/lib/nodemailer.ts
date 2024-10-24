import { createTransport } from "nodemailer";

const SERVICE = "gmail";
const HOST = "smtp.gmail.com";

const FROM_EMAIL = "no-reply@ooof.dev";
const FROM_NAME = "RIOU Kevin";

export const sendEmail = async (
  htmlEmail: string,
  textEmail: string,
  subject: string,
  to: string,
) => {
  const transporter = createTransport({
    service: SERVICE,
    host: HOST,
    secure: true,
    auth: {
      user: process.env.GMAIL_FROM,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"${FROM_NAME}"<${FROM_EMAIL}>`,
    to,
    replyTo: FROM_EMAIL,
    subject,
    text: textEmail,
    html: htmlEmail,
  });
};
