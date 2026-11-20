import Image from "next/image";
import Learn from "@/components/culture/learn";
import { ShortcutKey } from "@/components/layout/shortcut-label";
import Tilt from "@/components/motion/tilt";
import WeightLetters from "@/components/motion/weight-letters";
import { professionalPortrait } from "./portrait";
import styles from "./hero.module.css";

// The first screen: my name in both scripts, what I do and where, and a portrait.
export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-name">
      <div className={styles.intro}>
        <Learn lesson="name" as="p" className={styles.fidelName}>
          <span lang="am">ያዕቆብ ጌቱ</span>
        </Learn>

        <h1 id="hero-name" className={`display-heading ${styles.name}`}>
          <WeightLetters text="Yakob Getu" restingWeight={300} decodeOnMount />
        </h1>

        <dl className={styles.facts}>
          <div>
            <dt>Study</dt>
            <dd>Computer science</dd>
          </div>
          <div>
            <dt>Based</dt>
            <dd>Columbus, Ohio</dd>
          </div>
          <div>
            <dt>School</dt>
            <dd>Ohio State, class of 2027</dd>
          </div>
        </dl>

        <p className={`muted ${styles.hint}`}>
          Scroll to learn more
          <span className={styles.shortcutHint}>
            , or press <ShortcutKey /> to jump anywhere
          </span>
        </p>
      </div>

      <Tilt className={styles.portrait}>
        <Image
          src={professionalPortrait.image}
          alt={professionalPortrait.alt}
          fill
          sizes="(max-width: 800px) 90vw, 448px"
          quality={90}
          preload
        />
      </Tilt>
    </section>
  );
}
