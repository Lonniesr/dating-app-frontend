import { FaMars, FaVenus, FaGenderless } from "react-icons/fa";

type Props = {
  gender?: string | null;
  className?: string;
};

export default function GenderIcon({ gender, className }: Props) {
  if (!gender) return null;

  const g = gender.toLowerCase();

  if (g === "male") {
    return <FaMars className={className ?? "text-blue-400"} />;
  }

  if (g === "female") {
    return <FaVenus className={className ?? "text-pink-400"} />;
  }

  return <FaGenderless className={className ?? "text-white/50"} />;
}