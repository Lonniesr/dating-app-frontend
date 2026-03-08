type SwipeCardProps = {
  person: {
    name: string;
    age: number;
    photo: string;
  };
};

export default function SwipeCard({ person }: SwipeCardProps) {
  return (
    <div className="bg-[#111] rounded-2xl overflow-hidden shadow-xl border border-white/10 mb-6">
      
      {/* Show photo only if it exists */}
      {person.photo ? (
        <img
          src={person.photo}
          alt={person.name}
          className="w-full h-80 object-cover"
        />
      ) : (
        <div className="w-full h-80 flex items-center justify-center bg-[#222] text-gray-400">
          No Photo
        </div>
      )}

      <div className="p-4">
        <h2 className="text-xl font-bold">
          {person.name}, {person.age}
        </h2>
      </div>
    </div>
  );
}