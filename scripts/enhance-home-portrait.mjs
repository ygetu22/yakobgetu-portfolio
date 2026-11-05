import { fileURLToPath } from "node:url";
import sharp from "sharp";

const original = fileURLToPath(new URL("../public/images/portraits/19.jpg", import.meta.url));
const output = fileURLToPath(new URL("../public/images/portraits/professional-portrait-lighting-v2.png", import.meta.url));

const { data, info } = await sharp(original)
  .rotate()
  .removeAlpha()
  .toColourspace("srgb")
  .raw()
  .toBuffer({ resolveWithObject: true });

// Lift midtones gently while preserving black/white endpoints and highlight detail.
// Apply the same curve to every original pixel; there is no retouching or resampling.
for (let index = 0; index < data.length; index++) {
  const value = data[index];
  data[index] = Math.round(value + 18 * Math.sin(Math.PI * value / 255));
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log(`Saved lighting-only portrait: ${output} (${info.width} × ${info.height})`);
