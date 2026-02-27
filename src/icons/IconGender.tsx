export const IconGender = ({ active }: { active?: boolean }) => (
  <svg className={`header-icon ${active ? "active" : ""}`} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M15 9l3-3M18 6h-3M18 6v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);