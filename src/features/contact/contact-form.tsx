"use client";

import { useId, useState, type FormEvent } from "react";
import {
  contactLimits,
  HONEYPOT_FIELD,
  parseContactMessage,
  type ContactErrors,
} from "./contact-message";
import styles from "./contact.module.css";

type FormStatus =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "failed"; reason: string };

const FALLBACK_ERROR = "The message couldn't be sent. Please try again, or email me directly.";

// The contact form. A message is checked here first for quick feedback, then again on the
// server, which emails it to me.
export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({ state: "idle" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const id = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));

    const parsed = parseContactMessage(fields);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      setStatus({ state: "idle" });
      // Move to the first field that needs attention.
      const firstInvalid = (["name", "email", "message"] as const).find((field) => parsed.errors[field]);
      if (firstInvalid) form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus({ state: "sending" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (response.ok) {
        setStatus({ state: "sent" });
        return;
      }
      const body: { error?: string; fields?: ContactErrors } = await response.json().catch(() => ({}));
      setErrors(body.fields ?? {});
      setStatus({ state: "failed", reason: body.error ?? FALLBACK_ERROR });
    } catch {
      setStatus({ state: "failed", reason: FALLBACK_ERROR });
    }
  }

  if (status.state === "sent") {
    return (
      <p className={styles.sent} role="status">
        Thanks, your message is on its way. I&apos;ll reply by email.
      </p>
    );
  }

  const isSending = status.state === "sending";

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Send me a message">
      <div className={styles.field}>
        <label htmlFor={`${id}-name`}>Your name</label>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={contactLimits.name}
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
        />
        {errors.name && (
          <p id={`${id}-name-error`} className={styles.error}>
            {errors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-email`}>Your email</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={contactLimits.email}
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${id}-email-error` : undefined}
        />
        {errors.email && (
          <p id={`${id}-email-error`} className={styles.error}>
            {errors.email}
          </p>
        )}
      </div>

      <div className={`${styles.field} ${styles.wide}`}>
        <label htmlFor={`${id}-message`}>Message</label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          maxLength={contactLimits.message}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${id}-message-error` : undefined}
        />
        {errors.message && (
          <p id={`${id}-message-error`} className={styles.error}>
            {errors.message}
          </p>
        )}
      </div>

      {/* Not for people: hidden from sight, keyboards and screen readers. See HONEYPOT_FIELD. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor={`${id}-trap`}>Leave this empty</label>
        <input id={`${id}-trap`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={`${styles.submitRow} ${styles.wide}`}>
        <button type="submit" className="pill pill-link" disabled={isSending}>
          {isSending ? "Sending…" : "Send message"}
        </button>
        <p className={styles.status} role="status">
          {status.state === "failed" ? status.reason : ""}
        </p>
      </div>
    </form>
  );
}
