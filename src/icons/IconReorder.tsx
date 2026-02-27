export const IconReorder = ({ active }: { active?: boolean }) => (
  <svg className={`header-icon ${active ? "active" : ""}`} viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);