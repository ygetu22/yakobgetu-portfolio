import ScrollReveal from "@/components/motion/scroll-reveal";

const paragraphs = [
  "I'm a Computer Science and Engineering student at Ohio State, graduating in May 2027. I've spent the last three summers as a software engineering intern, two at JPMorgan Chase and one at Amazon, and I'm now looking for a spring 2027 co-op and new-grad roles.",
  "Most of what's on this site started as something I wanted for myself: a way to hear the Ethiopian records behind songs I love, a tool that tests websites the way a visitor would, and a co-producer for FL Studio.",
  "Away from the keyboard, I'm usually on a soccer field or tennis court, out for a run, or outside somewhere with friends, and music is always playing. I travel whenever I can and bring a camera along.",
];

export default function AboutSection() {
  return (
    <div className="max-w-2xl space-y-5 text-sm leading-7 text-foreground/70">
      {paragraphs.map((paragraph, index) => (
        <ScrollReveal key={paragraph} variant="settle" delay={index * 90}>
          <p>{paragraph}</p>
        </ScrollReveal>
      ))}
    </div>
  );
}
