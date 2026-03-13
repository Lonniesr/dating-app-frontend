import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface LikeUser {
  id: string;
  name: string;
  location?: string;
  birthdate?: string;
  photos?: string[];
}

function calculateAge(birthdate?: string) {
  if (!birthdate) return null;

  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export default function LikesPage() {
  const [likes, setLikes] = useState<LikeUser[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadLikes() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/swipe/likes-you`,
          { credentials: "include" }
        );

        const data = await res.json();
        setLikes(data || []);
      } catch (err) {
        console.error("Failed to load likes", err);
      } finally {
        setLoading(false);
      }
    }

    loadLikes();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">People Who Liked You</h1>
        <p className="text-white/60">Loading…</p>
      </div>
    );
  }

  if (!likes.length) {
    return (
      <div className="p-6 text-white text-center">
        <h1 className="text-2xl font-bold mb-4">People Who Liked You</h1>

        <div className="bg-white/5 border border-white/10 rounded-xl p-10">
          <p className="text-white/60 mb-4">
            Nobody has liked you yet.
          </p>

          <button
            onClick={() => navigate("/user/discover")}
            className="px-5 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Go Swiping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">

      <h1 className="text-2xl font-bold mb-6">
        ❤️ People Who Liked You
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {likes.map((user) => {
          const photo =
            user.photos && user.photos.length
              ? user.photos[0]
              : "/placeholder.jpg";

          const age = calculateAge(user.birthdate);

          return (
            <div
              key={user.id}
              onClick={() => navigate(`/user/messages/${user.id}`)}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition cursor-pointer"
            >

              <div className="h-[280px] overflow-hidden">
                <img
                  src={photo}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h2 className="font-semibold text-lg">
                  {user.name}
                  {age ? `, ${age}` : ""}
                </h2>

                <p className="text-sm text-white/60">
                  {user.location || "Unknown location"}
                </p>
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}