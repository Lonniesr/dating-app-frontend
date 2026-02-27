interface AdminPageProps {
  title: string;
  children?: React.ReactNode;
}

export default function AdminPage({ title, children }: AdminPageProps) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#d4af37]">{title}</h1>

      <div className="bg-[#111111] border border-white/10 rounded-xl p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
}
