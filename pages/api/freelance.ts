import sgMail from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";
import { defaultProps } from "react-quill";

sgMail.setApiKey(process.env.EMAIL_API_KEY ?? "");

const getTemplate = (props: { [key: string]: string | any[] }) => `
<p>Salut, je m'appelle ${
  props.name
} je cherche un freelance pour une mission. L'objectif de cette mission est ${
  props.subject
}. Voici un peu plus de détails :</p>
${props.content}
${props.attachments ? '<p color="red">Avec quelques pièces jointes</p>' : ""}
<p>Et mon email + téléphone pour me recontacter ${props.coordinates}</p>
<p>Je te souhaite une bonne journée,</p>
<p>${props.name}</p>
`;

const r = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subject, content, coordinates, name, attachments } = req.body;

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
      html: getTemplate({
        subject,
        content,
        coordinates,
        name,
        attachments: files,
      }),
      attachments: files,
    });
    res.json({ message: `Email has been sent ${sending[0].statusCode}` });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default r;
