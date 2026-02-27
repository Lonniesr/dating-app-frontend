type VerifiedBadgeProps = {
  verified?: boolean;
  className?: string;
};

export default function VerifiedBadge({ verified, className = "" }: VerifiedBadgeProps) {
  if (!verified) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-semibold border border-blue-500/30 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Verified
    </span>
  );
}
