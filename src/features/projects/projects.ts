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
    kind: "Hackathon prototype",
    year: "2024",
    summary: "A grading assistant we started at HackOHI/O 2024: teachers upload an answer key and students' work for AI grading. The upload flow works; the grading itself was never finished.",
    highlights: [
      "Built at HackOHI/O 2024 with maalin2 and ghosh279.",
      "React and Vite on the front end, Node.js and Express on the back end.",
      "Stores uploaded answer keys on the server and records them in MongoDB.",
      "AI grading with Gemini was planned but not built; the app says so plainly.",
    ],
    stack: ["React", "Vite", "Node.js", "Express", "MongoDB", "Multer"],
    repositoryUrl: "https://github.com/ygetu22/gradient",
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
