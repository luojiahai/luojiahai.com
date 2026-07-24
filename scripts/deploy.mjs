// Branch guard for `pnpm deploy`. The Workers Builds dashboard already
// splits its deploy commands (main → `wrangler deploy`, other branches →
// `wrangler versions upload`, no production traffic change); this applies
// the same rule via WORKERS_CI_BRANCH as an in-repo backstop against
// dashboard drift. Locally WORKERS_CI_BRANCH is unset, so `pnpm deploy`
// still deploys to production.
import { execSync } from "node:child_process";

const branch = process.env.WORKERS_CI_BRANCH;
const previewOnly = branch !== undefined && branch !== "main";
const command = previewOnly ? "wrangler versions upload" : "wrangler deploy";

console.log(
  previewOnly
    ? `Non-production branch "${branch}" — uploading a preview version only.`
    : "Deploying to production.",
);
execSync(command, { stdio: "inherit" });
