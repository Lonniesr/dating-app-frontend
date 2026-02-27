export default function UserPagination({ page, totalPages, setPage }) {
  function prev() {
    if (page > 1) setPage(page - 1);
  }

  function next() {
    if (page < totalPages) setPage(page + 1);
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-6">

      {/* PREV */}
      <button
        onClick={prev}
        disabled={page === 1}
        className={`
          px-4 py-2 rounded bg-[#111] border border-yellow-500/20 
          text-gray-300 hover:bg-[#1a1a1a] transition
          ${page === 1 ? "opacity-40 cursor-not-allowed" : ""}
        `}
      >
        Prev
      </button>

      {/* PAGE NUMBER */}
      <div className="text-gray-300">
        Page <span className="text-yellow-400">{page}</span> of{" "}
        <span className="text-yellow-400">{totalPages}</span>
      </div>

      {/* NEXT */}
      <button
        onClick={next}
        disabled={page === totalPages}
        className={`
          px-4 py-2 rounded bg-[#111] border border-yellow-500/20 
          text-gray-300 hover:bg-[#1a1a1a] transition
          ${page === totalPages ? "opacity-40 cursor-not-allowed" : ""}
        `}
      >
        Next
      </button>

    </div>
  );
}
