// A message from the contact form, and the checks applied before it is accepted.
// The form and the server both use this file, so they always agree on the rules.

export const contactLimits = { name: 80, email: 254, message: 2000 };

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactMessage, string>>;

export type ParsedContact =
  | { ok: true; message: ContactMessage }
  | { ok: false; errors: ContactErrors };

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// One line of text: control characters and line breaks become spaces.
function singleLine(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
}

// Several lines of text: keeps line breaks, drops other control characters.
function multiLine(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
}

export function parseContactMessage(input: unknown): ParsedContact {
  const fields = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const name = singleLine(fields.name);
  const email = singleLine(fields.email);
  const message = multiLine(fields.message);
  const errors: ContactErrors = {};

  if (!name) errors.name = "Please add your name.";
  else if (name.length > contactLimits.name) errors.name = `Keep your name under ${contactLimits.name} characters.`;

  if (!email) errors.email = "Please add your email so I can reply.";
  else if (email.length > contactLimits.email || !EMAIL_SHAPE.test(email)) {
    errors.email = "That email address doesn't look right.";
  }

  if (!message) errors.message = "Please write a message.";
  else if (message.length > contactLimits.message) {
    errors.message = `Keep your message under ${contactLimits.message} characters.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, message: { name, email, message } };
}

// The form has one extra field that people never see. Simple bots fill in every field,
// so anything in it marks the message as automated.
export const HONEYPOT_FIELD = "website";

export function isHoneypotFilled(input: unknown): boolean {
  if (typeof input !== "object" || input === null) return false;
  const value = (input as Record<string, unknown>)[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim() !== "";
}
