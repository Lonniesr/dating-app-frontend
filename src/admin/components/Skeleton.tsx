export function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse bg-[#2a2a2a] rounded-md ${className}`}
    />
  );
}