import styles from "./rotating-wordmark.module.css";

export default function RotatingWordmark() {
  return (
    <span className={styles.wordmark} aria-hidden="true">
      <span className={styles.name} lang="en">Yakob</span>
      <span className={`${styles.name} ${styles.amharic}`} lang="am">ያዕቆብ</span>
    </span>
  );
}
