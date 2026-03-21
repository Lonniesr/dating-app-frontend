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
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setImage(dataUrl);
  };

  /* =========================
     SUBMIT FLOW
  ========================= */

  const handleSubmit = async () => {
    if (!image) return;

    setLoading(true);

    try {
      const blob = await (await fetch(image)).blob();

      const fileName = `selfie-${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from("selfies")
        .upload(fileName, blob);

      if (error) throw error;

      const { data } = supabase.storage
        .from("selfies")
        .getPublicUrl(fileName);

      const selfieUrl = data.publicUrl;

      await submitSelfieVerification(selfieUrl);

      alert("Verification submitted ✅");
      setImage(null);

    } catch (err) {
      console.error(err);
      alert("Verification failed ❌");
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