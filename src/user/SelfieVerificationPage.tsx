import { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { submitSelfieVerification } from "./services/selfieVerificationService";

export default function SelfieVerificationPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     CAMERA
  ========================= */

  const startCamera = async () => {
    try {
      console.log("🎥 Starting camera...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      console.log("✅ Camera started");
    } catch (err) {
      console.error("❌ Camera error:", err);
      alert("Camera failed to start");
    }
  };

  const takePhoto = () => {
    console.log("📸 Capturing photo...");

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      console.warn("⚠️ Video or canvas missing");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.warn("⚠️ No canvas context");
      return;
    }

    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    console.log("✅ Photo captured");
    setImage(dataUrl);
  };

  /* =========================
     SUBMIT FLOW (DEBUG VERSION)
  ========================= */

  const handleSubmit = async () => {
    if (!image) return;

    setLoading(true);

    try {
      console.log("1️⃣ Converting base64 → blob...");
      const blob = await (await fetch(image)).blob();
      console.log("✅ Blob created:", blob.size, "bytes");

      const fileName = `selfie-${Date.now()}.jpg`;

      console.log("2️⃣ Uploading to Supabase...");
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("selfies")
        .upload(fileName, blob);

      if (uploadError) {
        console.error("❌ UPLOAD ERROR:", uploadError);
        alert("Upload failed: " + uploadError.message);
        return;
      }

      console.log("✅ Upload success:", uploadData);

      console.log("3️⃣ Getting public URL...");
      const { data: publicUrlData } = supabase.storage
        .from("selfies")
        .getPublicUrl(fileName);

      const selfieUrl = publicUrlData.publicUrl;

      console.log("✅ Public URL:", selfieUrl);

      console.log("4️⃣ Sending to backend...");
      const res = await submitSelfieVerification(selfieUrl);

      console.log("✅ API RESPONSE:", res);

      alert("Verification submitted ✅");
      setImage(null);

    } catch (err: any) {
      console.error("🔥 FULL ERROR:", err);
      console.error("🔥 RESPONSE:", err?.response?.data);

      alert(
        err?.response?.data?.message ||
        err?.message ||
        "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Selfie Verification
      </h1>

      <div className="bg-white/5 p-4 rounded-xl border border-white/10">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg mb-4"
        />

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex gap-2 mb-4">
          <button
            onClick={startCamera}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Start Camera
          </button>

          <button
            onClick={takePhoto}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Capture
          </button>
        </div>

        {image && (
          <div>
            <img
              src={image}
              alt="preview"
              className="w-full rounded-lg mb-4"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-yellow-600 py-3 rounded font-semibold"
            >
              {loading ? "Submitting..." : "Submit Verification"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}