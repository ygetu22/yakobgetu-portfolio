import assert from "node:assert/strict";
import test from "node:test";
import { buildSkillUsage, skillElementId } from "../src/features/resume/skill-usage.ts";

test("each skill lists the places that used it, in order", () => {
  const usage = buildSkillUsage([
    { label: "Internship", stack: ["Java", "Playwright"] },
    { label: "Trace", stack: ["Playwright"] },
    { label: "School" },
  ]);

  assert.deepEqual(usage.get("Playwright"), ["Internship", "Trace"]);
  assert.deepEqual(usage.get("Java"), ["Internship"]);
  assert.equal(usage.has("Python"), false);
});

test("skill names become safe element ids", () => {
  assert.equal(skillElementId("CI/CD"), "skill-ci-cd");
  assert.equal(skillElementId("Next.js"), "skill-next-js");
  assert.equal(skillElementId("C++"), "skill-c");
});
