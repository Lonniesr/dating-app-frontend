import { useEffect, useState } from "react";
import { apiClient } from "../../services/apiClient";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface UserNote {
  id: string;
  text: string;
  adminName: string;
  timestamp: string;
}

interface UserNotesProps {
  userId: string;
}

export default function UserNotes({ userId }: UserNotesProps) {
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    loadNotes();
  }, [userId]);

  async function loadNotes() {
    try {
      setLoading(true);
      const res = await apiClient.get(`/admin/users/${userId}/notes`);
      const payload = (res as any)?.data ?? res;
      setNotes(payload.notes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addNote() {
    if (!newNote.trim()) return;

    try {
      const res = await apiClient.post(`/admin/users/${userId}/notes`, {
        text: newNote,
      });

      const payload = (res as any)?.data ?? res;
      setNotes([payload.note, ...notes]);
      setNewNote("");
    } catch (err) {
      console.error(err);
    }
  }

  async function saveEdit(id: string) {
    try {
      const res = await apiClient.put(`/admin/users/${userId}/notes/${id}`, {
        text: editingText,
      });

      const payload = (res as any)?.data ?? res;

      setNotes(notes.map((n) => (n.id === id ? payload.note : n)));
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteNote(id: string) {
    try {
      await apiClient.delete(`/admin/users/${userId}/notes/${id}`);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-[#111] p-4 rounded-lg border border-yellow-500/10">
      <div className="text-gray-300 font-medium mb-3">Admin Notes</div>

      {/* ADD NOTE */}
      <div className="flex gap-2 mb-4">
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note…"
          className="
            flex-1 px-3 py-2 rounded bg-[#1a1a1a] text-gray-200 
            border border-yellow-500/20 placeholder-gray-500
            focus:outline-none focus:border-yellow-400
          "
        />
        <button
          onClick={addNote}
          className="
            px-3 py-2 rounded bg-yellow-500 text-black 
            hover:bg-yellow-400 transition
          "
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* NOTES LIST */}
      {loading ? (
        <div className="text-gray-500">Loading notes…</div>
      ) : notes.length === 0 ? (
        <div className="text-gray-500">No notes yet</div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-3 rounded bg-[#1a1a1a] border border-yellow-500/10"
            >
              {/* EDIT MODE */}
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="
                      w-full px-3 py-2 rounded bg-[#111] text-gray-200 
                      border border-yellow-500/20 focus:border-yellow-400
                    "
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(note.id)}
                      className="px-3 py-1 bg-yellow-500 text-black rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingText("");
                      }}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-gray-200">{note.text}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {note.adminName} • {note.timestamp}
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => {
                        setEditingId(note.id);
                        setEditingText(note.text);
                      }}
                      className="text-yellow-400 hover:text-yellow-300 transition"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
