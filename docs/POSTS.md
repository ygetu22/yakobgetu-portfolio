# Posts, likes and comments

Posts live in `src/features/posts/posts.ts`. Each has a page at `/posts/<id>`, and Home lists
them under Posts. Likes and comments are stored in a small Upstash Redis database; "Save" and
"Share" happen only in the visitor's browser.

## Adding a post

Add an entry at the top of the `posts` array (newest first) with an `id` (used in the address),
`title`, `date` (`YYYY-MM-DD`) and `paragraphs`. The second paragraph is the preview on Home.

## The database

- It is Upstash for Redis on the free plan, added through the Vercel Marketplace
  (Vercel → Storage → `yakobgetu-redis`). Vercel provides `KV_REST_API_URL` and
  `KV_REST_API_TOKEN` to the site; `src/features/storage/redis.ts` calls its REST API with
  `fetch`, so there is no client library.
- For local development, run `vercel env pull .env.local`. That uses the same database as the
  live site, so delete anything you post while testing.
- Without the two variables the site still works: posts show, and the buttons say likes and
  comments aren't switched on yet.

Keys: `post:<id>:likes` (a number) and `post:<id>:comments` (a list of JSON comments, newest
first, at most 200).

## Comments

They show up right away. `post-comment.ts` holds the rules the form and the server share:
a name and up to 500 characters, no links, and a short list of blocked words (whole words only).
The routes are same-origin only, rate limited, and have a hidden field that catches bots.
When the email settings are filled in (see [CONTACT_FORM.md](CONTACT_FORM.md)), each new comment
is emailed to Yakob.

To delete a comment: open the database in Vercel (Storage → `yakobgetu-redis` → Open in
Upstash) → Data Browser → `post:<id>:comments`, and remove that entry.

## Likes

A like adds one to the count and remembers in the visitor's browser that they liked it, so the
heart stays filled; tapping again takes it back. Someone can still clear their browser and like
again. That is fine for a personal site, and the routes are rate limited.
