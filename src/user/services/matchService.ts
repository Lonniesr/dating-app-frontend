import { supabase } from "../../lib/supabaseClient";
import { getCurrentUserId } from "../services/swipeService";

export async function saveMatch(otherUserId: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error("Cannot save match: no authenticated user");
    return;
  }

  const user1 = userId < otherUserId ? userId : otherUserId;
  const user2 = userId < otherUserId ? otherUserId : userId;

  const { error } = await supabase.from("matches").insert({
    user1,
    user2,
  });

  if (error) console.error("Match error:", error);
}

export async function fetchMatches() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .or(`user1.eq.${userId},user2.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching matches:", error);
    return [];
  }

  return data || [];
}