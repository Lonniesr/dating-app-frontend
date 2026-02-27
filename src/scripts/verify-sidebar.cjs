/**
 * Admin Sidebar Verification Script
 * -----------------------------------
 * Checks:
 *  - Every sidebarNav path points to a real page
 *  - Every admin page has a matching sidebarNav entry
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

// --------------------------------------
// 1. Extract ALL admin pages that exist
// --------------------------------------
function getExistingAdminPages() {
  const adminDir = path.join(root, "..", "src/app/admin");

  const pages = [];

  function walk(dir, prefix = "/admin") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subdir = path.join(dir, entry.name);
        const route = `${prefix}/${entry.name}`;
        walk(subdir, route);
      } else if (entry.name === "page.tsx") {
        pages.push(prefix);
      }
    }
  }

  walk(adminDir);
  return pages.sort();
}

const existingPages = getExistingAdminPages();

// --------------------------------------
// 2. Extract paths from SidebarNav.tsx
// --------------------------------------
const SIDEBAR_NAV_PATH = path.join(
  root,
  "..",
  "src/components/sidebar/SidebarNav.tsx"
);

let sidebarPaths = [];

if (fs.existsSync(SIDEBAR_NAV_PATH)) {
  const content = fs.readFileSync(SIDEBAR_NAV_PATH, "utf8");

  // Match: path: "/admin/xyz"
  const regex = /path:\s*["'`](\/admin\/?[a-zA-Z0-9\-]*)["'`]/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    sidebarPaths.push(match[1]);
  }
} else {
  console.log("✘ SidebarNav.tsx not found at:", SIDEBAR_NAV_PATH);
  process.exit(1);
}

// --------------------------------------
// 3. Verification
// --------------------------------------
console.log("=====================================");
console.log(" ADMIN SIDEBAR VERIFICATION REPORT ");
console.log("=====================================");

// Sidebar → Page Files
console.log("\n=== SIDEBAR → EXISTING PAGES ===");
sidebarPaths.forEach((pathStr) => {
  const exists = existingPages.includes(pathStr);
  console.log(`${exists ? "✔" : "✘"} ${pathStr}`);
});

// Page Files → Sidebar
console.log("\n=== EXISTING PAGES → SIDEBAR ===");
existingPages.forEach((page) => {
  const exists = sidebarPaths.includes(page);
  console.log(`${exists ? "✔" : "✘"} ${page}`);
});

// Extra sidebar links
console.log("\n=== EXTRA SIDEBAR LINKS (no matching page) ===");
sidebarPaths
  .filter((p) => !existingPages.includes(p))
  .forEach((p) => console.log(`✘ ${p}`));

console.log("\nVerification complete.\n");