import { useState } from "react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
};

export default function ProgressiveImage({
  src,
  alt = "",
  className = "",
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blurred preview */}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover blur-xl scale-110 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      />

      {/* Main image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}