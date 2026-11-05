import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const portfolio = fileURLToPath(new URL("../", import.meta.url));
const trace = fileURLToPath(new URL("../../trace/", import.meta.url));
if (Number(process.versions.node.split(".")[0]) < 22) {
  console.error("Portfolio + Trace development requires Node 22 or newer. Run nvm use 22.");
  process.exit(1);
}
const channel = process.env.TRACE_BROWSER_CHANNEL ??
  (existsSync("/Applications/Google Chrome.app") ? "chrome" : "");
const checker = spawn(process.execPath, ["--experimental-strip-types", "src/server.ts"], {
  cwd: trace,
  env: { ...process.env, NODE_ENV: "development", PORT: "3120", TRACE_BROWSER_CHANNEL: channel, TRACE_LOCAL_UNLIMITED: process.env.TRACE_LOCAL_UNLIMITED ?? "1" },
  stdio: "inherit",
});
const site = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", ...process.argv.slice(2)], {
  cwd: portfolio,
  stdio: "inherit",
});
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  checker.kill("SIGTERM");
  site.kill("SIGTERM");
}
for (const child of [checker, site]) {
  child.on("error", error => { console.error(error.message); stop(1); });
  child.on("exit", code => stop(code ?? 0));
}
process.once("SIGINT", () => stop());
process.once("SIGTERM", () => stop());
