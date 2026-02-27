import { useState, useMemo } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useDiscover } from "../hooks/useDiscover";

const SWIPE_THRESHOLD = 120;

type DiscoverUser = {
  id: string;
  name: string;
  age: number;
  location?: string;
  photos?: string[];
};

export default function DiscoverFeed() {
  const { data, isLoading, refetch } = useDiscover();

  const [index, setIndex] = useState(0);
  const [matchUser, setMatchUser] = useState<null | { name: string }>(null);

  const users: DiscoverUser[] = data || [];
  const current = users[index];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const likeSound = useMemo(
    () => (typeof Audio !== "undefined" ? new Audio("/sounds/like.mp3") : null),
    []
  );

  const passSound = useMemo(
    () => (typeof Audio !== "undefined" ? new Audio("/sounds/pass.mp3") : null),
    []
  );

  const vibrate = (pattern: number | number[]) => {
    if (navigator.vibrate) navigator.vibrate(pattern);
  };

  const advance = async () => {
    const nextIndex = index + 1;

    if (nextIndex < users.length) {
      setIndex(nextIndex);
    } else {
      await refetch();
      setIndex(0);
    }

    x.set(0);
  };

  const sendSwipe = async (liked: boolean) => {
    if (!current) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/swipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        targetId: current.id,
        liked,
      }),
    });

    const json = await res.json();

    if (liked) {
      likeSound?.play();
      vibrate(30);
    } else {
      passSound?.play();
      vibrate([10, 40, 10]);
    }

    if (json.isMatch) {
      setMatchUser({ name: current.name });
    }

    await advance();
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const offsetX = info.offset.x;

    if (offsetX > SWIPE_THRESHOLD) {
      sendSwipe(true);
    } else if (offsetX < -SWIPE_THRESHOLD) {
      sendSwipe(false);
    } else {
      x.set(0);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 rounded-xl p-5 border border-white/10 h-[500px] flex items-center justify-center">
        <p className="text-white/60">Loading people…</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="bg-white/5 rounded-xl p-5 border border-white/10 h-[500px] flex items-center justify-center">
        <p className="text-white/60">No more people right now.</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white/5 rounded-xl p-5 border border-white/10 h-[500px] flex flex-col overflow-hidden">
      <motion.div
        className="flex-1 rounded-xl overflow-hidden border border-white/10 shadow-xl"
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <img
          src={current.photos?.[0]}
          alt={current.name}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{current.name}</h2>
          <p className="text-white/60">
            {current.age} • {current.location}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => sendSwipe(false)}
            className="px-4 py-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20"
          >
            Pass
          </button>

          <button
            onClick={() => sendSwipe(true)}
            className="px-4 py-2 rounded-full bg-yellow-500 text-black font-semibold hover:bg-yellow-400"
          >
            Like
          </button>
        </div>
      </div>

      {matchUser && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-yellow-400 mb-2">
              It&apos;s a match!
            </h3>

            <p className="text-white/80 mb-4">
              You and {matchUser.name} like each other.
            </p>

            <button
              onClick={() => setMatchUser(null)}
              className="px-4 py-2 rounded-full bg-yellow-500 text-black font-semibold hover:bg-yellow-400"
            >
              Nice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
