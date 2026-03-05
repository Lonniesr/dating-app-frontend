import { useContext } from "react";
import { UserAuthContext } from "./UserAuthContext";
export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) {
    throw new Error("useUserAuth must be used within UserAuthProvider");
  }
  return ctx;
}