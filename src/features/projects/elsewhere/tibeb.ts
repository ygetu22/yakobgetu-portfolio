// Tibeb is woven on a thread grid, so its motifs are stepped rather than smooth.
// Each motif below is drawn cell by cell: "." is bare cotton, letters are thread colors.

const threadColors: Record<string, string> = {
  G: "#1f6b45",
  Y: "#d6a21e",
  R: "#b3312a",
};

const steppedDiamond = [
  ".....R.....",
  "....RYR....",
  "...RYGYR...",
  "..RYG.GYR..",
  ".RYG.R.GYR.",
  "RYG.RRR.GYR",
  ".RYG.R.GYR.",
  "..RYG.GYR..",
  "...RYGYR...",
  "....RYR....",
  ".....R.....",
];

const meskelCross = [
  "....YYY....",
  "....Y.Y....",
  "....YYY....",
  ".....G.....",
  "YYY.GGG.YYY",
  "Y.YGGRGGY.Y",
  "YYY.GGG.YYY",
  ".....G.....",
  "....YYY....",
  "....Y.Y....",
  "....YYY....",
];

function bandRows(): string[] {
  const gap = "...";
  const motifs = steppedDiamond.map((row, y) => row + gap + meskelCross[y] + gap);
  const width = motifs[0].length;
  const solid = (thread: string) => thread.repeat(width);
  // Small alternating teeth, like the edge stitches that frame a tibeb band.
  const teeth = (offset: number) =>
    Array.from({ length: width }, (_, x) => ((x + offset) % 4 < 2 ? "R" : ".")).join("");

  return [
    solid("G"), solid("G"), solid("."),
    teeth(0), teeth(2), solid("."),
    ...motifs,
    solid("."), teeth(2), teeth(0),
    solid("."), solid("G"), solid("G"),
  ];
}

function weave(rows: string[], cell: number) {
  let rects = "";
  rows.forEach((row, y) => {
    [...row].forEach((thread, x) => {
      const color = threadColors[thread];
      if (color) rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${color}"/>`;
    });
  });
  const width = rows[0].length * cell;
  const height = rows.length * cell;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" shape-rendering="crispEdges">${rects}</svg>`;
  return { url: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, width, height };
}

export const tibebBand = weave(bandRows(), 2);
