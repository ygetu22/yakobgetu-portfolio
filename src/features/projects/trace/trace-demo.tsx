"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/components/motion/scroll-frame";
import { recordedOn, recordedRuns } from "./recorded-runs";
import styles from "./trace.module.css";

const TYPING_MS = 26;
const LINE_MS = 70;
const BLANK_LINE_MS = 160;

// Colours a line of recorded output the way the real terminal does.
function lineClass(line: string): string {
  const firstCharacter = line.trim()[0];
  if (firstCharacter === "✓") return styles.good;
  if (firstCharacter === "?") return styles.question;
  if (line && !line.startsWith(" ")) return styles.heading;
  return "";
}

// Replays real Trace output as if it were running now: the command is typed, then the lines arrive.
// Screen readers get the finished output at once instead of a stream of partial lines.
export default function TraceDemo() {
  const [runIndex, setRunIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [shownLines, setShownLines] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLPreElement>(null);

  const run = recordedRuns[runIndex];
  const otherRun = recordedRuns[(runIndex + 1) % recordedRuns.length];
  const otherCommand = otherRun.command.split(" ").slice(0, 2).join(" ");

  // Start the first time the terminal scrolls into view.
  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasStarted(true);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(terminal);
    return () => observer.disconnect();
  }, []);

  // One step of the replay per timer: a character of the command, then a line of output.
  useEffect(() => {
    if (!hasStarted) return;

    const isTyping = typedLength < run.command.length;
    const isPrinting = shownLines < run.output.length;
    if (!isTyping && !isPrinting) return;

    if (prefersReducedMotion()) {
      const timer = window.setTimeout(() => {
        setTypedLength(run.command.length);
        setShownLines(run.output.length);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    let delay = TYPING_MS;
    if (!isTyping) {
      const isFirstLine = shownLines === 0;
      const previousLine = run.output[shownLines - 1];
      delay = isFirstLine ? 500 : previousLine ? LINE_MS : BLANK_LINE_MS;
    }

    const timer = window.setTimeout(() => {
      if (isTyping) setTypedLength(typedLength + 1);
      else setShownLines(shownLines + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [hasStarted, run, typedLength, shownLines]);

  // Keep the newest line in view.
  useEffect(() => {
    const screen = screenRef.current;
    if (screen) screen.scrollTop = screen.scrollHeight;
  }, [shownLines]);

  function showOtherRun() {
    setRunIndex((runIndex + 1) % recordedRuns.length);
    setTypedLength(0);
    setShownLines(0);
    setHasStarted(true);
  }

  const isFinished = typedLength >= run.command.length && shownLines >= run.output.length;

  return (
    <>
      <div ref={terminalRef} className={styles.terminal}>
        <div className={styles.bar} aria-hidden="true">
          <i />
          <i />
          <i />
          <span>yakob — webtrace</span>
        </div>

        <pre ref={screenRef} className={styles.screen} aria-hidden="true">
          <div className={styles.command}>$ {run.command.slice(0, typedLength)}</div>
          {run.output.slice(0, shownLines).map((line, index) => (
            <div key={index} className={`${styles.line} ${lineClass(line)}`}>
              {line}
            </div>
          ))}
          {!isFinished && <span className={styles.caret} />}
        </pre>

        <div className="sr-only">
          <p>Recorded output of the command {run.command}:</p>
          <pre>{run.output.join("\n")}</pre>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className="pill pill-link" onClick={showOtherRun}>
          Run “{otherCommand}” instead
        </button>
        <span className="muted">Real output, recorded {recordedOn}.</span>
      </div>
    </>
  );
}
