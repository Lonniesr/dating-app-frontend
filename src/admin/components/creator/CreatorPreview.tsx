import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import {
  HeartIcon,
  XMarkIcon,
  FireIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

interface Props {
  creatorName: string;
  age: number;
  city: string;
  distance: string;
  notification: string;
  cta: string;
  videoUrl: string | null;
  photoUrl: string | null;

  verified: boolean;
  online: boolean;
  topPick: boolean;

  showLike: boolean;
  showNope: boolean;
}

export default function CreatorPreview({
  creatorName,
  age,
  city,
  distance,
  notification,
  cta,
  videoUrl,
  photoUrl,
  verified,
  online,
  topPick,
  showLike,
  showNope,
}: Props) {
  return (
    <div className="flex w-full items-center justify-center bg-[radial-gradient(circle_at_center,#222_0%,#111_45%,#000_100%)] p-10">
      {/* Phone */}
      <div className="relative rounded-[54px] border border-zinc-700 bg-black p-[10px] shadow-[0_45px_120px_rgba(0,0,0,.75)]">
        {/* Screen */}
        <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[44px] bg-black">
         {/* Media */}
{videoUrl ? (
  <video
    src={videoUrl}
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 h-full w-full object-cover object-top"
    />
) : photoUrl ? (
  <img
    src={photoUrl}
    alt={creatorName}
    className="absolute inset-0 h-full w-full object-cover object-top"
    />
) : (
  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
)}

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/20" />

          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-3 z-50 -translate-x-1/2">
            <div className="h-8 w-40 rounded-full border border-zinc-800 bg-black shadow-lg" />
          </div>

          {/* Notification */}
          {notification && (
            <div className="absolute left-4 right-4 top-20 z-40">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-2xl">
                <div className="text-[11px] uppercase tracking-[0.25em] text-white/60">
                  LynQ
                </div>

                <div className="mt-1 text-sm font-semibold text-white">
                  {creatorName} {notification}
                </div>
              </div>
            </div>
          )}

          {/* Top Pick */}
          {topPick && (
            <div className="absolute left-5 top-36 z-40">
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-4 py-2 text-sm font-bold text-white shadow-xl">
                <FireIcon className="h-5 w-5" />
                Top Pick
              </div>
            </div>
          )}

          {/* LIKE */}
          {showLike && (
            <div className="absolute left-5 top-48 z-40 rotate-[-18deg]">
              <div className="rounded-xl border-4 border-lime-400 px-5 py-2 text-5xl font-black tracking-wider text-lime-400">
                LIKE
              </div>
            </div>
          )}

          {/* NOPE */}
          {showNope && (
            <div className="absolute right-5 top-48 z-40 rotate-[18deg]">
              <div className="rounded-xl border-4 border-red-500 px-5 py-2 text-5xl font-black tracking-wider text-red-500">
                NOPE
              </div>
            </div>
          )}

          {/* Bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-40 p-6">
            {/* Name */}
            <div className="mb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-black text-white">
                  {creatorName}
                </h2>

                <span className="text-4xl font-light text-white">
                  {age}
                </span>

                {verified && (
                  <CheckBadgeIcon className="h-8 w-8 text-sky-400 drop-shadow-lg" />
                )}

                {online && (
                  <span className="h-4 w-4 animate-pulse rounded-full bg-green-400 ring-2 ring-white" />
                )}
              </div>
                <div className="mt-1 flex items-center gap-2 text-white/80">
                <MapPinIcon className="h-5 w-5" />

                <span className="text-lg">
                  {city} • {distance}
                </span>
              </div>
            </div>

           {/* CTA */}
            <button className="mx-auto mb-5 w-[92%] rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-lg font-semibold text-white shadow-[0_8px_30px_rgba(255,255,255,.08)] backdrop-blur-2xl transition-all duration-300 hover:bg-white/20 active:scale-95">
             {cta}
            </button>

            {/* Swipe Buttons */}
            <div className="flex justify-center gap-8">
              <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-2xl transition duration-300 hover:scale-110 active:scale-95">
                <XMarkIcon className="h-8 w-8 text-red-500" />
              </button>

              <button className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 shadow-2xl transition duration-300 hover:scale-110 active:scale-95">
                <StarIcon className="h-8 w-8 text-white" />
              </button>

              <button className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-2xl transition duration-300 hover:scale-110 active:scale-95">
                <HeartIcon className="h-8 w-8 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}