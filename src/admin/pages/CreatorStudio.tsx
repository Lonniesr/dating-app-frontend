import { useState } from "react";
import CreatorPreview from "../components/creator/CreatorPreview";

export default function CreatorStudio() {
  const [creatorName, setCreatorName] = useState("Mamediarra");
  const [age, setAge] = useState(20);
  const [city, setCity] = useState("Atlanta");
  const [distance, setDistance] = useState("3 miles away");

  const [notification, setNotification] = useState(
    "accepted your LynQ invitation"
  );

  const [cta, setCta] = useState("Request your LynQ invite ↓");

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [topPick, setTopPick] = useState(true);
  const [online, setOnline] = useState(true);
  const [verified, setVerified] = useState(true);

  const [showLike, setShowLike] = useState(true);
  const [showNope, setShowNope] = useState(false);
const [screenshotMode, setScreenshotMode] = useState(false);

function handleVideo(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;

  setVideoUrl(URL.createObjectURL(file));
}

function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;

  setPhotoUrl(URL.createObjectURL(file));
}

if (screenshotMode) {
  return (
 <div className="fixed inset-0 z-[9999] bg-black">

  <div className="flex h-screen w-screen items-center justify-center">
    <CreatorPreview
      creatorName={creatorName}
      age={age}
      city={city}
      distance={distance}
      notification={notification}
      cta={cta}
      videoUrl={videoUrl}
      photoUrl={photoUrl}
      verified={verified}
      online={online}
      topPick={topPick}
      showLike={showLike}
      showNope={showNope}
    />
  </div>

  <button
    onClick={() => setScreenshotMode(false)}
    className="absolute right-6 top-6 rounded-xl bg-white/10 px-5 py-3 text-white backdrop-blur hover:bg-white/20"
  >
    Exit Screenshot Mode
  </button>

</div>
  );
}

  return (
    <div className="flex gap-12">

      {/* LEFT PANEL */}

      <div className="w-[340px] shrink-0 space-y-8">

        <h1 className="text-3xl font-bold">
          Creator Studio
        </h1>

        {/* Upload */}

       <div className="space-y-5">

  <div>
    <label className="block mb-2 font-medium">
      Upload Creator Video
    </label>

    <input
      type="file"
      accept="video/*"
      onChange={handleVideo}
    />
  </div>

  <div>
    <label className="block mb-2 font-medium">
      Upload Profile Photo
    </label>

    <input
      type="file"
      accept="image/*"
      onChange={handlePhoto}
    />
  </div>

</div>

        {/* Creator Details */}

        <div className="space-y-4">

          <h2 className="text-lg font-semibold">
            Creator Details
          </h2>

          <input
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="Creator Name"
            className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3"
          />

          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            placeholder="Age"
            className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3"
          />

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3"
          />

          <input
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Distance"
            className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3"
          />

        </div>

        {/* Text */}

        <div className="space-y-4">

          <h2 className="text-lg font-semibold">
            Text
          </h2>

          <textarea
            rows={2}
            value={notification}
            onChange={(e) => setNotification(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3"
          />

          <textarea
            rows={2}
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3"
          />

        </div>

        {/* Display Options */}

        <div className="space-y-3">

          <h2 className="text-lg font-semibold">
            Display
          </h2>

          <label className="flex justify-between">
            <span>Top Pick</span>
            <input
              type="checkbox"
              checked={topPick}
              onChange={() => setTopPick(!topPick)}
            />
          </label>

          <label className="flex justify-between">
            <span>Online</span>
            <input
              type="checkbox"
              checked={online}
              onChange={() => setOnline(!online)}
            />
          </label>

          <label className="flex justify-between">
            <span>Verified</span>
            <input
              type="checkbox"
              checked={verified}
              onChange={() => setVerified(!verified)}
            />
          </label>

          <label className="flex justify-between">
            <span>LIKE Stamp</span>
            <input
              type="checkbox"
              checked={showLike}
              onChange={() => setShowLike(!showLike)}
            />
          </label>

          <label className="flex justify-between">
            <span>NOPE Stamp</span>
            <input
              type="checkbox"
              checked={showNope}
              onChange={() => setShowNope(!showNope)}
            />
          </label>

        </div>

<button
  onClick={() => setScreenshotMode(true)}
  className="w-full rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700"
>
  📸 Screenshot Mode
</button>

      </div>

      {/* PREVIEW */}

      <div className="flex-1 flex justify-center">

        <CreatorPreview
          creatorName={creatorName}
          age={age}
          city={city}
          distance={distance}
          notification={notification}
          cta={cta}
          videoUrl={videoUrl}
          photoUrl={photoUrl}
          verified={verified}
          online={online}
          topPick={topPick}
          showLike={showLike}
          showNope={showNope}
        />

      </div>

    </div>
  );
}