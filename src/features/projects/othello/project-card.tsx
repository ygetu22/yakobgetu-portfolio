import ProjectCardLink from "@/components/ui/project-card-link";
import ActionLinkLabel from "@/components/ui/action-link-label";
import ProjectPreviewMotion from "@/components/motion/project-preview-motion";
import ProjectCardMeta from "@/components/ui/project-card-meta";
import styles from "./project-card.module.css";

const startingPieces = new Map<number, "black" | "white">([
  [27, "white"], [28, "black"], [35, "black"], [36, "white"],
]);

export default function OthelloProject() {
  return (
    <article className="group relative h-full min-w-0 overflow-hidden rounded-2xl border border-foreground/10 bg-background/80 transition-colors hover:border-foreground/25">
      <div className="flex h-full flex-col">
        <div className={styles.preview} aria-hidden="true">
          <span className={styles.previewLabel}>BLACK / WHITE</span>
          <ProjectPreviewMotion variant="breathe" phase={-2} className={styles.boardMotion}>
            <div className={styles.boardFrame}>
              <div className={styles.board}>
                {Array.from({ length: 64 }, (_, index) => {
                  const color = startingPieces.get(index);
                  const move = index === 19 ? "black" : index === 18 ? "white" : undefined;
                  const piece = color ?? move;
                  const placementClass = move === "black" ? styles.blackMove : move === "white" ? styles.whiteMove : "";
                  return (
                    <span key={index} className={styles.square}>
                      {index === 27 ? (
                        <span className={`${styles.disc} ${styles.flipping}`}>
                          <span className={`${styles.face} ${styles.white}`} />
                          <span className={`${styles.face} ${styles.black} ${styles.back}`} />
                        </span>
                      ) : piece ? (
                        <span className={`${styles.disc} ${styles.face} ${styles[piece]} ${placementClass}`} />
                      ) : null}
                    </span>
                  );
                })}
              </div>
            </div>
          </ProjectPreviewMotion>
          <span className={styles.previewCaption}>YOUR MOVE.</span>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="display-heading text-2xl">Reversi–Othello</h3>
            <span className="text-[10px] uppercase tracking-wider text-foreground/45">Board game</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-foreground/60">A two-player Othello game built in MATLAB, with move validation, disc flipping, turn tracking, and scoring.</p>
          <ProjectCardMeta year={2024} technologies={["MATLAB", "simpleGameEngine"]} />
          <p className="mt-auto pt-7 text-xs text-foreground/70">
            <ProjectCardLink href="https://github.com/ygetu22/Reversi-Othello" label="View Reversi–Othello code on GitHub (opens in a new tab)" external>
              <ActionLinkLabel>View code on GitHub</ActionLinkLabel>
            </ProjectCardLink>
          </p>
        </div>
      </div>
    </article>
  );
}
