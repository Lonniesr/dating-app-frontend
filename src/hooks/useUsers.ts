import { useState, useEffect } from "react";

export type User = {
  id: string;
  name: string;
  status: "pending" | "approved" | "rejected";
};

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(stored);
  }, []);

  const save = (updated: User[]) => {
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  const approveUser = (id: string) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, status: "approved" } : u
    );
    save(updated);
  };

  const rejectUser = (id: string) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, status: "rejected" } : u
    );
    save(updated);
  };

  const pending = users.filter((u) => u.status === "pending");
  const approved = users.filter((u) => u.status === "approved");
  const rejected = users.filter((u) => u.status === "rejected");

  return {
    users,
    pending,
    approved,
    rejected,
    approveUser,
    rejectUser,
  };
}