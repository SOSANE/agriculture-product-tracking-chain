import { useState, useEffect } from "react";
import { User } from "../types";

export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const verifyResponse = await fetch("/auth/verify-session", {
          credentials: "include",
        });

        if (!verifyResponse.ok) {
          throw new Error("Session verification failed");
        }

        const verifyData = await verifyResponse.json();

        if (!verifyData.success) {
          throw new Error(verifyData.message || "Session invalid");
        }

        const profileResponse = await fetch("/api/profile", {
          credentials: "include",
        });

        if (!profileResponse.ok) {
          throw new Error("Profile load failed");
        }

        setUser(await profileResponse.json());
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load profile"),
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return { user, loading, error };
};
