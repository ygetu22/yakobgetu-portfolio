// Real output from Trace runs, copied from the terminal on November 11, 2026.
// Regenerate by running the same commands; do not hand-edit results.
export const recordedOn = "November 11, 2026";

export const recordedRuns = [
  {
    "command": "webtrace diff https://playwright.dev https://playwright.dev/python",
    "output": [
      "Checking https://playwright.dev …",
      "Checking https://playwright.dev/python …",
      "",
      "Comparing",
      "  before  https://playwright.dev/",
      "  after   https://playwright.dev/python/",
      "",
      "Changed (3)",
      "  ? desktop link \"Testing documentation\"",
      "      before: opened /docs/intro",
      "      after:  opened /python/docs/intro",
      "  ? desktop link \"CLI documentation\"",
      "      before: opened /docs/getting-started-cli",
      "      after:  opened /python/docs/getting-started-cli",
      "  ? desktop link \"MCP documentation\"",
      "      before: opened /docs/getting-started-mcp",
      "      after:  opened /python/docs/getting-started-mcp",
      "",
      "Same on both: 3 · Tried on only one version: 2",
      "",
      "✓ PASSED · nothing stopped working"
    ]
  },
  {
    "command": "webtrace check https://playwright.dev",
    "output": [
      "Checking https://playwright.dev …",
      "",
      "Fast and reliable end-to-end testing for modern web apps | Playwright",
      "  HTTP 200 · HTTPS · 34s",
      "",
      "What Trace tried (7)",
      "  ? desktop button \"Search (Meta+k)\" (on 4 pages)",
      "      Page content changed; the intended result still needs confirmation.",
      "  ? desktop button \"Node.js\" (on 4 pages)",
      "      Could not confirm that this control opened.",
      "  ✓ desktop link \"Testing documentation\" → /docs/intro",
      "  ✓ desktop link \"CLI documentation\" → /docs/getting-started-cli",
      "  ✓ desktop link \"MCP documentation\" → /docs/getting-started-mcp",
      "  ✓ mobile  button \"Toggle navigation bar\"",
      "  ? mobile  button \"Search (Meta+k)\"",
      "      Page content changed; the intended result still needs confirmation.",
      "",
      "Needs review (1)",
      "  • Node.js",
      "    “Node.js”: Could not confirm that this control opened. (on 4 pages)",
      "",
      "Optional (1)",
      "  • Browser protections worth reviewing",
      "    Consider adding CONTENT-SECURITY-POLICY, X-CONTENT-TYPE-OPTIONS and REFERRER-POLICY for additional browser protection. Set a framing policy if this page should not be embedded elsewhere.",
      "",
      "Sampling limit reached; some buttons and links were not tried.",
      "Not tested: sign-in, purchases, real form submissions.",
      "",
      "✓ PASSED · 0 problems · 1 to review"
    ]
  }
];
