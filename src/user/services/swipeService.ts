import { supabase } from "@/lib/supabaseClient";

export async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting current user:", error);
    return null;
  }

  return user?.id ?? null;
}

export async function recordSwipe(targetId: string, direction: "left" | "right") {
  const userId = await getCurrentUserId();

  if (!userId) {
    console.error("Cannot record swipe: no authenticated user");
    return;
  }

  const { error } = await supabase.from("swipes").insert({
    swiper_id: userId,
    target_id: targetId,
    direction,
  });

  if (error) console.error("Swipe error:", error);
}