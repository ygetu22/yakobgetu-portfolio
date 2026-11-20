import { readFileSync } from "node:fs";

// Reads the pixel size of a JPEG from its header, so the tests need no image library.
export function jpegSize(filePath) {
  const bytes = readFileSync(filePath);
  let offset = 2;

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) throw new Error(`${filePath} is not a valid JPEG`);
    const marker = bytes[offset + 1];
    const segmentLength = bytes.readUInt16BE(offset + 2);

    // The "start of frame" segments (C0–CF, except C4, C8 and CC) hold the size.
    const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isStartOfFrame) {
      return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
    }
    offset += 2 + segmentLength;
  }

  throw new Error(`No size found in ${filePath}`);
}
