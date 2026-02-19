"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getCourses, 
  getActiveCBTProgress, 
  getCBTProgressByCourse,
  deleteCBTProgress,
  Course 
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  BookOpenIcon, 
  PlayIcon, 
  Clock01Icon, 
  AlertCircleIcon,
  Loading03Icon,
  ArrowRight01Icon,
  Delete02Icon,
  Award01Icon
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

interface CBTPageProps {
  onStartCBT: (courseId: string, resumeProgress?: any) => void;
}

export default function CBTSelectionPage({ onStartCBT }: CBTPageProps) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeProgress, setActiveProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [user, profile?.level]);

  const loadData = async () => {
    if (!user || !profile?.level) return;
    
    try {
      setIsLoading(true);
      
      // Load courses for user's level
      const coursesData = await getCourses(profile.level);
      setCourses(coursesData);
      
      // Check for active CBT progress
      const progress = await getActiveCBTProgress(user.id);
      if (progress) {
        setActiveProgress(progress);
      }
    } catch (error) {
      console.error("Error loading CBT data:", error);
      toast.error("Failed to load CBT data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseSelect = async (courseId: string) => {
    if (!user) return;
    
    setSelectedCourse(courseId);
    
    // Check if there's existing progress for this course
    const existingProgress = await getCBTProgressByCourse(user.id, courseId);
    
    if (existingProgress) {
      // Ask if they want to resume or start fresh
      const shouldResume = window.confirm(
        `You have an incomplete CBT session for this course.\n\n` +
        `Question ${existingProgress.current_question_index + 1} of ${existingProgress.questions.length}\n` +
        `Time remaining: ${Math.floor(existingProgress.time_remaining_seconds / 60)} minutes\n\n` +
        `Would you like to resume where you left off?\n\n` +
        `Click OK to resume, or Cancel to start fresh.`
      );
      
      if (shouldResume) {
        onStartCBT(courseId, existingProgress);
      } else {
        // Delete old progress and start fresh
        await deleteCBTProgress(existingProgress.id);
        onStartCBT(courseId, null);
      }
    } else {
      // No existing progress, start fresh
      onStartCBT(courseId, null);
    }
  };

  const handleResumeCBT = () => {
    if (activeProgress) {
      onStartCBT(activeProgress.course_id, activeProgress);
    }
  };

  const handleDeleteProgress = async () => {
    if (!activeProgress) return;
    
    const confirm = window.confirm(
      "Are you sure you want to delete your incomplete CBT session? This action cannot be undone."
    );
    
    if (confirm) {
      try {
        await deleteCBTProgress(activeProgress.id);
        setActiveProgress(null);
        toast.success("CBT session deleted");
      } catch (error) {
        toast.error("Failed to delete session");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <HugeiconsIcon icon={Loading03Icon} className="w-12 h-12 text-brand" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand/10 text-brand mb-4">
          <HugeiconsIcon icon={Award01Icon} className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          CBT Center
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Select a course to start your Computer Based Test. Your progress will be automatically saved.
        </p>
      </motion.div>

      {/* Active CBT Session Card */}
      <AnimatePresence>
        {activeProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <Card className="p-6 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <HugeiconsIcon icon={Clock01Icon} className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Incomplete CBT Session</h3>
                    <p className="text-sm text-muted-foreground">
                      You're on question {activeProgress.current_question_index + 1} of {activeProgress.questions.length} • 
                      {Math.floor(activeProgress.time_remaining_seconds / 60)} minutes remaining
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    onClick={handleResumeCBT}
                    className="flex-1 md:flex-none bg-brand hover:bg-brand-dim"
                  >
                    <HugeiconsIcon icon={PlayIcon} className="w-4 h-4 mr-2" />
                    Resume CBT
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDeleteProgress}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Selection */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <HugeiconsIcon icon={BookOpenIcon} className="w-5 h-5 text-brand" />
          Choose a Course
        </h2>

        {courses.length === 0 ? (
          <Card className="p-8 text-center">
            <HugeiconsIcon icon={AlertCircleIcon} className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No courses available for {profile?.level} yet.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedCourse === course.id
                      ? 'border-brand ring-2 ring-brand/20'
                      : 'border-border hover:border-brand/50'
                  }`}
                  onClick={() => handleCourseSelect(course.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-brand bg-brand/10 px-2 py-1 rounded">
                          {course.code}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {course.modules_count} modules
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-brand/10">
                        <HugeiconsIcon 
                          icon={ArrowRight01Icon} 
                          className="w-5 h-5 text-muted-foreground" 
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-xl bg-muted/50 border border-border"
      >
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <HugeiconsIcon icon={AlertCircleIcon} className="w-4 h-4 text-brand" />
          How it works
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Select a course to start a CBT session</li>
          <li>Each test has 20 questions and 30 minutes</li>
          <li>Your progress is automatically saved after each question</li>
          <li>If you leave, you can resume where you left off</li>
          <li>Complete the test to see your score and review answers</li>
        </ul>
      </motion.div>
    </div>
  );
}
