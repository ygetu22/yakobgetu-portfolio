import ProjectCardLink from "@/components/ui/project-card-link";
import ActionLinkLabel from "@/components/ui/action-link-label";
import ProjectCardMeta from "@/components/ui/project-card-meta";
import ProjectPreviewMotion from "@/components/motion/project-preview-motion";
import styles from "./project-card.module.css";

const tracks = [
  { name: "KICK", steps: [0, 4, 8, 12] },
  { name: "CLAP", steps: [4, 12] },
  { name: "HAT", steps: [2, 6, 10, 14] },
];

export default function FruitfulProject() {
  return (
    <article className="group relative h-full min-w-0 overflow-hidden rounded-2xl border border-foreground/10 bg-background/80 transition-colors hover:border-foreground/25">
      <div className="flex h-full flex-col">
        <div className={styles.preview} aria-hidden="true">
          <span className={styles.caption}>IDEA → GROOVE</span>
          <ProjectPreviewMotion variant="breathe" phase={-1.5} className={styles.motion}>
            <div className={styles.sequencer}>
              <div className={styles.header}>
                <span className={styles.name}>fruitful<span>.</span></span>
                <span className={styles.tempo}>▶ 124 BPM</span>
              </div>
              <div className={styles.pattern}>
                {tracks.map((track) => (
                  <div key={track.name} className={styles.row}>
                    <span className={styles.track}>{track.name}</span>
                    <div className={styles.steps}>
                      {Array.from({ length: 16 }, (_, step) => (
                        <span
                          key={step}
                          className={`${styles.step} ${track.steps.includes(step) ? styles.active : ""}`}
                          style={{ animationDelay: `${step * 0.12}s` }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <span className={styles.playhead} />
              </div>
              <div className={styles.footer}><span>MCP → MIDI → FL STUDIO</span><span className={styles.signal} /></div>
            </div>
          </ProjectPreviewMotion>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="display-heading text-2xl">Fruitful</h3>
            <span className="text-[10px] uppercase tracking-wider text-foreground/45">Music tooling</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-foreground/60">An MCP co-producer for FL Studio. Turn ideas into beats and control channels, plugins, and the mixer. In active development.</p>
          <ProjectCardMeta
            year={2026}
            technologies={["Python", "FastMCP", "FL Studio API", "Freesound API", "MIDI / SysEx", "Mido / RtMidi", "SQLite"]}
          />
          <p className="mt-auto pt-7 text-xs text-foreground/70">
            <ProjectCardLink href="https://github.com/ygetu22/fruitful" label="View Fruitful on GitHub (opens in a new tab)" external>
              <ActionLinkLabel>View on GitHub</ActionLinkLabel>
            </ProjectCardLink>
          </p>
        </div>
      </div>
    </article>
  );
}
