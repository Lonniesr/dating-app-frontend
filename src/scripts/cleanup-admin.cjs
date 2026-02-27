/**
 * Cleanup Script: Delete unused admin pages
 * -----------------------------------------
 * Deletes every admin page folder that is NOT referenced
 * in the trimmed SidebarNav.tsx.
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

// Sidebar modules you KEEP
const keep = new Set([
  "/admin",
  "/admin/users",
  "/admin/logs",
  "/admin/roles",
  "/admin/settings",
  "/admin/audit",
  "/admin/system-health",
  "/admin/moderation",
  "/admin/feedback",
  "/admin/billing",
  "/admin/marketing",
  "/admin/experiments",
  "/admin/feature-rollouts",
  "/admin/search",
  "/admin/integrations",
  "/admin/developer-console",
  "/admin/system-tasks",
  "/admin/api-keys",
  "/admin/content-library",
  "/admin/onboarding",
  "/admin/localization",
  "/admin/legal",
  "/admin/labs",
  "/admin/ml-models",
]);

const adminDir = path.join(root, "..", "src/app/admin");

// Get all subfolders inside /admin
const entries = fs.readdirSync(adminDir, { withFileTypes: true });

console.log("=====================================");
console.log(" ADMIN CLEANUP REPORT ");
console.log("=====================================");

entries.forEach((entry) => {
  if (!entry.isDirectory()) return;

  const folder = entry.name;
  const route = `/admin/${folder}`;

  // Special case: root /admin page
  if (folder === "page.tsx") return;

  if (!keep.has(route)) {
    const fullPath = path.join(adminDir, folder);
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`🗑 Deleted unused admin module: ${route}`);
  } else {
    console.log(`✔ Kept: ${route}`);
  }
});

console.log("\nCleanup complete.\n");