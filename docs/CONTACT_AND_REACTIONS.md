# Contact form and journal reactions

Two small server routes email me when a visitor does something:

| Route | When | What I get |
| --- | --- | --- |
| `POST /api/contact` | someone sends the contact form | their message, with Reply going to their address |
| `POST /api/elsewhere/reactions` | someone likes, reposts or comments on a journal photo | which photo, and the comment text if there is one |

There is no database. Likes and comments are remembered only in the visitor's own browser, and
comments are sent to me rather than shown to other visitors, so nothing needs moderating.

## Setup

1. Create a free account at https://resend.com and make an API key.
2. Copy `.env.example` to `.env.local` and fill in `RESEND_API_KEY` and `NOTIFY_EMAIL`.
   Use the same email address the Resend account was created with (see "Sender" below).
3. Restart `npm run dev`, send yourself a message from `/contact`, and check your inbox.
4. On the host (Vercel), add the same variables under Project → Settings → Environment Variables.

Without the variables the site still works: the form answers "The form isn't connected yet.
Please email me directly instead." and reactions stay in the browser.

### Sender

By default emails are sent from Resend's shared address `onboarding@resend.dev`, which can only
deliver to the address that owns the Resend account. That is all this site needs. To send from
`@yakobgetu.com` instead, verify the domain in Resend and set `NOTIFY_FROM`.

## Where the code is

- `src/features/notifications/` is shared by both routes: `send-email.ts` (the Resend call),
  `request-checks.ts` (same-origin check, body size limit, visitor address) and `rate-limit.ts`.
- `src/features/contact/contact-message.ts` holds the form's rules. The form and the server both
  use it, so they always agree. `contact-handler.ts` is the route.
- `src/features/projects/elsewhere/reaction.ts` and `reactions-handler.ts` do the same for reactions.
- The files in `src/app/api/` only re-export those handlers.

## What protects the routes

- **Same-origin only.** A request must carry an `Origin` header that matches the site's host.
- **Small bodies.** Contact accepts at most 10 KB, reactions 2 KB.
- **Validation.** Names and emails are single-line (line breaks are stripped, so nothing can be
  injected into the email's subject or reply-to), lengths are capped, and a reaction must name a
  photo that exists. Emails are plain text, so nothing a visitor types is treated as HTML.
- **Hidden field.** The form has a field people never see. If it is filled in, the server answers
  "ok" and sends nothing.
- **Rate limits.** Contact: 3 messages per visitor per 10 minutes, 30 per hour for the whole
  site. Reactions: 20 per visitor per 10 minutes, 60 per hour overall.
- **Secrets stay on the server.** The key is read only in `send-email.ts` and is never logged.

## Known limits

- The rate limits live in the memory of one server process. On serverless hosting each instance
  counts separately and forgets when it stops, so a determined sender can get past them. The
  site-wide hourly caps and Resend's own quota bound the damage, but if spam shows up, add
  Cloudflare Turnstile to the form or a rate-limit rule in the Vercel firewall.
- The visitor address comes from the `x-forwarded-for` header, which is trustworthy only behind
  a proxy that sets it (Vercel does). It is used for counting and nothing else.
- Every like sends an email. If that gets noisy, the simplest change is to notify for comments only.

## Tests

`npm test` covers the message and reaction rules, the same-origin and body-size checks, and the
rate limiter (`tests/contact-message.test.mjs`, `tests/elsewhere.test.mjs`, `tests/notifications.test.mjs`).
The Resend call itself is not tested automatically; check it by sending a real message after setup.
