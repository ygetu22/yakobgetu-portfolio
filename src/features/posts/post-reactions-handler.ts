import { createRateLimiter } from "@/features/notifications/rate-limit";
import { clientAddress, isSameOrigin, readSmallJson } from "@/features/notifications/request-checks";
import { sendEmailToYakob } from "@/features/notifications/send-email";
import { runCommands } from "@/features/storage/redis";
import { checkComment, isHoneypotFilled, type PostComment } from "./post-comment";
import { findPost } from "./posts";

// The routes behind a post's likes and comments (see docs/POSTS.md):
//   GET  /api/posts/<id>           the like count and the comments
//   POST /api/posts/<id>/like      { "liked": true } adds a like, false takes it back
//   POST /api/posts/<id>/comments  { "name", "text" } adds a comment and emails Yakob

const MAX_COMMENTS_KEPT = 200;
const MAX_BODY_BYTES = 4_000;
const TEN_MINUTES = 10 * 60 * 1000;

const likesPerVisitor = createRateLimiter({ limit: 20, windowMs: TEN_MINUTES });
const commentsPerVisitor = createRateLimiter({ limit: 3, windowMs: TEN_MINUTES });
const commentsSiteWide = createRateLimiter({ limit: 40, windowMs: 60 * 60 * 1000 });

const likesKey = (postId: string) => `post:${postId}:likes`;
const commentsKey = (postId: string) => `post:${postId}:comments`;

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const STORAGE_OFF = { error: "Likes and comments aren't switched on yet." };

function parseStoredComments(raw: unknown): PostComment[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    try {
      return [JSON.parse(String(item)) as PostComment];
    } catch {
      return [];
    }
  });
}

export async function getReactions(postId: string) {
  if (!findPost(postId)) return reply(404, { error: "No such post." });

  const results = await runCommands([
    ["GET", likesKey(postId)],
    ["LRANGE", commentsKey(postId), 0, MAX_COMMENTS_KEPT - 1],
  ]);
  if (!results) return reply(503, STORAGE_OFF);

  return reply(200, { likes: Number(results[0] ?? 0), comments: parseStoredComments(results[1]) });
}

export async function postLike(request: Request, postId: string) {
  if (!findPost(postId)) return reply(404, { error: "No such post." });
  if (!isSameOrigin(request)) return reply(403, { error: "Likes only come from the site." });
  if (!likesPerVisitor.allow(clientAddress(request))) return reply(429, { error: "Slow down a little." });

  const body = await readSmallJson(request, MAX_BODY_BYTES);
  const liked = (body as { liked?: unknown } | null)?.liked;
  if (typeof liked !== "boolean") return reply(400, { error: "The like could not be read." });

  const results = await runCommands([[liked ? "INCR" : "DECR", likesKey(postId)]]);
  if (!results) return reply(503, STORAGE_OFF);

  let likes = Number(results[0]);
  // Taking back a like never drops the count below zero.
  if (likes < 0) {
    await runCommands([["SET", likesKey(postId), 0]]);
    likes = 0;
  }
  return reply(200, { likes });
}

export async function postComment(request: Request, postId: string) {
  const post = findPost(postId);
  if (!post) return reply(404, { error: "No such post." });
  if (!isSameOrigin(request)) return reply(403, { error: "Comments only come from the site." });
  if (!commentsPerVisitor.allow(clientAddress(request)) || !commentsSiteWide.allow("comments")) {
    return reply(429, { error: "That's a lot of comments. Please try again in a few minutes." });
  }

  const body = await readSmallJson(request, MAX_BODY_BYTES);
  if (body === null) return reply(400, { error: "The comment could not be read." });
  // Tell bots it worked so they do not adapt, but save nothing.
  if (isHoneypotFilled(body)) return reply(200, { ok: true });

  const checked = checkComment(body);
  if (!checked.ok) return reply(400, { error: checked.error });

  const comment: PostComment = {
    id: crypto.randomUUID(),
    ...checked.comment,
    at: new Date().toISOString(),
  };
  const results = await runCommands([
    ["LPUSH", commentsKey(postId), JSON.stringify(comment)],
    ["LTRIM", commentsKey(postId), 0, MAX_COMMENTS_KEPT - 1],
  ]);
  if (!results) return reply(503, STORAGE_OFF);

  // The comment is already saved; the email is only a heads-up, so its result does not matter here.
  await sendEmailToYakob({
    subject: `New comment on "${post.title}" from ${comment.name}`,
    text: `${comment.text}\n\nFrom: ${comment.name}\nhttps://yakobgetu.com/posts/${postId}`,
  });

  return reply(200, { ok: true, comment });
}
