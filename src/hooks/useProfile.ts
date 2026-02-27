import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useSupabaseUser } from "./useSupabaseUser";

export function useProfile() {
  const { userId, loading: userLoading } = useSupabaseUser();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    async function loadProfile() {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Profile load error:", error);
        setProfile(null);
      } else {
        setProfile(data);
      }

      setLoading(false);
    }

    loadProfile();
  }, [userId, userLoading]);

  return { profile, loading };
}