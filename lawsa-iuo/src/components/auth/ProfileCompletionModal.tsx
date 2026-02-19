"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserAccountIcon,
  TelephoneIcon,
  GraduationScrollIcon,
  CameraIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  full_name?: string | null;
  phone_number?: string | null;
  level?: string | null;
  avatar_url?: string | null;
}

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  level?: string;
  general?: string;
}

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onComplete: () => void;
  existingProfile?: Profile | null;
  mode?: "complete" | "edit";
}

const levels = ["100L", "200L", "300L", "400L", "500L"];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ProfileCompletionModal({
  isOpen,
  onClose,
  userId,
  onComplete,
  existingProfile,
  mode = "complete",
}: ProfileCompletionModalProps) {
  const [fullName, setFullName] = useState(existingProfile?.full_name || "");
  const [phoneNumber, setPhoneNumber] = useState(existingProfile?.phone_number || "");
  const [level, setLevel] = useState(existingProfile?.level || "");
  const [avatarUrl, setAvatarUrl] = useState(existingProfile?.avatar_url || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    fullName: false,
    phoneNumber: false,
    level: false,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Update state when existingProfile changes
  useEffect(() => {
    if (existingProfile) {
      setFullName(existingProfile.full_name || "");
      setPhoneNumber(existingProfile.phone_number || "");
      setLevel(existingProfile.level || "");
      setAvatarUrl(existingProfile.avatar_url || "");
    }
  }, [existingProfile]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }
    
    if (!level) {
      newErrors.level = "Please select your academic level";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors({ general: "Please upload a valid image file (JPEG, PNG, or WebP)" });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors({ general: "File size must be less than 5MB" });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrors({});

    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || 'jpg';
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setErrors({ general: "Failed to upload image. Please try again." });
        setIsUploading(false);
        return;
      }

      setUploadProgress(100);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      setErrors({ general: "An unexpected error occurred while uploading" });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched({
      fullName: true,
      phoneNumber: true,
      level: true,
    });
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          full_name: fullName.trim(),
          phone_number: phoneNumber.trim(),
          level: level,
          avatar_url: avatarUrl || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error("Error updating profile:", error);
        setErrors({ general: "Failed to save profile. Please try again." });
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onComplete();
      onClose();
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrors({ general: "An unexpected error occurred" });
      setIsLoading(false);
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
  };

  const modalTitle = mode === "edit" ? "Edit Profile" : "Complete Your Profile";
  const modalSubtitle = mode === "edit" 
    ? "Update your profile information" 
    : "Help us personalize your learning experience";
  const submitButtonText = mode === "edit" ? "Save Changes" : "Complete Profile";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={!isLoading ? onClose : undefined}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-card border border-border rounded-2xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border bg-gradient-to-r from-brand/5 to-transparent">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                    {modalTitle}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {modalSubtitle}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-5 sm:p-6">
                <AnimatePresence mode="wait">
                  {errors.general && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2"
                    >
                      <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{errors.general}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center cursor-pointer transition-all overflow-hidden ${
                          avatarUrl 
                            ? 'ring-4 ring-brand/20' 
                            : 'bg-brand/10 border-2 border-dashed border-brand/30 hover:bg-brand/20'
                        } ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <HugeiconsIcon
                            icon={CameraIcon}
                            className="w-8 h-8 sm:w-10 sm:h-10 text-brand"
                          />
                        )}
                        
                        {!isUploading && (
                          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-medium">
                              {avatarUrl ? 'Change' : 'Upload'}
                            </span>
                          </div>
                        )}
                        
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <HugeiconsIcon icon={Loading03Icon} className="w-8 h-8 text-white" />
                            </motion.div>
                          </div>
                        )}
                      </div>
                      
                      {avatarUrl && !isUploading && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="absolute -bottom-1 -right-1 p-1.5 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors shadow-lg"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    
                    <p className="text-xs text-muted-foreground mt-3">
                      {isUploading 
                        ? `Uploading... ${uploadProgress}%` 
                        : avatarUrl 
                          ? "Click to change photo" 
                          : "Click to upload photo (max 5MB)"
                      }
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <HugeiconsIcon
                        icon={UserAccountIcon}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                      />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) validateForm();
                        }}
                        onBlur={() => handleBlur('fullName')}
                        disabled={isLoading}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all text-base disabled:opacity-50 ${
                          errors.fullName && touched.fullName
                            ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                            : 'border-border focus:border-brand focus:ring-brand/20'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <AnimatePresence>
                      {errors.fullName && touched.fullName && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-destructive text-xs mt-1.5 ml-1"
                        >
                          {errors.fullName}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <HugeiconsIcon
                        icon={TelephoneIcon}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                      />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          if (errors.phoneNumber) validateForm();
                        }}
                        onBlur={() => handleBlur('phoneNumber')}
                        disabled={isLoading}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all text-base disabled:opacity-50 ${
                          errors.phoneNumber && touched.phoneNumber
                            ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                            : 'border-border focus:border-brand focus:ring-brand/20'
                        }`}
                        placeholder="e.g., +234 801 234 5678"
                      />
                    </div>
                    <AnimatePresence>
                      {errors.phoneNumber && touched.phoneNumber && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-destructive text-xs mt-1.5 ml-1"
                        >
                          {errors.phoneNumber}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Level Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Academic Level
                    </label>
                    <div className="relative">
                      <HugeiconsIcon
                        icon={GraduationScrollIcon}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                      />
                      <select
                        value={level}
                        onChange={(e) => {
                          setLevel(e.target.value);
                          if (errors.level) validateForm();
                        }}
                        onBlur={() => handleBlur('level')}
                        disabled={isLoading}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all appearance-none text-base disabled:opacity-50 cursor-pointer ${
                          errors.level && touched.level
                            ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                            : 'border-border focus:border-brand focus:ring-brand/20'
                        }`}
                      >
                        <option value="">Select your level</option>
                        {levels.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <AnimatePresence>
                      {errors.level && touched.level && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-destructive text-xs mt-1.5 ml-1"
                        >
                          {errors.level}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading || isUploading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-brand hover:bg-brand-dim text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base mt-6"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5" />
                        {submitButtonText}
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
