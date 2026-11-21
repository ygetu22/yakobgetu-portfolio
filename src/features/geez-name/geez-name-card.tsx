"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { tibebBand } from "@/components/culture/tibeb";
import { showToast } from "@/components/ui/toast";
import { drawNameCard } from "./share-card";
import { lettersOf, transliterateName, type GeezLetter } from "./transliterate";
import styles from "./geez-name.module.css";

const NAME_MAX = 40;
const bandStyle = { "--band": tibebBand.url, "--band-height": `${tibebBand.height}px` } as CSSProperties;

// Shown one after another until the visitor types their own name.
const examples = [
  { typed: "Selam", geez: "ሰላም" },
  { typed: "Abebe", geez: "አበበ" },
  { typed: "Sarah", geez: "ሳራ" },
  { typed: "Daniel", geez: "ዳንኤል" },
  { typed: "Hana", geez: "ሃና" },
];
const EXAMPLE_MS = 3200;

// Each word of the name and the spellings it could have, with the one picked.
type WordChoice = { options: string[]; picked: number };

const join = (words: WordChoice[]) => words.map((word) => word.options[word.picked]).join(" ");

// The site's own spelling rules, used when Google's spelling is unavailable and offered as
// another option when it is.
function ruleSpelling(word: string): string {
  return transliterateName(word).map((letters) => letters.map((letter) => letter.glyph).join("")).join("");
}

async function spellName(name: string): Promise<WordChoice[]> {
  const typedWords = name.split(/[\s-]+/).filter(Boolean).slice(0, 4);
  let google: string[][] = [];
  try {
    const response = await fetch(`/api/geez-names/spell?name=${encodeURIComponent(name)}`);
    if (response.ok) google = ((await response.json()) as { words: string[][] }).words;
  } catch {
    // Google's spelling is a nicety; the rules below always give an answer.
  }

  return typedWords
    .map((word, index) => {
      // Google's spellings come first (the server puts Google Translate's ahead of its keyboard's);
      // the site's own rules are the last option, and the only one if Google is unreachable.
      const options = [...(google[index] ?? []).slice(0, 3), ruleSpelling(word)];
      return { options: [...new Set(options)].filter(Boolean), picked: 0 };
    })
    .filter((word) => word.options.length > 0);
}

// "Your name in Ge'ez": a visitor types their name and gets it written in fidel, letter by letter,
// on a card with a tibeb border. They can hear it, pick another spelling, and share the card.
// The name is sent to Google to spell and say it, but never stored; the server only counts names.
export default function GeezNameCard() {
  const [typedName, setTypedName] = useState("");
  const [shownName, setShownName] = useState("");
  const [words, setWords] = useState<WordChoice[]>([]);
  const [picked, setPicked] = useState<GeezLetter | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Google has one voice; every other tap plays it slowed down, like Translate's turtle button.
  const [playCount, setPlayCount] = useState(0);
  const [exampleIndex, setExampleIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Cycle the examples until the visitor has written their own name.
  useEffect(() => {
    if (words.length > 0) return;
    const timer = window.setInterval(() => setExampleIndex((index) => (index + 1) % examples.length), EXAMPLE_MS);
    return () => window.clearInterval(timer);
  }, [words.length]);

  useEffect(() => () => audioRef.current?.pause(), []);

  async function write(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = typedName.trim().replace(/[^A-Za-z' -]/g, "");
    if (!name) {
      showToast("Type a name in English letters");
      return;
    }

    setIsWriting(true);
    const result = await spellName(name);
    setIsWriting(false);
    if (result.length === 0) {
      showToast("Type a name in English letters");
      return;
    }
    setWords(result);
    setShownName(name);
    setPicked(null);
    setPlayCount(0);

    fetch("/api/geez-names", { method: "POST" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { count: number } | null) => data && setCount(data.count))
      .catch(() => {});
  }

  function pickSpelling(wordIndex: number, optionIndex: number) {
    setWords((current) =>
      current.map((word, index) => (index === wordIndex ? { ...word, picked: optionIndex } : word)),
    );
    setPicked(null);
    setPlayCount(0);
  }

  async function say() {
    audioRef.current?.pause();
    const slow = playCount % 2 === 1 ? "&slow=1" : "";
    setPlayCount((count) => count + 1);
    const audio = new Audio(`/api/geez-names/say?text=${encodeURIComponent(join(words))}${slow}`);
    audioRef.current = audio;
    setIsSpeaking(true);
    audio.onended = () => setIsSpeaking(false);
    try {
      await audio.play();
    } catch {
      setIsSpeaking(false);
      showToast("The voice isn't available right now");
    }
  }

  async function share() {
    setIsSharing(true);
    try {
      const picture = await drawNameCard(join(words), shownName);
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

  const example = examples[exampleIndex];
  const hasName = words.length > 0;
  let letterIndex = 0;

  return (
    <div className={styles.panel} style={bandStyle}>
      <p className={styles.kicker}>Try it</p>
      <h2 id="your-name-title" className={styles.headline}>
        What&apos;s your name in Ge&apos;ez?
      </h2>

      {hasName ? (
        // key: the letters write themselves in again for each new name or spelling.
        <div key={join(words)} className={styles.result}>
          <p className={styles.geez} lang="am" aria-label={`${shownName} in Ge'ez: ${join(words)}`}>
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className={styles.word}>
                {lettersOf(word.options[word.picked]).map((letter, index) => {
                  const order = letterIndex++;
                  const isPicked = picked?.glyph === letter.glyph && picked.sound === letter.sound;
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`${styles.letter} ${isPicked ? styles.pickedLetter : ""}`}
                      style={{ "--i": order } as CSSProperties}
                      onClick={() => setPicked(isPicked ? null : letter)}
                      aria-label={`${letter.glyph}, said ${letter.sound}`}
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
            {picked ? (
              <>
                <span lang="am">{picked.glyph}</span> is said “{picked.sound}”
              </>
            ) : (
              "Tap a letter to see how it's said"
            )}
          </p>
        </div>
      ) : (
        <div className={styles.result} aria-hidden="true">
          <p key={example.geez} className={`${styles.geez} ${styles.example}`} lang="am">
            {/* One word, so the letters sit together like the visitor's own name. */}
            <span className={styles.word}>
              {[...example.geez].map((glyph, index) => (
                <span key={index} className={styles.letter} style={{ "--i": index } as CSSProperties}>
                  {glyph}
                </span>
              ))}
            </span>
          </p>
          <p className={styles.typed}>{example.typed}</p>
        </div>
      )}

      <form className={styles.form} onSubmit={write}>
        <input
          value={typedName}
          onChange={(event) => setTypedName(event.target.value)}
          placeholder="Type your name"
          maxLength={NAME_MAX}
          autoComplete="given-name"
          autoCapitalize="words"
          enterKeyHint="go"
          aria-label="Your name"
        />
        <button type="submit" disabled={isWriting}>
          {isWriting ? "…" : "Write it"}
        </button>
      </form>

      {hasName && (
        <>
          <div className={styles.actions}>
            <button type="button" onClick={say} disabled={isSpeaking}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9.5h4l5-4v13l-5-4H4z" />
                <path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11" />
              </svg>
              {isSpeaking ? "Playing…" : playCount % 2 === 1 ? "Hear it slower" : "Hear it"}
            </button>
            <button type="button" onClick={share} disabled={isSharing}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v8h14v-8" />
              </svg>
              {isSharing ? "Making it…" : "Share card"}
            </button>
          </div>

          {words.some((word) => word.options.length > 1) && (
            <div className={styles.spellings}>
              <p>Not quite right? Pick another spelling:</p>
              {words.map((word, wordIndex) =>
                word.options.length > 1 ? (
                  <div key={wordIndex} className={styles.options} role="group" aria-label={`Spellings for word ${wordIndex + 1}`}>
                    {word.options.map((option, optionIndex) => (
                      <button
                        key={option}
                        type="button"
                        lang="am"
                        aria-pressed={optionIndex === word.picked}
                        onClick={() => pickSpelling(wordIndex, optionIndex)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null,
              )}
            </div>
          )}
        </>
      )}

      <p className={styles.footnote}>
        {count !== null && count > 0 && (
          <>
            {count.toLocaleString("en-US")} {count === 1 ? "name" : "names"} written so far ·{" "}
          </>
        )}
        Spelling and voice by Google
      </p>
    </div>
  );
}
