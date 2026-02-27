export const IconInterests = ({ active }: { active?: boolean }) => (
  <svg className={`header-icon ${active ? "active" : ""}`} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21s-6-4.35-9-9c-2-3.2-.5-8 4-8 2.5 0 4 2 5 3.5C13 6 14.5 4 17 4c4.5 0 6 4.8 4 8-3 4.65-9 9-9 9z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);