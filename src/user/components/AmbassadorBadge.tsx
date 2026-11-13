import { Award } from "lucide-react";

export default function AmbassadorBadge() {
  return (
    <span className="inline-flex w-fit items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-300">
      <Award aria-hidden="true" className="h-4 w-4 shrink-0" />
      LynQ Ambassador
    </span>
  );
}
