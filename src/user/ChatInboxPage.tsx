import { Link } from "react-router-dom";

export default function ChatInboxPage() {
  // Later this will come from useUserConversations()
  const conversations = [
    { id: "123", name: "Sofia" },
    { id: "456", name: "Ava" },
  ];

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="space-y-3">
        {conversations.map((c) => (
          <Link
            key={c.id}
            to={`/user/chat/${c.id}`}
            className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}