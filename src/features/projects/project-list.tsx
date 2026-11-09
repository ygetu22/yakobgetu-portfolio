import ScrollReveal from "@/components/motion/scroll-reveal";
import ElsewhereProject from "./elsewhere/project-card";
import FruitfulProject from "./fruitful/project-card";
import GradientProject from "./gradient/project-card";
import OthelloProject from "./othello/project-card";
import TraceProject from "./trace/project-card";
import ZempledProject from "./zempled/project-card";

// Display order for Home and the Projects page. Fruitful is featured first on purpose.
export const projectCards = [
  { id: "fruitful", Card: FruitfulProject },
  { id: "trace", Card: TraceProject },
  { id: "zempled", Card: ZempledProject },
  { id: "elsewhere", Card: ElsewhereProject },
  { id: "gradient", Card: GradientProject },
  { id: "othello", Card: OthelloProject },
];

export function ProjectGrid({ cards }: { cards: typeof projectCards }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 min-[60rem]:grid-cols-3">
      {cards.map(({ id, Card }) => (
        <ScrollReveal key={id} variant="settle" className="h-full min-w-0">
          <Card />
        </ScrollReveal>
      ))}
    </div>
  );
}
