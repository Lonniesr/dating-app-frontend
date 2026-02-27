import { create } from "zustand";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface MessageState {
  thread: Message[];
  loading: boolean;
  loadThread: (messages: Message[]) => void;
  addMessage: (msg: Message) => void;
  clearThread: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  thread: [],
  loading: false,

  loadThread: (messages) => set({ thread: messages }),

  addMessage: (msg) =>
    set((state) => ({
      thread: [...state.thread, msg],
    })),

  clearThread: () => set({ thread: [] }),
}));