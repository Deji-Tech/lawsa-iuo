"use client";

import { createClient } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  level: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthError {
  message: string;
  code?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  error: AuthError | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const supabase = createClient();

  const isAuthenticated = !!user;
  const isProfileComplete = !!(
    profile?.full_name && 
    profile?.phone_number && 
    profile?.level
  );

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Profile doesn't exist yet, create it
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const newProfile = {
              id: userId,
              email: userData.user.email || "",
              full_name: userData.user.user_metadata?.full_name || null,
              phone_number: null,
              level: null,
              avatar_url: null,
            };
            
            const { data: createdProfile, error: createError } = await supabase
              .from("profiles")
              .insert(newProfile)
              .select()
              .single();
            
            if (createError) {
              console.error("Error creating profile:", createError);
              return null;
            }
            
            return createdProfile as Profile;
          }
        } else {
          console.error("Error fetching profile:", error);
        }
        return null;
      }

      return data as Profile;
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      return null;
    }
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      setIsLoading(true);
      try {
        const profileData = await fetchProfile(user.id);
        setProfile(profileData);
      } catch (err) {
        console.error("Error refreshing profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, fetchProfile]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setUser(session?.user ?? null);

        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
      if (!mounted) return;

      setUser(session?.user ?? null);

      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        if (mounted) {
          setProfile(profileData);
        }
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError({ message: error.message, code: error.code });
      } else {
        setUser(null);
        setProfile(null);
        setError(null);
      }
    } catch (err) {
      setError({ message: "An unexpected error occurred during sign out" });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated,
        isProfileComplete,
        error,
        signOut,
        refreshProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
