import { ReactNode } from "react";

export default function ChartContainer({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl p-5 shadow-lg w-full flex flex-col min-w-0">
      <h2 className="text-lg font-semibold text-[#d4af37] mb-4">
        {title}
      </h2>

      {/* This guarantees proper width + height */}
      <div className="flex-1 min-h-[300px] w-full min-w-0">
        {children}
      </div>
    </div>
  );
}