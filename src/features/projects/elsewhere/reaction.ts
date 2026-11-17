// A visitor's reaction to a journal photo, and the checks applied to it before it is trusted.
// Both the page and the server use this file, so the limits can never drift apart.

export const MAX_COMMENT_LENGTH = 280;

export const reactionKinds = ["like", "repost", "comment"] as const;
export type ReactionKind = (typeof reactionKinds)[number];

export type Reaction = {
  photoId: string;
  kind: ReactionKind;
  // Present only for comments.
  comment?: string;
};

// Turns whatever arrived in a request into a Reaction, or null if any part of it is not acceptable.
export function parseReaction(input: unknown, knownPhotoIds: readonly string[]): Reaction | null {
  if (typeof input !== "object" || input === null) return null;
  const { photoId, kind, comment } = input as Record<string, unknown>;

  if (typeof photoId !== "string" || !knownPhotoIds.includes(photoId)) return null;
  if (typeof kind !== "string" || !reactionKinds.includes(kind as ReactionKind)) return null;
  if (kind !== "comment") return { photoId, kind: kind as ReactionKind };

  if (typeof comment !== "string") return null;
  const text = comment.trim();
  if (text.length === 0 || text.length > MAX_COMMENT_LENGTH) return null;
  return { photoId, kind: "comment", comment: text };
}
