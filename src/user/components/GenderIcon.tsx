type Props = {
  gender?: string | null;
  className?: string;
};

export default function GenderIcon({ gender, className }: Props) {
  // Minimal placeholder icon/text so the app compiles
  if (!gender) return null;
  return <span className={className} aria-label={`gender: ${gender}`}>{gender}</span>;
}