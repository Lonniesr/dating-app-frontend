import { useEffect, useState } from "react";
import api from "../../services/apiClient";

type UserVerification = {
  id: string;
  name?: string;
  username?: string;
  verification_selfie: string;
  verification_status: string;
};

export default function AdminVerification() {
  const [users, setUsers] = useState<UserVerification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQueue = async () => {
    try {
      const res = await api.get("/api/admin/verification");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load verification queue", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const approve = async (id: string) => {
    await api.post(`/api/admin/verification/${id}/approve`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const reject = async (id: string) => {
    await api.post(`/api/admin/verification/${id}/reject`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  if (loading) {
    return <div className="p-6 text-white">Loading…</div>;
  }

  return (
    <div className="p-6 text-white">

      <h1 className="text-2xl font-bold mb-6">
        Verification Queue
      </h1>

      {users.length === 0 && (
        <p className="text-white/60">No pending verifications</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <p className="font-semibold mb-2">
              {user.username || user.name || "User"}
            </p>

            <img
              src={user.verification_selfie}
              alt="selfie"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={() => approve(user.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => reject(user.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded"
              >
                Reject
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}