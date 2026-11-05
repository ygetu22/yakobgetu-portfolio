import type { ReactNode } from "react";
import styles from "./action-link-label.module.css";

type ActionLinkLabelProps = {
  children: ReactNode;
  direction?: "forward" | "back" | "download";
};

const arrowPaths = {
  forward: "M5 19 19 5M5 5h14v14",
  back: "M19 12H5m6-6-6 6 6 6",
  download: "M12 4v13m-5-5 5 5 5-5M5 20h14",
};

export default function ActionLinkLabel({ children, direction = "forward" }: ActionLinkLabelProps) {
  return (
    <span className={styles.label}>
      <span className={styles.text}>{children}</span>
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={arrowPaths[direction]} />
        </svg>
      </span>
    </span>
  );
}
