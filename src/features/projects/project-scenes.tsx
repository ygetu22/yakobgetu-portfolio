import Image from "next/image";
import type { CSSProperties } from "react";
import { lifePhotos } from "@/features/home/life-photos";
import styles from "./project-scenes.module.css";

// Small looping animations, one per project, shown at the top of each project card on phones.
// Each is drawn with HTML and CSS rather than a GIF or video: sharp at any size, a few hundred
// bytes, and still with reduced motion (see project-scenes.module.css).

const indexStyle = (index: number) => ({ "--i": index }) as CSSProperties;

// Which of the 16 steps play in each row of the drum pattern.
const drumRows = [
  { name: "KICK", steps: [0, 4, 8, 11, 12] },
  { name: "CLAP", steps: [4, 12] },
  { name: "HAT", steps: [2, 6, 10, 14, 15] },
];

function FruitfulScene() {
  return (
    <div className={`${styles.scene} ${styles.fruitful}`}>
      <div className={styles.machine}>
        <p className={styles.machineTitle}>
          fruitful<span>.</span>
          <small>▶ 124 BPM</small>
        </p>
        {drumRows.map((row) => (
          <div key={row.name} className={styles.drumRow}>
            <span>{row.name}</span>
            {Array.from({ length: 16 }, (_, step) => (
              <i key={step} className={row.steps.includes(step) ? styles.on : undefined} style={indexStyle(step)} />
            ))}
          </div>
        ))}
        <span className={styles.playhead} />
      </div>
    </div>
  );
}

const traceLines = [
  { text: "$ trace compare live preview", tone: "" },
  { text: "✓ /        loads", tone: styles.pass },
  { text: "✓ /about   loads", tone: styles.pass },
  { text: "✓ /resume  loads", tone: styles.pass },
  { text: "✗ /contact send button gone", tone: styles.fail },
];

function TraceScene() {
  return (
    <div className={`${styles.scene} ${styles.trace}`}>
      <div className={styles.terminal}>
        <p className={styles.dots}>
          <i />
          <i />
          <i />
        </p>
        <div className={styles.lines} style={{ "--lines": traceLines.length } as CSSProperties}>
          {traceLines.map((line) => (
            <p key={line.text} className={line.tone}>
              {line.text}
            </p>
          ))}
        </div>
        <span className={styles.cursor} />
      </div>
    </div>
  );
}

function ZempledScene() {
  return (
    <div className={`${styles.scene} ${styles.zempled}`}>
      {[
        { cover: "/projects/zempled/artwork/3313948541.jpg", label: "ORIGINAL" },
        { cover: "/projects/zempled/artwork/916387672.jpg", label: "SAMPLE" },
      ].map((record, index) => (
        <figure key={record.label} className={styles.record} style={indexStyle(index)}>
          <Image src={record.cover} alt="" width={160} height={160} sizes="120px" />
          <figcaption>
            <span className={styles.bars}>
              <i />
              <i />
              <i />
              <i />
            </span>
            {record.label}
          </figcaption>
        </figure>
      ))}
      <span className={styles.sampleArrow}>→</span>
    </div>
  );
}

const journalPhotoIds = ["fushimi-inari", "diablo-lake", "mount-fuji"];
const journalPhotos = lifePhotos.filter((photo) => journalPhotoIds.includes(photo.id)).map((photo) => photo.image);

function ElsewhereScene() {
  return (
    <div className={`${styles.scene} ${styles.elsewhere}`}>
      {journalPhotos.map((photo, index) => (
        <Image key={photo} className={styles.slide} style={indexStyle(index)} src={photo} alt="" fill sizes="340px" />
      ))}
      <span className={styles.soon}>Coming soon</span>
    </div>
  );
}

function GradientScene() {
  return (
    <div className={`${styles.scene} ${styles.gradient}`}>
      <div className={styles.paper}>
        <p className={styles.paperTitle}>
          gradient<span>.</span>
        </p>
        {[0, 1, 2, 3].map((index) => (
          <i key={index} className={styles.writtenLine} style={indexStyle(index)} />
        ))}
        <span className={styles.check}>✓</span>
      </div>
    </div>
  );
}

// A 6×6 corner of the board: which squares hold a disc, and which ones flip.
const boardDiscs = [
  { square: 14, color: "black" },
  { square: 15, color: "white", flips: true },
  { square: 20, color: "white", flips: true },
  { square: 21, color: "black" },
  { square: 16, color: "black", drops: true },
];

function OthelloScene() {
  return (
    <div className={`${styles.scene} ${styles.othello}`}>
      <div className={styles.board}>
        {Array.from({ length: 36 }, (_, square) => {
          const disc = boardDiscs.find((item) => item.square === square);
          return (
            <span key={square}>
              {disc && (
                <i
                  className={`${styles.disc} ${styles[disc.color]} ${disc.flips ? styles.flips : ""} ${disc.drops ? styles.drops : ""}`}
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

const scenes: Record<string, () => React.JSX.Element> = {
  fruitful: FruitfulScene,
  trace: TraceScene,
  zempled: ZempledScene,
  elsewhere: ElsewhereScene,
  gradient: GradientScene,
  othello: OthelloScene,
};

export default function ProjectScene({ projectId }: { projectId: string }) {
  const Scene = scenes[projectId];
  return Scene ? <Scene /> : <div className={styles.scene} />;
}
