import type { ReactNode } from "react";
import DecodeText from "@/components/motion/decode-text";
import Reveal from "@/components/motion/reveal";
import WeightLetters from "@/components/motion/weight-letters";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  // id for the <h2>, so the section can be labelled by it.
  titleId: string;
  // Optional link or button shown at the right end of the heading.
  action?: ReactNode;
};

// The small label and large title at the top of each section.
export default function SectionHeading({ eyebrow, title, titleId, action }: SectionHeadingProps) {
  return (
    <Reveal>
      <header className={`section-head ${action ? "with-action" : ""}`}>
        <div>
          <p className="eyebrow">
            <DecodeText text={eyebrow} />
          </p>
          <h2 id={titleId} className="display-heading">
            <WeightLetters text={title} restingWeight={500} />
          </h2>
        </div>
        {action}
      </header>
    </Reveal>
  );
}
