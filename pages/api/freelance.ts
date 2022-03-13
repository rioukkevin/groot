import sgMail from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";

sgMail.setApiKey(process.env.EMAIL_API_KEY ?? "");

const r = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subject, content, coordinates, attachments } = req.body;

  const files: any[] = await Promise.all(
    attachments.map(async (a: any) => ({
      content: a.base64.split(";base64,")[1],
      filename: a.name,
      type: a.type,
      disposition: "attachment",
    }))
  );

  try {
    const sending = await sgMail.send({
      to: "kevin@riou.pro",
      from: "riou.kkevin@gmail.com",
      subject,
      html: content + `\n<span>${coordinates}</span>`,
      attachments: files,
    });
    res.json({ message: `Email has been sent ${sending[0].statusCode}` });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default r;
