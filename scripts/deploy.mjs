// Deploy guard for Cloudflare Workers Builds, which runs the same deploy
// command on every branch push. Only main may deploy to production; any
// other branch uploads a preview version instead (own preview URL, no
// production traffic change). Locally WORKERS_CI_BRANCH is unset, so
// `pnpm deploy` still deploys to production.
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
