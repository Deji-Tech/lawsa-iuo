"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserAccountIcon,
  Logout01Icon,
  Settings01Icon,
  TelephoneIcon,
  GraduationScrollIcon,
  Edit01Icon,
  DashboardSquare01Icon,
  Cancel01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ProfileCompletionModal from "./ProfileCompletionModal";

export default function UserButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { user, profile, refreshProfile, isProfileComplete } = useAuth();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
      }
      setIsOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Unexpected sign out error:", err);
    } finally {
      setIsSigningOut(false);
    }
  };

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = (): string => {
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return "User";
  };

  const getDisplayLevel = (): string => {
    if (profile?.level) return profile.level;
    return "Level not set";
  };

  return (
    <>
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1 pr-2 sm:pr-3 rounded-full bg-muted/50 hover:bg-muted transition-all border border-border/50 hover:border-border"
        >
          <div className="relative">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-sm overflow-hidden ring-2 ring-white/50">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{getInitials(profile?.full_name)}</span>
              )}
            </div>
            {!isProfileComplete && (
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-foreground leading-tight max-w-[100px] truncate">
              {getDisplayName()}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {getDisplayLevel()}
            </p>
          </div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Profile Header */}
                <div className="p-4 sm:p-5 bg-gradient-to-br from-brand/10 via-brand/5 to-transparent border-b border-border">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative">
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg sm:text-xl overflow-hidden ring-4 ring-white/20 flex-shrink-0">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.full_name || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{getInitials(profile?.full_name)}</span>
                        )}
                      </div>
                      {!isProfileComplete && (
                        <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-amber-500 text-white text-[8px] font-bold rounded-full">
                          !
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-base sm:text-lg text-foreground truncate">
                        {getDisplayName()}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">{profile?.email || user?.email}</p>
                      <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-brand/10 text-brand text-xs font-medium">
                        <HugeiconsIcon icon={GraduationScrollIcon} className="w-3 h-3" />
                        {getDisplayLevel()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Details & Actions */}
                <div className="p-2 sm:p-3">
                  {/* Phone Number */}
                  {profile?.phone_number && (
                    <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-muted/50 mb-2">
                      <HugeiconsIcon icon={TelephoneIcon} className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">{profile.phone_number}</span>
                    </div>
                  )}
                  
                  {/* Incomplete Profile Warning */}
                  {!isProfileComplete && (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setIsOpen(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm mb-2"
                    >
                      <HugeiconsIcon icon={Edit01Icon} className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">Complete your profile</p>
                        <p className="text-xs opacity-80">Add missing information</p>
                      </div>
                    </motion.button>
                  )}

                  <div className="h-px bg-border my-2" />

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-sm"
                    >
                      <HugeiconsIcon icon={DashboardSquare01Icon} className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">Dashboard</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-sm text-left"
                    >
                      <HugeiconsIcon icon={UserAccountIcon} className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">Edit Profile</span>
                    </button>

                    <div className="h-px bg-border my-2" />

                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors text-sm text-left disabled:opacity-50"
                    >
                      {isSigningOut ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 flex-shrink-0" />
                          </motion.div>
                          <span>Signing out...</span>
                        </>
                      ) : (
                        <>
                          <HugeiconsIcon icon={Logout01Icon} className="w-4 h-4 flex-shrink-0" />
                          <span>Sign Out</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userId={user?.id || ""}
        onComplete={refreshProfile}
        existingProfile={profile}
        mode={isProfileComplete ? "edit" : "complete"}
      />
    </>
  );
}
