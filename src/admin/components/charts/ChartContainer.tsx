import { ReactNode } from "react";

export default function ChartContainer({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl p-5 shadow-lg w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold text-[#d4af37] mb-4">{title}</h2>

      {/* This guarantees a real height BEFORE the chart mounts */}
      <div className="flex-1 min-h-[200px]">
        {children}
      </div>
    </div>
  );
}
