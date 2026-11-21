import { SiteLink } from "@/components/layout/page-curtain";
import { formatPostDate, posts } from "./posts";
import styles from "./posts.module.css";

// The Posts section on Home: one card per post, newest first.
export default function PostList() {
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.id}>
          <SiteLink href={`/posts/${post.id}`} curtainTitle={post.title} className={styles.card} data-cursor="open">
            <span className={`muted ${styles.cardDate}`}>{formatPostDate(post.date)}</span>
            <span className={`display-heading ${styles.cardTitle}`}>{post.title}</span>
            <span className={styles.cardExcerpt}>{post.paragraphs[1]}</span>
            <span className={styles.cardRead}>
              Read <span aria-hidden="true">→</span>
            </span>
          </SiteLink>
        </li>
      ))}
    </ul>
  );
}
