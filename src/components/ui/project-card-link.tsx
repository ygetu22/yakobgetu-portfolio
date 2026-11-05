import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./project-card-link.module.css";

type ProjectCardLinkProps = {
  href: string;
  label: string;
  external?: boolean;
  children: ReactNode;
};

export default function ProjectCardLink({ href, label, external = false, children }: ProjectCardLinkProps) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={styles.link}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={label} className={styles.link}>
      {children}
    </Link>
  );
}
