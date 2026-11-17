import assert from "node:assert/strict";
import test from "node:test";
import { findItems, splitAtMatch } from "../src/components/layout/search.ts";

const items = [
  { title: "About", type: "Section" },
  { title: "Trace", type: "Project", detail: "terminal tool" },
  { title: "Elsewhere", type: "Project", keywords: "photos travel japan" },
  { title: "Contact", type: "Section" },
  { title: "Playwright", type: "Skill", detail: "Trace" },
];

test("an empty search shows only the starter groups", () => {
  const results = findItems(items, "   ", ["Section"]);
  assert.deepEqual(results.map((item) => item.title), ["About", "Contact"]);
});

test("titles that start with the query come before titles that only contain it", () => {
  const results = findItems(items, "t", []);
  assert.equal(results[0].title, "Trace");
  assert(results.findIndex((item) => item.title === "About") > 0);
});

test("details and hidden keywords are searched after titles", () => {
  assert.deepEqual(findItems(items, "japan", []).map((item) => item.title), ["Elsewhere"]);
  assert.deepEqual(findItems(items, "trace", []).map((item) => item.title), ["Trace", "Playwright"]);
});

test("search ignores upper and lower case and returns nothing for no match", () => {
  assert.equal(findItems(items, "ELSE", [])[0].title, "Elsewhere");
  assert.deepEqual(findItems(items, "zzz", ["Section"]), []);
});

test("no more than eight results are returned", () => {
  const many = Array.from({ length: 20 }, (_, number) => ({ title: `Photo ${number}`, type: "Photo" }));
  assert.equal(findItems(many, "photo", []).length, 8);
});

test("a title is split around the matching part, keeping its own capitals", () => {
  assert.deepEqual(splitAtMatch("Elsewhere", "WHERE"), { before: "Else", match: "where", after: "" });
  assert.deepEqual(splitAtMatch("Trace", "japan"), { before: "Trace", match: "", after: "" });
  assert.deepEqual(splitAtMatch("Trace", ""), { before: "Trace", match: "", after: "" });
});
