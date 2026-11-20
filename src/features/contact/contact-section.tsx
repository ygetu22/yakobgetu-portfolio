"use client";

import { useEffect, useId, useState } from "react";
import Learn from "@/components/culture/learn";
import DecodeText from "@/components/motion/decode-text";
import Reveal from "@/components/motion/reveal";
import { prefersReducedMotion } from "@/components/motion/scroll-frame";
import ContactForm from "./contact-form";
import { copyEmail, EMAIL_ADDRESS } from "./copy-email";
import styles from "./contact.module.css";

// The heading takes turns saying hello in English, in Amharic, and in Amharic written with Latin letters.
const greetings = [
  { text: "Say hello", lang: undefined },
  { text: "ሰላም", lang: "am" },
  { text: "Selam", lang: undefined },
];
const GREETING_MS = 2600;

function Greeting({ isPageTitle }: { isPageTitle: boolean }) {
  const [current, setCurrent] = useState(0);
  const Heading = isPageTitle ? "h1" : "h2";

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % greetings.length), GREETING_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <Heading id="contact-title" className={`display-heading ${styles.hello}`}>
      <Learn lesson="selam" className={styles.words}>
        {/* Read once as "Say hello"; the rotating words are for the eye. */}
        <span className="sr-only">Say hello</span>
        {greetings.map((greeting, index) => (
          <span
            key={greeting.text}
            lang={greeting.lang}
            className={index === current ? styles.currentWord : undefined}
            aria-hidden="true"
          >
            {greeting.text}
          </span>
        ))}
      </Learn>
    </Heading>
  );
}

// Contact: a form that reaches my inbox, and the usual links.
type ContactSectionProps = {
  // On the /contact page this section is the whole page, so its heading is the page title.
  isPageTitle?: boolean;
};

export default function ContactSection({ isPageTitle = false }: ContactSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formId = useId();

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <Reveal>
        <header className="section-head">
          <p className="eyebrow">
            <DecodeText text="Contact" />
          </p>
          <Greeting isPageTitle={isPageTitle} />
        </header>
      </Reveal>

      <Reveal>
        <button
          type="button"
          className={`pill pill-link ${styles.openForm}`}
          aria-expanded={isFormOpen}
          aria-controls={formId}
          data-cursor="write"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? "Close the form" : "Write me a message"}
        </button>

        {/* `inert` keeps the closed form away from keyboards and screen readers. */}
        <div id={formId} className={`${styles.formWrap} ${isFormOpen ? styles.formOpen : ""}`} inert={!isFormOpen}>
          <div>
            <ContactForm />
          </div>
        </div>

        <ul className={styles.list}>
          <li>
            <button type="button" className={styles.row} data-cursor="copy" onClick={copyEmail}>
              <span className={`muted ${styles.label}`}>Email</span>
              <span className={styles.value}>{EMAIL_ADDRESS}</span>
              <span className={`muted ${styles.hint}`}>click to copy</span>
            </button>
          </li>
          <li>
            <a
              className={styles.row}
              href="https://linkedin.com/in/ygetu/"
              target="_blank"
              rel="noreferrer"
              data-cursor="visit"
            >
              <span className={`muted ${styles.label}`}>LinkedIn</span>
              <span className={styles.value}>linkedin.com/in/ygetu</span>
              <span className={`muted ${styles.hint}`}>
                <span aria-hidden="true">↗</span>
                <span className="sr-only">opens in a new tab</span>
              </span>
            </a>
          </li>
          <li>
            <a
              className={styles.row}
              href="https://github.com/ygetu22"
              target="_blank"
              rel="noreferrer"
              data-cursor="visit"
            >
              <span className={`muted ${styles.label}`}>GitHub</span>
              <span className={styles.value}>github.com/ygetu22</span>
              <span className={`muted ${styles.hint}`}>
                <span aria-hidden="true">↗</span>
                <span className="sr-only">opens in a new tab</span>
              </span>
            </a>
          </li>
        </ul>
      </Reveal>
    </section>
  );
}
