// Every project on the site, in display order. Home features the first few;
// the Projects page lists them all. Each project also has a page at `href`.

export type Project = {
  id: string;
  name: string;
  kind: string;
  year: string | null;
  summary: string;
  status?: string;
  // Short "what it does" list for projects whose page has no live demo.
  highlights?: string[];
  stack: string[];
  repositoryUrl?: string;
  href: string;
};

export const projects: Project[] = [
  {
    id: "fruitful",
    name: "Fruitful",
    kind: "Music tooling",
    year: "2026",
    summary: "An MCP co-producer for FL Studio. Turn ideas into beats and control channels, plugins, and the mixer.",
    status: "macOS beta, in active development.",
    highlights: [
      "Reads and writes drum steps.",
      "Changes channel volume, pan, names, and mixer routing.",
      "Inspects and adjusts plugin parameters.",
      "Reads project state and controls tempo, play, stop, and record.",
      "Programs the beat you describe on your own drum sounds, then checks what it wrote.",
    ],
    stack: ["Python", "FastMCP", "MCP", "FL Studio API", "Freesound API", "MIDI / SysEx", "Mido / RtMidi", "SQLite"],
    repositoryUrl: "https://github.com/ygetu22/fruitful",
    href: "/projects/fruitful",
  },
  {
    id: "trace",
    name: "Trace",
    kind: "Terminal tool",
    year: "2026",
    summary: "Opens a site in a real browser, uses it like a visitor, and tells you what stopped working between your live site and a new version.",
    stack: ["TypeScript", "Node.js", "Playwright"],
    repositoryUrl: "https://github.com/ygetu22/trace",
    href: "/projects/trace",
  },
  {
    id: "zempled",
    name: "Zempled",
    kind: "Music discovery",
    year: "2026",
    summary: "Ethiopian originals and the songs that sampled them. Listen side by side.",
    stack: ["Deezer API", "HTML5 Audio", "Next.js"],
    href: "/projects/zempled",
  },
  {
    id: "elsewhere",
    name: "Elsewhere",
    kind: "Photo journal",
    year: "2026",
    summary: "A photo journal of the places I've been.",
    stack: ["Next.js", "React", "TypeScript"],
    href: "/projects/elsewhere",
  },
  {
    id: "gradient",
    name: "Gradient",
    kind: "Team project",
    year: null,
    summary: "A collaborative AI grading project with a React interface and an Express backend.",
    highlights: [
      "A team project, built with maalin2.",
      "React and Vite on the front end, Node.js and Express on the back end.",
      "Uses the Gemini API, with MongoDB for storage.",
      "Takes uploaded PDF files through Multer and pdf-parse.",
    ],
    stack: ["Gemini API", "MongoDB", "React", "Node.js", "Express", "pdf-parse", "Multer", "Vite"],
    repositoryUrl: "https://github.com/ygetu22/gradient-grading-tool",
    href: "/projects/gradient",
  },
  {
    id: "othello",
    name: "Othello",
    kind: "Game",
    year: null,
    summary: "A two-player Othello game built in MATLAB, with move validation, disc flipping, turn tracking, and scoring.",
    highlights: [
      "Two players take turns on one board.",
      "Checks that each move is legal before placing it.",
      "Flips the captured discs, tracks whose turn it is, and keeps score.",
      "Written in MATLAB with simpleGameEngine.",
    ],
    stack: ["MATLAB", "simpleGameEngine"],
    repositoryUrl: "https://github.com/ygetu22/Reversi-Othello",
    href: "/projects/othello",
  },
];

// Home shows this many projects in full; the rest sit behind "All projects".
export const FEATURED_PROJECT_COUNT = 4;
