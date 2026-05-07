import { useEffect, useState } from "react";
import axios from "axios";

export default function PhotoRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/photo-access/incoming`,
        { withCredentials: true }
      );

      setRequests(res.data || []);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  }

  async function respond(requestId: string, status: "approved" | "denied") {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/photo-access/respond`,
        { requestId, status },
        { withCredentials: true }
      );

      // remove from UI
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Failed to respond", err);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!requests.length) return <div className="p-6 text-white">No requests</div>;

  return (
    <div className="p-4 text-white">
      <h1 className="text-xl font-bold mb-4">Photo Requests</h1>

      {requests.map((r) => (
        <div key={r.id} className="bg-white/5 p-4 rounded-xl mb-4">
          <div className="flex gap-3 items-center mb-3">
            <div className="flex gap-3 items-center mb-3">

  {/* 👤 REQUESTER AVATAR */}
  <img
    src={r.requester.photos?.[0]?.url || ""}
    className="w-10 h-10 rounded-full object-cover bg-gray-600"
  />

  {/* 🖼️ PHOTO */}
  <img
    src={r.photo.url}
    className="w-16 h-16 rounded-lg object-cover"
  />

  <div>
    <p className="font-semibold">
      {r.requester.username || r.requester.name}
    </p>

    {r.message && (
      <p className="text-sm text-white/60">
        "{r.message}"
      </p>
    )}
  </div>
</div>

            <div>
              <p className="font-semibold">
                {r.requester.username || r.requester.name}
              </p>

              {r.message && (
                <p className="text-sm text-white/60">
                  "{r.message}"
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => respond(r.id, "approved")}
              className="bg-green-500 px-4 py-2 rounded"
            >
              Approve
            </button>

            <button
              onClick={() => respond(r.id, "denied")}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Deny
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}