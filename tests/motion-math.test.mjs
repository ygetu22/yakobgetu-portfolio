import assert from "node:assert/strict";
import test from "node:test";
import { clamp, closeness, ease } from "../src/components/motion/motion-math.ts";

test("ease moves a fraction of the way to the target", () => {
  assert.equal(ease(0, 100, 0.25), 25);
  assert.equal(ease(100, 0, 0.5), 50);
  assert.equal(ease(40, 40, 0.1), 40);
});

test("clamp keeps a value inside its range", () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-3, 0, 10), 0);
  assert.equal(clamp(30, 0, 10), 10);
});

test("closeness is 1 on the point, 0 at the radius and beyond, and gentle in between", () => {
  const point = { x: 100, y: 100 };
  assert.equal(closeness(point, 100, 100, 50), 1);
  assert.equal(closeness(point, 150, 100, 50), 0);
  assert.equal(closeness(point, 400, 400, 50), 0);
  // Halfway out, the squared falloff gives a quarter rather than a half.
  assert.equal(closeness(point, 125, 100, 50), 0.25);
});
