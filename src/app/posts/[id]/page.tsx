import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteLink } from "@/components/layout/page-curtain";
import PostReactions from "@/features/posts/post-reactions";
import { findPost, formatPostDate, posts } from "@/features/posts/posts";
import styles from "@/features/posts/posts.module.css";

type PostPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = findPost((await params).id);
  return post ? { title: `${post.title} · Yakob Getu`, description: post.paragraphs[0] } : {};
}

export default async function PostPage({ params }: PostPageProps) {
  const post = findPost((await params).id);
  if (!post) notFound();

  return (
    <article className={`section page-top ${styles.post}`} aria-labelledby="post-title">
      <SiteLink href="/#posts" curtainTitle="Posts" className="back-link">
        <span aria-hidden="true">←</span> Posts
      </SiteLink>
      <p className={`muted ${styles.date}`}>
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      </p>
      <h1 id="post-title" className={`display-heading ${styles.title}`}>
        {post.title}
      </h1>
      <div className={styles.body}>
        {post.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <PostReactions postId={post.id} title={post.title} />
    </article>
  );
}
