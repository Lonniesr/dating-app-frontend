// Check if user passed invite gate
export function requireInvite() {
  const invited = localStorage.getItem("invited");
  return invited === "true";
}

// Check if onboarding is complete
export function requireOnboardingComplete() {
  const step = parseInt(localStorage.getItem("onboardingStep") || "0", 10);
  return step >= 8;
}

// Check if user is approved
export function requireApproved() {
  const name = localStorage.getItem("name");
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const user = users.find((u: any) => u.name === name);
  return user?.status === "approved";
}

// Check if user is admin
export function requireAdmin() {
  const role = localStorage.getItem("role");
  return role === "admin";
}