import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { lifePhotos } from "../src/features/home/life-photos.ts";
import { jpegSize } from "./image-size.mjs";

test("every Life photo exists and has the size the page reserves for it", () => {
  for (const photo of lifePhotos) {
    const file = new URL(`../public${photo.image}`, import.meta.url).pathname;
    assert(existsSync(file), `${photo.image} is missing`);
    assert.deepEqual(jpegSize(file), { width: photo.width, height: photo.height }, photo.image);
  }
});

test("photo ids are unique and every photo is described for screen readers", () => {
  const ids = lifePhotos.map((photo) => photo.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const photo of lifePhotos) {
    assert(photo.alt.length > 20, `${photo.id} needs a real description`);
    assert(photo.place && photo.date, `${photo.id} needs a place and date`);
  }
});
