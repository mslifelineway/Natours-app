import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { ISendEmailOptions } from "../interfaces/types";

/**
 * @param options { ISendEmailOptions }
 *
 */

export const sendEmail = async (options: ISendEmailOptions) => {
  const { mailTo, subject, message } = options;

  /**
   * 1. Create a transporter
   * It's just a service like gmail
   *
   */

  const host: string = process.env.EMAIL_HOST || "";
  const port: number = Number(process.env.EMAIL_PORT);
  const username = process.env.EMAIL_USERNAME || "";
  const password = process.env.EMAIL_PASSWORD || "";

  const SMTPTransportOptions: SMTPTransport.Options = {
    host: host,
    port: port,
    secure: false,
    requireTLS: true,
    auth: {
      user: username,
      pass: password,
    },
    logger: true,
  };

  const transporter = nodemailer.createTransport(SMTPTransportOptions);

  /**
   * 2. Define the email options
   *
   */

  const mailOptions = {
    from: "Mukesh Kumar <mukesh@gmail.com>",
    to: mailTo,
    subject,
    text: message,
    //html:
  };

  /**
   * 3. Actually send the email
   */

  await transporter.sendMail(mailOptions);
};
