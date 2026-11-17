import { createRateLimiter } from "@/features/notifications/rate-limit";
import { clientAddress, isSameOrigin, readSmallJson } from "@/features/notifications/request-checks";
import { sendEmailToYakob } from "@/features/notifications/send-email";
import { journalPhotos } from "./journal-data";
import { parseReaction, type Reaction } from "./reaction";

// POST /api/elsewhere/reactions: lets Yakob know when someone likes, reposts or comments on a
// journal photo. Nothing is stored on the server and nothing is shown to other visitors.

const MAX_BODY_BYTES = 2_000;
const knownPhotoIds = journalPhotos.map((photo) => photo.id);

const perVisitor = createRateLimiter({ limit: 20, windowMs: 10 * 60 * 1000 });
const siteWide = createRateLimiter({ limit: 60, windowMs: 60 * 60 * 1000 });

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function emailFor(reaction: Reaction) {
  const photo = journalPhotos.find((entry) => entry.id === reaction.photoId);
  const where = photo ? `${photo.place} (${photo.date})` : reaction.photoId;

  if (reaction.kind === "comment") {
    return { subject: `Elsewhere: new comment on ${where}`, text: `Someone commented on ${where}:\n\n${reaction.comment}` };
  }
  const action = reaction.kind === "like" ? "liked" : "reposted";
  return { subject: `Elsewhere: someone ${action} ${where}`, text: `Someone ${action} your photo of ${where}.` };
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return reply(403, { error: "Reactions are only accepted from the site." });

  if (!perVisitor.allow(clientAddress(request)) || !siteWide.allow("reactions")) {
    return reply(429, { error: "Too many reactions for now." });
  }

  const reaction = parseReaction(await readSmallJson(request, MAX_BODY_BYTES), knownPhotoIds);
  if (!reaction) return reply(400, { error: "That reaction could not be read." });

  const result = await sendEmailToYakob(emailFor(reaction));
  if (result === "sent") return reply(200, { ok: true });
  return reply(result === "not-configured" ? 503 : 502, { error: "The reaction could not be passed on." });
}
