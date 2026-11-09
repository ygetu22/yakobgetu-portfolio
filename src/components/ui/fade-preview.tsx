import Link from "next/link";
import type { ReactNode } from "react";
import ActionLinkLabel from "./action-link-label";
import styles from "./fade-preview.module.css";

type FadePreviewProps = {
  children: ReactNode;
  href: string;
  linkLabel: string;
};

// Shows the top of a longer section fading out, with a link to the full page.
// The faded content is inert so keyboard and screen reader users go straight to the link.
export default function FadePreview({ children, href, linkLabel }: FadePreviewProps) {
  return (
    <div>
      <div className={styles.preview} aria-hidden="true" inert>
        {children}
      </div>
      <Link href={href} className="text-xs text-foreground/70 hover:text-foreground">
        <ActionLinkLabel>{linkLabel}</ActionLinkLabel>
      </Link>
    </div>
  );
}
