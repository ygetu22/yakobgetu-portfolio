import ActionLinkLabel from "@/components/ui/action-link-label";
import Image from "next/image";
import Link from "next/link";
import PhotoPlaceholder from "@/components/ui/photo-placeholder";
import ElsewhereProject from "@/features/projects/elsewhere/project-card";
import ZempledProject from "@/features/projects/zempled/project-card";
import TraceProject from "@/features/projects/trace/project-card";
import OthelloProject from "@/features/projects/othello/project-card";
import FruitfulProject from "@/features/projects/fruitful/project-card";
import GradientProject from "@/features/projects/gradient/project-card";
import { professionalPortrait } from "@/features/home/portrait";
import ScrollReveal from "@/components/motion/scroll-reveal";

export default function Home() {
  return (
    <>
      <section className="relative mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:px-12">
        <div className="min-w-0 max-w-xl">
          <ScrollReveal variant="title">
            <p className="mb-7 text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">Yakob Getu</p>
          </ScrollReveal>
          <h1 className="hero-name display-heading max-w-md">
            Yakob <span>Getu</span>
          </h1>
          <ScrollReveal variant="from-left" delay={280}>
          <div className="mt-10 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-foreground/15 bg-foreground/[0.045] px-3.5 py-2">software engineer</span>
            <span className="rounded-full border border-foreground/15 bg-foreground/[0.045] px-3.5 py-2">columbus, ohio</span>
          </div>
          </ScrollReveal>
          <ScrollReveal delay={340}>
          <div className="mt-12 flex flex-wrap items-center gap-6 text-sm">
            <p className="text-foreground/45">Scroll to learn more</p>
            <Link href="/projects" className="text-foreground/65 hover:text-foreground"><ActionLinkLabel>Projects</ActionLinkLabel></Link>
          </div>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="portrait" delay={140} className="min-w-0">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-foreground/10 bg-background shadow-2xl shadow-black/10">
            {professionalPortrait.image ? (
              <Image
                src={professionalPortrait.image}
                alt={professionalPortrait.alt}
                fill
                sizes="(max-width: 640px) 144vw, 720px"
                quality={90}
                className="scale-[1.6] object-cover object-[60%_42%]"
                preload
              />
            ) : (
              <PhotoPlaceholder label="Professional portrait to come" />
            )}
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:px-10 lg:px-12 lg:pb-36">
        <section className="mb-24" aria-labelledby="home-posts-title">
          <ScrollReveal variant="wipe">
            <div className="flex items-end justify-between gap-4 border-b border-foreground/10 pb-5">
              <div><p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">Writing</p><h2 id="home-posts-title" className="display-heading mt-3 text-4xl">Posts</h2></div>
              <Link href="/posts" className="text-xs text-foreground/60 hover:text-foreground"><ActionLinkLabel>View posts</ActionLinkLabel></Link>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="settle" delay={100}><p className="mt-6 max-w-xl text-sm leading-6 text-foreground/60">Notes, updates, and writeups will live here.</p></ScrollReveal>
        </section>
        <section className="mt-24" aria-labelledby="home-projects-title">
          <ScrollReveal variant="wipe">
            <div className="mb-8 flex items-center justify-between gap-4 border-b border-foreground/10 pb-5">
              <h2 id="home-projects-title" className="display-heading text-4xl">Projects</h2>
              <Link href="/projects" className="text-xs text-foreground/60 hover:text-foreground"><ActionLinkLabel>View projects</ActionLinkLabel></Link>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-2 min-[60rem]:grid-cols-3">
            <ScrollReveal variant="settle" className="min-w-0 h-full"><FruitfulProject /></ScrollReveal>
            <ScrollReveal variant="settle" className="min-w-0 h-full"><TraceProject /></ScrollReveal>
            <ScrollReveal variant="settle" className="min-w-0 h-full"><ZempledProject /></ScrollReveal>
            <ScrollReveal variant="settle" className="min-w-0 h-full"><ElsewhereProject /></ScrollReveal>
            <ScrollReveal variant="settle" className="min-w-0 h-full"><GradientProject /></ScrollReveal>
            <ScrollReveal variant="settle" className="min-w-0 h-full"><OthelloProject /></ScrollReveal>
          </div>
        </section>
      </section>
    </>
  );
}
