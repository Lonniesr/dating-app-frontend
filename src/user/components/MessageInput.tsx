import { useEffect, useState } from "react";

interface MessageInputProps {
  onSend: (msg: string) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
}

export default function MessageInput({
  onSend,
  onTypingStart,
  onTypingStop,
}: MessageInputProps) {
  const [text, setText] = useState("");

  // Typing indicator logic
  useEffect(() => {
    if (!text.trim()) {
      onTypingStop?.();
      return;
    }

    onTypingStart?.();

    const timeout = setTimeout(() => {
      onTypingStop?.();
    }, 1200);

    return () => clearTimeout(timeout);
  }, [text, onTypingStart, onTypingStop]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
    onTypingStop?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-black border-t border-white/10">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 p-3 rounded-lg bg-white/10 text-white outline-none"
        placeholder="Type a message..."
      />

      <button
        onClick={handleSend}
        className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold"
      >
        Send
      </button>
    </div>
  );
}
