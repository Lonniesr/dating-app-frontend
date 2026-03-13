import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import { useDiscover } from "../hooks/useDiscover";
import { useSwipe } from "./hooks/useSwipe";
import { getProfilePhoto } from "../utils/getProfilePhoto";

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
  const { swipe } = useSwipe();

  const users: DiscoverUser[] = Array.isArray(data)
    ? data
    : (data as any)?.profiles ?? [];

  const [index, setIndex] = useState(0);
  const [matchUser, setMatchUser] = useState<DiscoverUser | null>(null);
  const [swiping, setSwiping] = useState(false);

  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, 0], [1, 0]);

  useEffect(() => {
    setIndex(0);
  }, [users.length]);

  const current = users[index];
  const next = users[index + 1];

  const photo = getProfilePhoto(current?.photos);
  const nextPhoto = getProfilePhoto(next?.photos);

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
              dragElastic={0.9}
              onDragEnd={() => {}}
            >

              <img
                src={photo}
                className="w-full h-full object-cover"
              />

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
    </div>
  );
}