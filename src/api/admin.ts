// src/api/admin.ts

export async function getAdminAnalytics() {
  const res = await fetch("http://localhost:3001/api/admin/analytics", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load admin analytics");
  }

  return res.json();
}

export async function getAdminUsers() {
  const res = await fetch("http://localhost:3001/api/admin/users", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load admin users");
  }

  return res.json();
}

export async function getAdminUserById(userId: string) {
  const res = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load user details");
  }

  return res.json();
}

export async function banUser(userId: string) {
  const res = await fetch(`http://localhost:3001/api/admin/users/${userId}/ban`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to ban user");
  }

  return res.json();
}

export async function unbanUser(userId: string) {
  const res = await fetch(`http://localhost:3001/api/admin/users/${userId}/unban`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to unban user");
  }

  return res.json();
}

export async function getAdminLogs() {
  const res = await fetch("http://localhost:3001/api/admin/logs", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load admin logs");
  }

  return res.json();
}

export async function getModerationQueue() {
  const res = await fetch("http://localhost:3001/api/admin/moderation", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load moderation queue");
  }

  return res.json();
}

export async function resolveModerationItem(itemId: string) {
  const res = await fetch(`http://localhost:3001/api/admin/moderation/${itemId}/resolve`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to resolve moderation item");
  }

  return res.json();
}

export async function getFeatureRollouts() {
  const res = await fetch("http://localhost:3001/api/admin/feature-rollouts", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load feature rollouts");
  }

  return res.json();
}

export async function updateFeatureRollout(featureId: string, payload: any) {
  const res = await fetch(`http://localhost:3001/api/admin/feature-rollouts/${featureId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to update feature rollout");
  }

  return res.json();
}

export async function getExperiments() {
  const res = await fetch("http://localhost:3001/api/admin/experiments", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load experiments");
  }

  return res.json();
}

export async function updateExperiment(experimentId: string, payload: any) {
  const res = await fetch(`http://localhost:3001/api/admin/experiments/${experimentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to update experiment");
  }

  return res.json();
}

export async function getSystemTasks() {
  const res = await fetch("http://localhost:3001/api/admin/system-tasks", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load system tasks");
  }

  return res.json();
}

export async function runSystemTask(taskId: string) {
  const res = await fetch(`http://localhost:3001/api/admin/system-tasks/${taskId}/run`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to run system task");
  }

  return res.json();
}

export async function getApiKeys() {
  const res = await fetch("http://localhost:3001/api/admin/api-keys", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load API keys");
  }

  return res.json();
}

export async function createApiKey() {
  const res = await fetch("http://localhost:3001/api/admin/api-keys", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to create API key");
  }

  return res.json();
}

export async function revokeApiKey(keyId: string) {
  const res = await fetch(`http://localhost:3001/api/admin/api-keys/${keyId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to revoke API key");
  }

  return res.json();
}

export async function getContentLibrary() {
  const res = await fetch("http://localhost:3001/api/admin/content", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load content library");
  }

  return res.json();
}

export async function updateContentItem(itemId: string, payload: any) {
  const res = await fetch(`http://localhost:3001/api/admin/content/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to update content item");
  }

  return res.json();
}

export async function getOnboardingFlows() {
  const res = await fetch("http://localhost:3001/api/admin/onboarding-flows", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load onboarding flows");
  }

  return res.json();
}

export async function updateOnboardingFlow(flowId: string, payload: any) {
  const res = await fetch(`http://localhost:3001/api/admin/onboarding-flows/${flowId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to update onboarding flow");
  }

  return res.json();
}

export async function getInternalTools() {
  const res = await fetch("http://localhost:3001/api/admin/internal-tools", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load internal tools");
  }

  return res.json();
}

export async function runInternalTool(toolId: string) {
  const res = await fetch(`http://localhost:3001/api/admin/internal-tools/${toolId}/run`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to run internal tool");
  }

  return res.json();
}

export async function getNotificationTemplates() {
  const res = await fetch("http://localhost:3001/api/admin/notifications/templates", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load notification templates");
  }

  return res.json();
}

export async function updateNotificationTemplate(templateId: string, payload: any) {
  const res = await fetch(`http://localhost:3001/api/admin/notifications/templates/${templateId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to update notification template");
  }

  return res.json();
}

export async function sendTestNotification(payload: any) {
  const res = await fetch("http://localhost:3001/api/admin/notifications/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to send test notification");
  }

  return res.json();
}

export async function getEmailTemplates() {
  const res = await fetch("http://localhost:3001/api/admin/emails/templates", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load email templates");
  }

  return res.json();
}

export async function updateEmailTemplate(templateId: string, payload: any) {
  const res = await fetch(`http://localhost:3001/api/admin/emails/templates/${templateId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to update email template");
  }

  return res.json();
}

export async function sendTestEmail(payload: any) {
  const res = await fetch("http://localhost:3001/api/admin/emails/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to send test email");
  }

  return res.json();
}