"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { tibebBand } from "@/components/culture/tibeb";
import { showToast } from "@/components/ui/toast";
import { drawNameCard } from "./share-card";
import { transliterateName, type GeezLetter } from "./transliterate";
import styles from "./geez-name.module.css";

const NAME_MAX = 40;
const bandStyle = { "--band": tibebBand.url, "--band-height": `${tibebBand.height}px` } as CSSProperties;

// "Your name in Ge'ez": a visitor types their name and gets it written in fidel, letter by letter,
// on a small card with a tibeb border that they can share or save. The name stays in their
// browser; the server only counts how many names have been written.
export default function GeezNameCard() {
  const [typedName, setTypedName] = useState("");
  const [words, setWords] = useState<GeezLetter[][]>([]);
  const [shownName, setShownName] = useState("");
  const [picked, setPicked] = useState<GeezLetter | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/geez-names", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { count: number } | null) => data && setCount(data.count))
      .catch(() => {
        // Without the counter the card still works; the count line just stays hidden.
      });
    return () => controller.abort();
  }, []);

  function write(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = transliterateName(typedName);
    if (result.length === 0) {
      showToast("Type a name in English letters");
      return;
    }
    setWords(result);
    setShownName(typedName.trim());
    setPicked(null);

    fetch("/api/geez-names", { method: "POST" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { count: number } | null) => data && setCount(data.count))
      .catch(() => {});
  }

  async function share() {
    const geezName = words.map((word) => word.map((letter) => letter.glyph).join("")).join(" ");
    setIsSharing(true);
    try {
      const picture = await drawNameCard(geezName, shownName);
      if (!picture) throw new Error("canvas unavailable");
      const file = new File([picture], "my-name-in-geez.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        // Closing the share sheet without sharing also rejects; nothing to do then.
        await navigator.share({ files: [file], title: "My name in Ge'ez" }).catch(() => {});
        return;
      }
      // No share sheet (most desktops): save the picture instead.
      const link = document.createElement("a");
      link.href = URL.createObjectURL(picture);
      link.download = file.name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 10_000);
    } catch {
      showToast("Couldn't make the picture");
    } finally {
      setIsSharing(false);
    }
  }

  let letterIndex = 0;

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={write}>
        <input
          value={typedName}
          onChange={(event) => setTypedName(event.target.value)}
          placeholder="Your name"
          maxLength={NAME_MAX}
          autoComplete="given-name"
          autoCapitalize="words"
          enterKeyHint="go"
          aria-label="Your name"
        />
        <button type="submit">Write it</button>
      </form>

      {words.length > 0 && (
        // key: the letters write themselves in again for each new name.
        <div key={shownName} className={styles.card} style={bandStyle}>
          <p className={styles.geez} lang="am" aria-label={`${shownName} in Ge'ez`}>
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className={styles.word}>
                {word.map((letter, index) => {
                  const order = letterIndex++;
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`${styles.letter} ${picked === letter ? styles.pickedLetter : ""}`}
                      style={{ "--i": order } as CSSProperties}
                      onClick={() => setPicked(picked === letter ? null : letter)}
                      aria-label={letter.sound ? `${letter.glyph}, said ${letter.sound}` : letter.glyph}
                    >
                      {letter.glyph}
                    </button>
                  );
                })}
              </span>
            ))}
          </p>
          <p className={styles.typed}>{shownName}</p>
          <p className={styles.sound} aria-live="polite">
            {picked?.sound ? (
              <>
                <span lang="am">{picked.glyph}</span> is said “{picked.sound}”
              </>
            ) : (
              "Tap a letter to hear how it's said"
            )}
          </p>
        </div>
      )}

      {words.length > 0 && (
        <button type="button" className={styles.share} onClick={share} disabled={isSharing}>
          {isSharing ? "Making your card…" : "Share your card"}
        </button>
      )}

      {count !== null && count > 0 && (
        <p className={`muted ${styles.count}`}>
          {count.toLocaleString("en-US")} {count === 1 ? "name" : "names"} written so far
        </p>
      )}
    </div>
  );
}
