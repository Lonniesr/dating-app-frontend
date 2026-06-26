import React from "react";

interface UnlockFeatureModalProps {
  open: boolean;
  icon: string;
  title: string;
  description: string;
  benefits: string[];
  buttonText: string;
  onClose: () => void;
  onUnlock: () => void;
}

export default function UnlockFeatureModal({
  open,
  icon,
  title,
  description,
  benefits,
  buttonText,
  onClose,
  onUnlock,
}: UnlockFeatureModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">

      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl">

        <div className="p-8 text-center">

          <div className="text-6xl mb-4">
            {icon}
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            {title}
          </h2>

          <p className="text-white/70 mb-6">
            {description}
          </p>

          <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">

            <div className="mb-5">

  <h3 className="text-lg font-bold text-white">
    Why Verify?
  </h3>

  <p className="text-white/60 text-sm mt-2">
    Verification helps keep LynQ full of real people while unlocking
    every premium dating feature.
  </p>

</div>

            <ul className="space-y-2">

              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="text-white/80 flex items-center gap-2"
                >
<span className="text-yellow-400 text-lg">
  ✨
</span>
                  {benefit}
                </li>
              ))}

            </ul>

          </div>

          <button
  onClick={onUnlock}
  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:brightness-110 text-black font-bold py-3 rounded-xl transition"
>
  {buttonText}
</button>

          <button
            onClick={onClose}
            className="w-full mt-3 text-white/60 hover:text-white transition"
          >
            Maybe Later
          </button>

        </div>

      </div>

    </div>
  );
}