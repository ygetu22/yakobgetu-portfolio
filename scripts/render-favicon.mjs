import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const iconDirectory = new URL("../src/app/", import.meta.url);
const svg = await readFile(new URL("icon.svg", iconDirectory));
const sizes = [16, 32, 48, 64];
const images = await Promise.all(sizes.map((size) => sharp(svg, { density: 192 }).resize(size, size).png().toBuffer()));

// ICO directory entries point to PNG images, retaining transparency at each size.
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  header.writeUInt8(sizes[index], entry);
  header.writeUInt8(sizes[index], entry + 1);
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});

await writeFile(new URL("favicon.ico", iconDirectory), Buffer.concat([header, ...images]));
await sharp(svg, { density: 288 }).resize(180, 180).png().toFile(fileURLToPath(new URL("apple-icon.png", iconDirectory)));
console.log("Rendered viewfinder favicon (16/32/48/64px) and Apple icon (180px).");
