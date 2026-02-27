export default function AdminRoutes() {
  return (
    <>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="users/:id" element={<AdminUserDetail />} />
      <Route path="roles" element={<AdminRoles />} />
      <Route path="settings" element={<AdminSettings />} />
      <Route path="invites" element={<AdminInvites />} />
      <Route path="verification" element={<AdminVerification />} />
      <Route path="matches" element={<AdminMatches />} />
      <Route path="messages" element={<AdminMessages />} />
      <Route path="swipes" element={<AdminSwipes />} />
      <Route path="bans" element={<AdminBans />} />
      <Route path="notes" element={<AdminNotes />} />
      <Route path="search" element={<AdminUserSearchPage />} />
      <Route path="billing" element={<AdminBillingPage />} />
      <Route path="notifications" element={<AdminNotificationsPage />} />
      <Route path="system-status" element={<AdminSystemStatusPage />} />
      <Route path="integrations" element={<AdminIntegrationsPage />} />
      <Route path="profile" element={<AdminProfile />} />
      <Route path="reports" element={<AdminReportsPage />} />
      <Route path="support" element={<AdminSupport />} />
      <Route path="analytics" element={<AdminAnalyticsDeepDivePage />} />
      <Route path="system-logs" element={<AdminSystemLogsPage />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </>
  );
}
