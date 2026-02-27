import { supabase } from "@/lib/supabaseClient";

export async function fetchAllProfiles() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Error getting current user:", authError);
    return [];
  }

  if (!user) return [];

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, name, age, bio")
    .neq("id", user.id);

  if (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }

  const { data: photos, error: photosError } = await supabase
    .from("profile_photos")
    .select("user_id, url, position");

  if (photosError) {
    console.error("Error fetching photos:", photosError);
  }

  const enriched = profiles.map((p) => ({
    ...p,
    photos:
      photos
        ?.filter((ph) => ph.user_id === p.id)
        .sort((a, b) => a.position - b.position)
        .map((ph) => ph.url) || [],
  }));

  return enriched;
}

export async function getProfileWithPhotos(userId: string) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, name, age, bio")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  const { data: photos, error: photosError } = await supabase
    .from("profile_photos")
    .select("url, position")
    .eq("user_id", userId);

  if (photosError) {
    console.error("Error fetching profile photos:", photosError);
  }

  return {
    ...profile,
    photos:
      photos
        ?.sort((a, b) => a.position - b.position)
        .map((p) => p.url) || [],
  };
}