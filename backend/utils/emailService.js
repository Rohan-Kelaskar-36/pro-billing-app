import nodemailer from "nodemailer";

export const createTransporter = () => {
  const service = process.env.SMTP_SERVICE; // e.g., 'gmail', 'sendgrid'
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if ((!service && !host) || !user || !pass) {
    throw new Error("SMTP credentials are not configured in environment variables");
  }

  const commonOptions = {
    auth: { user, pass },
    // Timeouts to avoid hanging connections
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 10000),
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT || 10000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 20000),
    tls: {
      // Some providers require this on shared hosts
      ciphers: "TLSv1.2",
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === "true",
    },
  };

  const transporter = service
    ? nodemailer.createTransport({ service, ...commonOptions })
    : nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        requireTLS: port === 587,
        ...commonOptions,
      });

  return transporter;
};

export const sendEmailWithAttachment = async ({
  to,
  subject,
  text,
  html,
  attachments = [],
}) => {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  // Fallback 1: Resend API if configured (avoids SMTP networking issues)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const url = "https://api.resend.com/emails";
    // Convert attachments to base64 as required by Resend API
    const resendAttachments = (attachments || []).map((a) => ({
      filename: a.filename,
      content: Buffer.isBuffer(a.content)
        ? a.content.toString("base64")
        : Buffer.from(String(a.content || ""), "utf8").toString("base64"),
    }));

    const body = {
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || `<pre>${text || ""}</pre>`,
      attachments: resendAttachments,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Resend API failed: ${res.status} ${errText}`);
    }
    return;
  }

  // Fallback 2: SMTP transport
  const transporter = createTransporter();
  await transporter.sendMail({ from, to, subject, text, html, attachments });
};


