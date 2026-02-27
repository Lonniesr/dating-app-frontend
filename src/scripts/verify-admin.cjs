/**
 * Admin Frontend Verification Script
 * -----------------------------------
 * Checks:
 *  - Required admin pages exist
 *  - Required admin subpages exist
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

// -------------------------------
// REQUIRED ADMIN PAGES
// -------------------------------
const adminPages = [
  "src/app/admin/page.tsx",
  "src/app/admin/users/page.tsx",
  "src/app/admin/analytics/page.tsx",
  "src/app/admin/moderation/page.tsx",
  "src/app/admin/feature-rollouts/page.tsx",
  "src/app/admin/experiments/page.tsx",
  "src/app/admin/system-tasks/page.tsx",
  "src/app/admin/api-keys/page.tsx",
  "src/app/admin/content/page.tsx",
  "src/app/admin/onboarding-flows/page.tsx",
  "src/app/admin/internal-tools/page.tsx",
  "src/app/admin/notifications/page.tsx",
  "src/app/admin/email-monitor/page.tsx",
];

// -------------------------------
// CHECK HELPER
// -------------------------------
function checkFiles(title, files) {
  console.log(`\n=== ${title} ===`);
  files.forEach((file) => {
    const exists = fs.existsSync(path.join(root, "..", file));
    console.log(`${exists ? "✔" : "✘"} ${file}`);
  });
}

// -------------------------------
// RUN CHECKS
// -------------------------------
console.log("=====================================");
console.log(" ADMIN FRONTEND VERIFICATION REPORT ");
console.log("=====================================");

checkFiles("ADMIN PAGES", adminPages);

console.log("\nVerification complete.\n");