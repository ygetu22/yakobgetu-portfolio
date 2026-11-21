// Posts on the site, newest first. Each has a page at /posts/<id>.

export type Post = {
  id: string;
  title: string;
  // ISO date, shown as "November 20, 2026".
  date: string;
  paragraphs: string[];
};

export const posts: Post[] = [
  {
    id: "site-launch",
    title: "The new site is live",
    date: "2026-11-20",
    paragraphs: [
      "I finally launched the new version of my site.",
      "I wanted a place that shows my work but also feels like me. So there's Amharic all over it: my name in Ge'ez at the top, letters floating in the background, a tibeb band at the bottom, and my ethio playlist if you tap the music note.",
      "I rebuilt it this fall with Next.js, with a lot of help from Claude Code and Codex. Taking something from an idea all the way to launch taught me more than I expected.",
      "More is on the way. Elsewhere, my photo journal, is being reworked, and I'll post here when it's back.",
      "Thanks for stopping by. Leave a comment and say selam.",
    ],
  },
];

export function findPost(id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}

export function formatPostDate(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
