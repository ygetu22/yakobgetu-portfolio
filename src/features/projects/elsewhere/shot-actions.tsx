"use client";

import { useId, useState, type FormEvent } from "react";
import { showToast } from "@/components/ui/toast";
import type { JournalPhoto } from "./journal-data";
import { MAX_COMMENT_LENGTH } from "./reaction";
import type { useReactions } from "./use-reactions";
import styles from "./journal.module.css";

const icons = {
  like: "M12 20.5s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.9c0 5.6-7.5 10-7.5 10z",
  comment: "M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5z",
  share: "M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5 21 3z",
  repost: "M17 2.5 20.5 6 17 9.5M3.5 11V9a3 3 0 0 1 3-3h14M7 21.5 3.5 18 7 14.5M20.5 13v2a3 3 0 0 1-3 3h-14",
};

function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={icons[name]} />
    </svg>
  );
}

type ShotActionsProps = {
  photo: JournalPhoto;
  reactions: ReturnType<typeof useReactions>;
};

// The row under each photo: like, comment, share and repost.
export default function ShotActions({ photo, reactions }: ShotActionsProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [draft, setDraft] = useState("");
  const formId = useId();
  const isLiked = reactions.isLiked(photo.id);
  const comments = reactions.commentsOn(photo.id);

  function photoLink(): string {
    return new URL(`/projects/elsewhere#shot-${photo.id}`, window.location.href).href;
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(photoLink());
      showToast("Link to this photo copied");
    } catch {
      showToast("Couldn't copy the link");
    }
  }

  // Phones open their own share sheet; elsewhere the link is copied so it can be posted anywhere.
  async function repost() {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${photo.place} · Elsewhere`, url: photoLink() });
      } else {
        await navigator.clipboard.writeText(photoLink());
        showToast("Link copied, ready to repost");
      }
    } catch {
      return; // the visitor closed the share sheet
    }
    reactions.markReposted(photo.id);
  }

  async function submitComment(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const sending = reactions.addComment(photo.id, text);
    if (sending === false) {
      showToast("That's plenty of comments for one photo");
      return;
    }
    setDraft("");
    showToast((await sending) ? "Sent to Yakob" : "Saved here, but it couldn't be sent");
  }

  return (
    <div className={styles.social}>
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.action} ${styles.like}`}
          aria-pressed={isLiked}
          aria-label={`Like the photo of ${photo.place}`}
          onClick={() => reactions.toggleLike(photo.id)}
        >
          {/* The key restarts the little "pop" each time the heart is filled. */}
          <span key={String(isLiked)} className={isLiked ? styles.popping : undefined}>
            <Icon name="like" />
          </span>
        </button>
        <button
          type="button"
          className={styles.action}
          aria-expanded={isCommenting}
          aria-controls={formId}
          aria-label={`Comment on the photo of ${photo.place}`}
          onClick={() => setIsCommenting(!isCommenting)}
        >
          <Icon name="comment" />
        </button>
        {comments.length > 0 && (
          <span className={styles.commentCount}>
            {comments.length}
            <span className="sr-only"> {comments.length === 1 ? "comment" : "comments"} from you</span>
          </span>
        )}
        <button
          type="button"
          className={`${styles.action} ${styles.share}`}
          aria-label={`Copy a link to the photo of ${photo.place}`}
          onClick={share}
        >
          <Icon name="share" />
        </button>
        <button
          type="button"
          className={`${styles.action} ${styles.repost}`}
          aria-pressed={reactions.isReposted(photo.id)}
          aria-label={`Repost the photo of ${photo.place}`}
          onClick={repost}
        >
          <Icon name="repost" />
        </button>
      </div>

      {comments.length > 0 && (
        <ul className={styles.comments} aria-label="Your comments">
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      )}

      <form id={formId} className={styles.commentForm} hidden={!isCommenting} onSubmit={submitComment}>
        <input
          type="text"
          value={draft}
          maxLength={MAX_COMMENT_LENGTH}
          placeholder="Add a comment…"
          aria-label={`Your comment on the photo of ${photo.place}. It is sent to Yakob.`}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit">Post</button>
        <p className="muted">Comments go to me, not onto the page.</p>
      </form>
    </div>
  );
}
