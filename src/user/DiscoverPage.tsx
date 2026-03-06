import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DiscoverUser = {
  id: string;
  name: string;
  photos: string[];
  gender?: string;
};

export default function DiscoverPage() {
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [matchUser, setMatchUser] = useState<DiscoverUser | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/discover`,
      { credentials: "include" }
    );

    const data = await res.json();
    setUsers(data);
  }

  async function swipe(direction: "left" | "right", user: DiscoverUser) {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/swipe/${user.id}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      }
    );

    if (direction === "right") {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/swipe/${user.id}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.match) {
        setMatchUser(user);
      }
    }

    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  }

  const currentUser = users[0];

  return (
    <div className="flex justify-center mt-10">

      <div className="relative w-[350px] h-[520px]">

        <AnimatePresence>

          {currentUser && (

            <motion.div
              key={currentUser.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x > 120) swipe("right", currentUser);
                else if (info.offset.x < -120) swipe("left", currentUser);
              }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-[350px] h-[520px] rounded-2xl overflow-hidden shadow-xl cursor-grab active:cursor-grabbing"
            >

              <img
                src={currentUser.photos?.[0]}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">

                <h2 className="text-xl font-bold">
                  {currentUser.name}
                </h2>

                <p className="text-sm opacity-80">
                  {currentUser.gender}
                </p>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </div>

      {/* MATCH MODAL */}

      {matchUser && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-white text-black rounded-2xl p-8 text-center w-[320px]">

            <h2 className="text-3xl font-bold mb-4">
              🎉 It's a Match!
            </h2>

            <img
              src={matchUser.photos?.[0]}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            />

            <p className="mb-6">
              You and <strong>{matchUser.name}</strong> liked each other.
            </p>

            <div className="flex gap-3 justify-center">

              <button
                onClick={() => setMatchUser(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Keep Swiping
              </button>

              <a
                href="/user/messages"
                className="px-4 py-2 bg-yellow-500 text-black rounded-lg"
              >
                Send Message
              </a>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}