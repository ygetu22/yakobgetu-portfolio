import { createRateLimiter } from "@/features/notifications/rate-limit";
import { clientAddress, isSameOrigin, readSmallJson } from "@/features/notifications/request-checks";
import { sendEmailToYakob } from "@/features/notifications/send-email";
import { isHoneypotFilled, parseContactMessage } from "./contact-message";

// POST /api/contact: checks a message from the contact form and emails it to Yakob.

const MAX_BODY_BYTES = 10_000;
const TEN_MINUTES = 10 * 60 * 1000;

// One visitor can send a few messages; the site as a whole has an hourly ceiling as a backstop.
const perVisitor = createRateLimiter({ limit: 3, windowMs: TEN_MINUTES });
const siteWide = createRateLimiter({ limit: 30, windowMs: 60 * 60 * 1000 });

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return reply(403, { error: "This form only accepts messages sent from the site." });

  if (!perVisitor.allow(clientAddress(request)) || !siteWide.allow("contact")) {
    return reply(429, { error: "That's a lot of messages. Please try again in a few minutes." });
  }

  const body = await readSmallJson(request, MAX_BODY_BYTES);
  if (body === null) return reply(400, { error: "The message could not be read." });

  // Tell bots it worked so they do not adapt, but send nothing.
  if (isHoneypotFilled(body)) return reply(200, { ok: true });

  const parsed = parseContactMessage(body);
  if (!parsed.ok) return reply(400, { error: "Please check the form.", fields: parsed.errors });

  const { name, email, message } = parsed.message;
  const result = await sendEmailToYakob({
    subject: `Portfolio message from ${name}`,
    text: `${message}\n\nFrom: ${name} <${email}>`,
    replyTo: email,
  });

  if (result === "sent") return reply(200, { ok: true });
  if (result === "not-configured") {
    return reply(503, { error: "The form isn't connected yet. Please email me directly instead." });
  }
  return reply(502, { error: "The message couldn't be sent. Please try again, or email me directly." });
}
