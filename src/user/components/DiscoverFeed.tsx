import { useState, useMemo, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useDiscover } from "../../hooks/useDiscover";

const SWIPE_THRESHOLD = 120;

type DiscoverUser = {
  id: string;
  name: string;
  birthdate?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  photos?: string[];
};

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

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 3958.8;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function DiscoverFeed() {
  const { data, isLoading, refetch } = useDiscover();

  /* Normalize API response */
  const users: DiscoverUser[] = Array.isArray(data)
    ? data
    : (data as any)?.profiles ?? [];

  const [index, setIndex] = useState(0);
  const [matchUser, setMatchUser] = useState<null | { name: string }>(null);

  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  /* Debug logging */
  useEffect(() => {
    console.log("Discover users loaded:", users.length);
  }, [users]);

  /* Reset deck when new data arrives */

  useEffect(() => {
    setIndex(0);
  }, [users.length]);

  /* Load browser location */

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setLocation({ lat, lon });

        try {
          await fetch(`${import.meta.env.VITE_API_URL}/api/profile/location`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude: lat,
              longitude: lon,
            }),
          });
        } catch (err) {
          console.error("Location save failed", err);
        }
      },
      () => {
        console.log("Location permission denied");
      }
    );
  }, []);

  const current = users[index];
  const next = users[index + 1];

  const age = calculateAge(current?.birthdate);

  const distance =
    location &&
    current?.latitude != null &&
    current?.longitude != null
      ? calculateDistance(
          location.lat,
          location.lon,
          current.latitude,
          current.longitude
        ).toFixed(1)
      : null;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

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

  /* Advance card */

  const advance = async () => {
    const nextIndex = index + 1;

    if (nextIndex < users.length) {
      setIndex(nextIndex);
    } else {
      console.log("Refetching discover feed...");
      await refetch();
      setIndex(0);
    }

    x.set(0);
  };

  /* Send swipe */

  const sendSwipe = async (liked: boolean, superLike = false) => {
    if (!current) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/swipe`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetId: current.id,
          liked,
          superLike,
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

      if (json?.isMatch) {
        setMatchUser({ name: current.name });
      }

      await advance();
    } catch (err) {
      console.error("Swipe failed", err);
    }
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const offsetX = info.offset.x;

    if (offsetX > SWIPE_THRESHOLD) sendSwipe(true);
    else if (offsetX < -SWIPE_THRESHOLD) sendSwipe(false);
    else x.set(0);
  };

  /* Prefetch when deck low */

  useEffect(() => {
    if (users.length - index < 4 && users.length > 0) {
      refetch();
    }
  }, [index]);

  /* Loading */

  if (isLoading) {
    return (
      <div className="h-[520px] flex items-center justify-center">
        <p className="text-white/60">Loading people…</p>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="h-[520px] flex items-center justify-center">
        <p className="text-white/60">No people found nearby.</p>
      </div>
    );
  }

  const photo =
    current?.photos?.length ? current.photos[0] : "https://picsum.photos/600";

  const nextPhoto =
    next?.photos?.length ? next.photos[0] : "https://picsum.photos/600";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[380px] h-[520px]">

        {next && (
          <motion.img
            src={nextPhoto}
            className="absolute w-full h-full object-cover rounded-2xl"
            initial={{ scale: 0.95, opacity: 0.6 }}
            animate={{ scale: 0.95, opacity: 0.6 }}
          />
        )}

        <AnimatePresence>
          {current && (
            <motion.div
              key={current.id}
              className="absolute w-full h-full rounded-2xl overflow-hidden shadow-xl"
              style={{ x, rotate }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              <img src={photo} className="w-full h-full object-cover" />

              <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h2 className="text-xl font-bold">
                  {current.name}
                  {age !== null && `, ${age}`}
                </h2>

                <p className="text-sm opacity-80">
                  {current.location || "Unknown location"}
                  {distance && ` • ${distance} miles away`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ACTION BUTTONS */}

      <div className="flex gap-6 mt-6">
        <button
          onClick={() => sendSwipe(false)}
          className="w-14 h-14 rounded-full bg-white/10 text-white text-xl hover:bg-white/20"
        >
          ✕
        </button>

        <button
          onClick={() => sendSwipe(true, true)}
          className="w-14 h-14 rounded-full bg-blue-500 text-white text-xl hover:bg-blue-400"
        >
          ⭐
        </button>

        <button
          onClick={() => sendSwipe(true)}
          className="w-14 h-14 rounded-full bg-yellow-500 text-black text-xl hover:bg-yellow-400"
        >
          ♥
        </button>
      </div>

      {/* MATCH POPUP */}

      {matchUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl p-8 text-center w-[320px]">
            <h2 className="text-3xl font-bold mb-4">🎉 It's a Match!</h2>

            <p className="mb-6">
              You and <strong>{matchUser.name}</strong> liked each other.
            </p>

            <button
              onClick={() => setMatchUser(null)}
              className="px-4 py-2 bg-yellow-500 rounded-lg"
            >
              Nice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}