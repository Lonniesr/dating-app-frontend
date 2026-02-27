export const IconPrompts = ({ active }: { active?: boolean }) => (
  <svg className={`header-icon ${active ? "active" : ""}`} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M7 8h10M7 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);