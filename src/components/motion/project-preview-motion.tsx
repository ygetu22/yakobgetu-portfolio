import type { ReactNode } from "react";
import styles from "./project-preview-motion.module.css";

type ProjectPreviewMotionProps = {
  children: ReactNode;
  variant?: "drift" | "sway" | "breathe";
  className?: string;
  phase?: number;
};

export default function ProjectPreviewMotion({ children, variant = "drift", className = "", phase = 0 }: ProjectPreviewMotionProps) {
  return (
    <div className={`${styles.motion} ${styles[variant]} ${className}`} style={{ animationDelay: `${phase}s` }}>
      {children}
    </div>
  );
}
