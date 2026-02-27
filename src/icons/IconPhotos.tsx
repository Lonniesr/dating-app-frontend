export const IconPhotos = ({ active }: { active?: boolean }) => (
  <svg className={`header-icon ${active ? "active" : ""}`} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
    <circle cx="9" cy="9" r="2" fill="currentColor" />
    <path d="M4 16l4-4 3 3 5-5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);