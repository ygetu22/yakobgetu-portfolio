"use client";

import { useTheme } from "next-themes";
import { useEffect, useEffectEvent, useImperativeHandle, useRef, useState, type Ref } from "react";
import { toggleGlyphs } from "@/components/culture/glyph-visibility";
import { showToast } from "@/components/ui/toast";
import { copyEmail } from "@/features/contact/copy-email";
import { useMusicPlayer } from "@/features/music/music-player";
import { journalPhotos } from "@/features/projects/elsewhere/journal-data";
import { projects } from "@/features/projects/projects";
import { experience, leadership, skillGroups } from "@/features/resume/resume-data";
import { buildSkillUsage, skillElementId } from "@/features/resume/skill-usage";
import { goToHash } from "./location-hash";
import { useCurtainNavigate } from "./page-curtain";
import { findItems, splitAtMatch, type Searchable } from "./search";
import styles from "./search-palette.module.css";

type SearchItem = Searchable & { run: () => void };

// What is listed before the visitor types anything.
const STARTER_TYPES = ["Section", "Page", "Action"];

const homeSections = [
  ["Home", ""],
  ["About", "about"],
  ["Resume", "resume"],
  ["Education", "education"],
  ["Experience", "experience"],
  ["Skills", "skills"],
  ["Leadership", "leadership"],
  ["Projects", "projects"],
  ["Life", "life"],
  ["Posts", "posts"],
  ["Contact", "contact"],
];

const skillUsage = buildSkillUsage([
  ...experience.map((job) => ({ label: job.shortName ?? job.name, stack: job.stack })),
  ...projects.map((project) => ({ label: project.name, stack: project.stack })),
]);

export type SearchPaletteHandle = { open: () => void };

// The search box (⌘K, Ctrl+K or "/"): jumps to any section, project, photo, job or skill,
// and runs a few actions such as switching the theme.
export default function SearchPalette({ ref }: { ref: Ref<SearchPaletteHandle> }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useCurtainNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const music = useMusicPlayer();

  // Goes to an address on this site: scrolls if it is on the current page, otherwise changes page.
  function goTo(href: string, title: string) {
    const destination = new URL(href, window.location.href);
    if (destination.pathname !== window.location.pathname) {
      navigate(href, title);
    } else if (destination.hash) {
      goToHash(decodeURIComponent(destination.hash.slice(1)));
    } else {
      window.scrollTo({ top: 0 });
    }
  }

  function openInNewTab(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const items: SearchItem[] = [
    ...homeSections.map(([title, id]) => ({
      title,
      type: "Section",
      run: () => goTo(id ? `/#${id}` : "/", title),
    })),
    {
      title: "All projects",
      type: "Page",
      run: () => goTo("/projects", "Projects"),
    },
    ...projects.map((project) => ({
      title: project.name,
      detail: project.kind,
      type: "Project",
      keywords: `${project.summary} ${project.stack.join(" ")}`,
      run: () => goTo(project.href, project.name),
    })),
    ...journalPhotos.map((photo) => ({
      title: photo.place,
      detail: photo.date,
      type: "Photo",
      keywords: photo.alt,
      run: () => goTo(`/projects/elsewhere#shot-${photo.id}`, photo.place),
    })),
    ...experience.map((job) => ({
      title: job.name,
      detail: job.date,
      type: "Experience",
      keywords: `${job.role} ${job.stack?.join(" ") ?? ""} ${job.location} intern internship`,
      run: () => goTo(`/#entry-${job.id}`, job.name),
    })),
    ...leadership.map((role) => ({
      title: role.name,
      detail: role.role,
      type: "Leadership",
      keywords: role.location,
      run: () => goTo(`/#entry-${role.id}`, role.name),
    })),
    ...skillGroups.flatMap((group) =>
      group.items.map((skill) => ({
        title: skill,
        detail: skillUsage.get(skill)?.join(", ") ?? group.label,
        type: "Skill",
        keywords: group.label,
        run: () => goTo(`/#${skillElementId(skill)}`, "Skills"),
      })),
    ),
    {
      title: "Switch light / dark",
      type: "Action",
      keywords: "theme mode color night",
      run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    },
    {
      title: "Show or hide Ge'ez letters",
      type: "Action",
      keywords: "amharic fidel alphabet background",
      run: () => void toggleGlyphs(),
    },
    {
      title: music.isOn ? "Stop the music" : "Play music",
      type: "Action",
      keywords: "spotify song playlist ethio shuffle sound",
      run: music.toggle,
    },
    {
      title: "Copy email address",
      type: "Action",
      keywords: "contact mail gmail",
      run: () => void copyEmail(),
    },
    {
      title: "GitHub",
      detail: "github.com/ygetu22",
      type: "Link",
      keywords: "code source",
      run: () => openInNewTab("https://github.com/ygetu22"),
    },
    {
      title: "LinkedIn",
      detail: "linkedin.com/in/ygetu",
      type: "Link",
      run: () => openInNewTab("https://linkedin.com/in/ygetu/"),
    },
  ];

  const greeting: SearchItem = {
    title: "ሰላም! እንኳን ደህና መጡ",
    detail: "Hello, and welcome",
    type: "Greeting",
    run: () => showToast("ሰላም"),
  };

  const typed = query.trim().toLowerCase();
  const isGreeting = typed === "selam" || typed === "ሰላም";
  const results = isGreeting ? [greeting] : findItems(items, query, STARTER_TYPES);
  const selected = Math.min(selectedIndex, Math.max(0, results.length - 1));

  function open() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery("");
    setSelectedIndex(0);
    dialog.showModal();
  }

  function run(item: SearchItem) {
    dialogRef.current?.close();
    item.run();
  }

  useImperativeHandle(ref, () => ({ open }));

  const toggleFromShortcut = useEffectEvent(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
    else open();
  });

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const isCommandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const isTyping = event.target instanceof HTMLElement && event.target.closest("input, textarea");
      const isSlash = event.key === "/" && !isTyping;
      if (!isCommandK && !isSlash) return;

      event.preventDefault();
      toggleFromShortcut();
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function handleInputKeys(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = (selected + step + results.length) % results.length;
      setSelectedIndex(next);
      document.getElementById(`search-result-${next}`)?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && results[selected]) {
      event.preventDefault();
      run(results[selected]);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.palette}
      aria-label="Search the site"
      // A click on the dimmed area around the box closes it.
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className={styles.inputRow}>
        <span className={styles.prompt} aria-hidden="true">
          ›
        </span>
        <input
          type="text"
          value={query}
          placeholder="Where to?"
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-label="Search the site"
          aria-expanded="true"
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={results.length > 0 ? `search-result-${selected}` : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleInputKeys}
        />
        <kbd aria-hidden="true">esc</kbd>
      </div>

      <ul id="search-results" className={styles.results} role="listbox" aria-label="Results">
        {results.length === 0 && (
          <li className={styles.empty}>Nothing here by that name. Try “trace” or “resume”.</li>
        )}
        {results.map((item, index) => {
          const title = splitAtMatch(item.title, query);
          return (
            <li
              key={`${item.type}-${item.title}`}
              id={`search-result-${index}`}
              className={styles.item}
              role="option"
              aria-selected={index === selected}
              onPointerMove={() => setSelectedIndex(index)}
              onClick={() => run(item)}
            >
              <span className={styles.title}>
                {title.before}
                {title.match && <b>{title.match}</b>}
                {title.after}
                {item.detail && <span className={styles.detail}>{item.detail}</span>}
              </span>
              <span className={styles.type}>{item.type}</span>
            </li>
          );
        })}
      </ul>

      <p className={`muted ${styles.footer}`} aria-hidden="true">
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> move
        </span>
        <span>
          <kbd>↵</kbd> go
        </span>
        <span>try “playwright”, “fuji” or “ሰላም”</span>
      </p>
    </dialog>
  );
}
