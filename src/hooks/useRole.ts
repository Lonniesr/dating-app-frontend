import { useEffect, useState } from "react";

export function useRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const r = document.cookie
      .split("; ")
      .find((c) => c.startsWith("role="))
      ?.split("=")[1];

    setRole(r || null);
  }, []);

  return role;
}