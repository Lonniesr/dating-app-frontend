import { useQuery } from "@tanstack/react-query";

type ProfileCompletionResponse = {
  percent: number;
};

export default function ProfileCompletionSection() {
  const { data, isLoading } = useQuery<ProfileCompletionResponse>({
    queryKey: ["profile-completion"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/profile-completion`,
        { credentials: "include" }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6 text-white">
        <p className="text-white/60">Checking profile completion…</p>
      </div>
    );
  }

  if (!data) return null;

  const percent = data.percent ?? 0;

  return (
    <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6 text-white">
      <h2 className="text-xl font-bold mb-3">Profile Completion</h2>

      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
        <div
          className="bg-yellow-500 h-3 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-2 text-white/70 text-sm">{percent}% complete</p>
    </div>
  );
}
