// Sends Yakob an email through Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email).
//
// Server only. It needs two environment variables (see .env.example):
//   RESEND_API_KEY  the secret key, which must never reach the browser
//   NOTIFY_EMAIL    where the messages go
// Emails are plain text only, so nothing a visitor types is ever treated as HTML.

const RESEND_URL = "https://api.resend.com/emails";
// Resend's shared sender. It can only deliver to the account owner's own address, which is all this needs.
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

export type Email = {
  subject: string;
  text: string;
  // Lets Yakob answer a contact message with the Reply button.
  replyTo?: string;
};

export type SendResult = "sent" | "not-configured" | "failed";

export async function sendEmailToYakob(email: Email): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return "not-configured";

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM ?? DEFAULT_FROM,
        to: [to],
        subject: email.subject,
        text: email.text,
        reply_to: email.replyTo,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      // The status is enough to diagnose a problem; the key and the message stay out of the logs.
      console.error(`Resend refused an email with status ${response.status}`);
      return "failed";
    }
    return "sent";
  } catch {
    console.error("Resend could not be reached");
    return "failed";
  }
}
