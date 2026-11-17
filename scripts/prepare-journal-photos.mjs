// Prepares the Elsewhere journal photos for the site.
//
//   node scripts/prepare-journal-photos.mjs ~/Downloads/elsewherep2
//
// For every photo listed below it: turns the picture upright, shrinks it to at most 2400 px
// on its long side, saves it as a JPEG in public/projects/elsewhere, and drops all metadata
// (camera, date and GPS location never reach the site). It prints each photo's final size,
// which journal-data.ts needs so nothing is cropped on the page.
//
// iPhone (.HEIC) and Fujifilm raw (.RAF) files are first converted with macOS's `sips`.

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const LONG_SIDE_PX = 2400;
const OUTPUT_FOLDER = fileURLToPath(new URL("../public/projects/elsewhere/", import.meta.url));

// source file -> name on the site. Optional extras:
//   crop:    { left, top, width, height } in source pixels, applied before resizing.
//   enhance: a gentle contrast and colour lift. Only for scenery; never for photos of people.
const photos = [
  { source: "IMG_2643.HEIC", name: "2024-05-seattle-space-needle-dusk" },
  { source: "IMG_3312.HEIC", name: "2024-06-seattle-post-alley" },
  { source: "IMG_5102.HEIC", name: "2024-07-seattle-space-needle-night" },
  // A phone screenshot: the crop keeps only the photo and leaves out the location tag in its sky.
  { source: "IMG_5128.PNG", name: "2024-07-diablo-lake", crop: { left: 0, top: 400, width: 1170, height: 1785 } },
  { source: "DSCF0096.JPG", name: "2025-05-tokyo-train" },
  { source: "DSCF0121.JPG", name: "2025-05-tokyo-flea-market" },
  { source: "DSCF0137.JPG", name: "2025-05-shinjuku-street" },
  { source: "DSCF0140.JPG", name: "2025-05-shinjuku-cocoon-tower" },
  { source: "DSCF0181.JPG", name: "2025-05-japan-rickshaw" },
  { source: "DSCF0328.JPG", name: "2025-05-daikoku-parking" },
  { source: "DSCF0342.JPG", name: "2025-05-daikoku-supra" },
  { source: "DSCF0620.JPG", name: "2025-05-kyoto-morning-road", enhance: true },
  { source: "DSCF0842.JPG", name: "2025-05-fushimi-inari" },
  { source: "IMG_1234.JPG", name: "2025-05-kyoto-overlook" },
  { source: "DSCF1165.JPG", name: "2025-05-kyoto-night-skyline" },
  { source: "IMG_4689.JPEG", name: "2025-05-nara-deer" },
  { source: "DSCF1548.JPG", name: "2025-05-osaka-night" },
  { source: "DSCF1854.JPG", name: "2025-05-kawaguchiko-path" },
  { source: "DSCF1872.JPG", name: "2025-05-mount-fuji", enhance: true },
  { source: "DSCF2054.JPG", name: "2025-05-fuji-lawson" },
  { source: "DSCF2654.JPG", name: "2025-07-washington-monument" },
  { source: "DSCF2829.JPG", name: "2025-11-chicago-night" },
  { source: "20251128_135211.JPG", name: "2025-11-chicago-skyline" },
  { source: "DSCF3160 2.jpg", name: "2025-11-chicago-bean" },
  { source: "20251129_162516.JPG", name: "2025-11-art-institute" },
  { source: "DSCF3372 2.JPG", name: "2025-12-basye-cabin" },
  { source: "DSCF3927.JPG", name: "2026-03-cueva-ventana-view" },
  { source: "IMG_5672.HEIC", name: "2026-03-cueva-ventana-friends" },
  { source: "IMG_8202.JPG", name: "2026-03-puerto-rico-boats" },
  { source: "IMG_8204.JPG", name: "2026-03-puerto-rico-court" },
  { source: "DSCF4793.JPG", name: "2026-10-new-york-taxi" },
  { source: "DSCF5014.RAF", name: "2026-10-new-york-noho" },
  { source: "DSCF5017.JPG", name: "2026-10-new-york-sidewalk" },
  { source: "DSCF5457.JPG", name: "2026-10-citi-field" },
  { source: "DSCF5466.JPG", name: "2026-10-times-square" },
];

const sourceFolder = process.argv[2];
if (!sourceFolder) {
  console.error("Usage: node scripts/prepare-journal-photos.mjs <folder with the original photos>");
  process.exit(1);
}

const scratchFolder = mkdtempSync(path.join(tmpdir(), "journal-photos-"));

// sharp cannot read HEIC or RAF, so those go through sips into a full-size JPEG first.
function readableCopy(sourcePath) {
  const extension = path.extname(sourcePath).toLowerCase();
  if (extension !== ".heic" && extension !== ".raf") return sourcePath;

  const converted = path.join(scratchFolder, `${path.basename(sourcePath, path.extname(sourcePath))}.jpg`);
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "100", sourcePath, "--out", converted], {
    stdio: "ignore",
  });
  return converted;
}

try {
  for (const photo of photos) {
    let image = sharp(readableCopy(path.join(sourceFolder, photo.source))).rotate();
    if (photo.crop) image = image.extract(photo.crop);
    if (photo.enhance) image = image.linear(1.07, -8).modulate({ saturation: 1.08 });

    const { width, height } = await image
      .resize({ width: LONG_SIDE_PX, height: LONG_SIDE_PX, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(OUTPUT_FOLDER, `${photo.name}.jpg`));

    console.log(`${photo.name}.jpg  ${width} x ${height}`);
  }
} finally {
  rmSync(scratchFolder, { recursive: true, force: true });
}
