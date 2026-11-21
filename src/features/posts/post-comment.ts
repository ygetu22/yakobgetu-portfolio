// The rules for a comment on a post. The form and the server both use them, so they always agree.
// Comments show up right away, so anything that looks like spam is refused here.

export const COMMENT_NAME_MAX = 40;
export const COMMENT_TEXT_MAX = 500;

export type PostComment = {
  id: string;
  name: string;
  text: string;
  // ISO timestamp.
  at: string;
};

// Links are the usual sign of spam, and nothing here needs one.
const LINK_PATTERN = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|xyz|ru|top|info|biz|link|click)\b)/i;

// A short list of slurs and obvious abuse. Not complete; Yakob can still delete a comment (docs/POSTS.md).
const BLOCKED_WORDS = ["nigger", "nigga", "faggot", "retard", "kys", "kill yourself", "porn", "casino", "viagra", "crypto giveaway"];
// Whole words only, so "skys" or "Pornic" do not match.
const BLOCKED_PATTERN = new RegExp(`\\b(${BLOCKED_WORDS.join("|")})\\b`, "i");

export type CommentDraft = { name: string; text: string };
export type CommentCheck = { ok: true; comment: CommentDraft } | { ok: false; error: string };

function singleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function checkComment(input: unknown): CommentCheck {
  if (typeof input !== "object" || input === null) return { ok: false, error: "The comment could not be read." };
  const { name, text } = input as Record<string, unknown>;
  if (typeof name !== "string" || typeof text !== "string") return { ok: false, error: "The comment could not be read." };

  const cleanName = singleLine(name);
  // Keep the visitor's paragraphs, but no more than one blank line in a row.
  const cleanText = text.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();

  if (!cleanName) return { ok: false, error: "Add your name." };
  if (cleanName.length > COMMENT_NAME_MAX) return { ok: false, error: `Keep your name under ${COMMENT_NAME_MAX} characters.` };
  if (!cleanText) return { ok: false, error: "Write a comment first." };
  if (cleanText.length > COMMENT_TEXT_MAX) return { ok: false, error: `Keep it under ${COMMENT_TEXT_MAX} characters.` };

  const combined = `${cleanName} ${cleanText}`.toLowerCase();
  if (LINK_PATTERN.test(combined)) return { ok: false, error: "Links aren't allowed in comments." };
  if (BLOCKED_PATTERN.test(combined)) return { ok: false, error: "That comment can't be posted." };

  return { ok: true, comment: { name: cleanName, text: cleanText } };
}

// The form has a field people never see; bots fill it in.
export function isHoneypotFilled(input: unknown): boolean {
  if (typeof input !== "object" || input === null) return false;
  const value = (input as Record<string, unknown>).website;
  return typeof value === "string" && value.trim() !== "";
}
