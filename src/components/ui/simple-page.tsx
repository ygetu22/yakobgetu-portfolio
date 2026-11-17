import { SiteLink } from "@/components/layout/page-curtain";
import WeightLetters from "@/components/motion/weight-letters";

type SimplePageProps = {
  title: string;
  text: string;
};

// A page that only has a title and a line of text for now (Posts, Hobbies).
export default function SimplePage({ title, text }: SimplePageProps) {
  return (
    <section className="section page-top" aria-labelledby="simple-page-title">
      <SiteLink href="/" curtainTitle="Home" className="back-link">
        <span aria-hidden="true">←</span> Back to Home
      </SiteLink>
      <h1 id="simple-page-title" className="display-heading page-title">
        <WeightLetters text={title} restingWeight={300} decodeOnMount />
      </h1>
      <p style={{ marginTop: 28, color: "var(--text)" }}>{text}</p>
    </section>
  );
}
