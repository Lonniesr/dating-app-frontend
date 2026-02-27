export default function UserSearchBar({ search, setSearch }) {
  return (
    <div className="w-full">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users…"
        className="
          w-full px-4 py-3 rounded-lg bg-[#111] text-gray-200 
          border border-yellow-500/20 placeholder-gray-500
          focus:outline-none focus:border-yellow-400
          shadow-inner
        "
      />
    </div>
  );
}
