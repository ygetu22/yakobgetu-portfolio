"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { showToast } from "@/components/ui/toast";
import { COMMENT_NAME_MAX, COMMENT_TEXT_MAX, type PostComment } from "./post-comment";
import styles from "./posts.module.css";

type Status = "loading" | "ready" | "off";

// Whether this visitor liked or saved the post is remembered in their own browser only.
function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeFlag(key: string, value: boolean) {
  try {
    if (value) localStorage.setItem(key, "1");
    else localStorage.removeItem(key);
  } catch {
    // Private browsing can refuse storage; the button still works for this visit.
  }
}

function timeAgo(isoDate: string): string {
  const minutes = Math.round((Date.now() - new Date(isoDate).getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d`;
  return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Like, comment, share and save for one post, and its comments with a form to add one.
// Likes and comments are shared by everyone (stored on the server); "saved" stays on this device.
export default function PostReactions({ postId, title }: { postId: string; title: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const formId = useId();

  useEffect(() => {
    // Read once the browser answers, so the server-rendered page and the first render agree.
    function restoreFlags() {
      setIsLiked(readFlag(`liked:${postId}`));
      setIsSaved(readFlag(`saved:${postId}`));
    }

    const controller = new AbortController();
    fetch(`/api/posts/${postId}`, { signal: controller.signal })
      .then(async (response) => {
        restoreFlags();
        if (!response.ok) throw new Error(String(response.status));
        const data = (await response.json()) as { likes: number; comments: PostComment[] };
        setLikes(data.likes);
        setComments(data.comments);
        setStatus("ready");
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        restoreFlags();
        setStatus("off");
      });
    return () => controller.abort();
  }, [postId]);

  async function toggleLike() {
    if (status !== "ready") return;
    const nextLiked = !isLiked;
    // Show the change at once and undo it if the server refuses.
    setIsLiked(nextLiked);
    setLikes((count) => Math.max(0, count + (nextLiked ? 1 : -1)));
    writeFlag(`liked:${postId}`, nextLiked);

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: nextLiked }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setLikes(((await response.json()) as { likes: number }).likes);
    } catch {
      setIsLiked(!nextLiked);
      setLikes((count) => Math.max(0, count + (nextLiked ? -1 : 1)));
      writeFlag(`liked:${postId}`, !nextLiked);
      showToast("Couldn't save your like");
    }
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      // Closing the share sheet without sharing also lands in catch; nothing to do then.
      await navigator.share({ title, url }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied");
    } catch {
      showToast("Couldn't copy the link");
    }
  }

  function toggleSave() {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    writeFlag(`saved:${postId}`, nextSaved);
    showToast(nextSaved ? "Saved on this device" : "Removed from saved");
  }

  return (
    <>
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.action} ${isLiked ? styles.liked : ""}`}
          onClick={toggleLike}
          aria-pressed={isLiked}
          disabled={status !== "ready"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20.5s-7.5-4.6-9.4-9.3C1.3 7.9 3.4 4.5 6.8 4.5c2.1 0 3.5 1.2 4.2 2.4h2c.7-1.2 2.1-2.4 4.2-2.4 3.4 0 5.5 3.4 4.2 6.7-1.9 4.7-9.4 9.3-9.4 9.3z" />
          </svg>
          <span>{status === "ready" ? likes : ""}</span>
          <span className="sr-only">{isLiked ? "Unlike" : "Like"}</span>
        </button>

        <a className={styles.action} href={`#${formId}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5.5h16v10.5H9l-5 4z" />
          </svg>
          <span>{status === "ready" ? comments.length : ""}</span>
          <span className="sr-only">Comments</span>
        </a>

        <button type="button" className={styles.action} onClick={share}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v8h14v-8" />
          </svg>
          <span className="sr-only">Share</span>
        </button>

        <button
          type="button"
          className={`${styles.action} ${styles.save} ${isSaved ? styles.saved : ""}`}
          onClick={toggleSave}
          aria-pressed={isSaved}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 3.5h12v17l-6-4.2-6 4.2z" />
          </svg>
          <span className="sr-only">Save</span>
        </button>
      </div>

      <section className={styles.comments} aria-labelledby={`${formId}-title`}>
        <h2 id={`${formId}-title`} className={styles.commentsTitle}>
          Comments
        </h2>

        {status === "off" && <p className="muted">Likes and comments aren&apos;t switched on yet.</p>}
        {status === "ready" && comments.length === 0 && <p className="muted">No comments yet. Be the first.</p>}

        <ul className={styles.commentList}>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p className={styles.commentHead}>
                <span className={styles.avatar} aria-hidden="true">
                  {comment.name.charAt(0).toUpperCase()}
                </span>
                <span className={styles.commentName}>{comment.name}</span>
                <span className="muted">{timeAgo(comment.at)}</span>
              </p>
              <p className={styles.commentText}>{comment.text}</p>
            </li>
          ))}
        </ul>

        {status === "ready" && (
          <CommentForm id={formId} postId={postId} onPosted={(comment) => setComments((list) => [comment, ...list])} />
        )}
      </section>
    </>
  );
}

function CommentForm({ id, postId, onPosted }: { id: string; postId: string; onPosted: (comment: PostComment) => void }) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setIsSending(true);
    setError("");

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { comment?: PostComment; error?: string };
      if (!response.ok) {
        setError(result.error ?? "The comment couldn't be posted.");
        return;
      }
      if (result.comment) onPosted(result.comment);
      form.reset();
    } catch {
      setError("The comment couldn't be posted. Check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form id={id} className={styles.form} onSubmit={submit}>
      <input name="name" placeholder="Your name" maxLength={COMMENT_NAME_MAX} required autoComplete="given-name" aria-label="Your name" />
      <textarea name="text" placeholder="Say selam…" maxLength={COMMENT_TEXT_MAX} rows={3} required aria-label="Comment" />
      {/* Hidden from people; bots fill it in. */}
      <input className={styles.trap} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <button type="submit" className={styles.send} disabled={isSending}>
        {isSending ? "Posting…" : "Post"}
      </button>
    </form>
  );
}
