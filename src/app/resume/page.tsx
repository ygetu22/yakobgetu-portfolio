import type { Metadata } from "next";
import { SiteLink } from "@/components/layout/page-curtain";
import WeightLetters from "@/components/motion/weight-letters";
import ResumeBlocks, { DownloadResumeLink } from "@/features/resume/resume-blocks";

export const metadata: Metadata = {
  title: "Resume · Yakob Getu",
  description: "Education, experience, skills and leadership of Yakob Getu, software engineer.",
};

// The same resume that is on Home, on a page of its own for direct links.
export default function ResumePage() {
  return (
    <section className="section page-top" aria-labelledby="resume-page-title">
      <SiteLink href="/#resume" curtainTitle="Home" className="back-link">
        <span aria-hidden="true">←</span> Back to Home
      </SiteLink>
      <h1 id="resume-page-title" className="display-heading page-title">
        <WeightLetters text="Resume" restingWeight={300} decodeOnMount />
      </h1>
      <p style={{ margin: "28px 0 48px" }}>
        <DownloadResumeLink />
      </p>
      <ResumeBlocks />
    </section>
  );
}
