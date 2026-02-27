export const IconAboutMe = ({ active }: { active?: boolean }) => (
  <svg className={`header-icon ${active ? "active" : ""}`} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M12 14c-4 0-8 2-8 6h16c0-4-4-6-8-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 14v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);