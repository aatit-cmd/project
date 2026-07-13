import transporter from "../config/nodemailer.config";
import ENV_CONFIG from "../config/env.config";
import { MailOptions } from "nodemailer/lib/json-transport";

interface IMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: any[];
}

export const sendEmail = async ({
  to,
  subject,
  html,
  cc,
  bcc,
  attachments,
}: IMailOptions) => {
  try {
    // const { to, subject, html, cc, bcc, attachments } = mailOptions;

    const mailOptions : MailOptions = {
      from: ENV_CONFIG.SMTP_FROM_EMAIL,
      to: to,
      subject : subject,
      html : html,
    };

    if(cc){
        mailOptions["cc"] = cc;
    } 
    if(bcc){
        mailOptions["bcc"] = bcc;
    }
    if(attachments){
        mailOptions["attachments"] = attachments;
    }
    await transporter.sendMail(mailOptions);
    console.log("mail sent");
  } catch (error) {
    console.log(error);
  }
};

     
