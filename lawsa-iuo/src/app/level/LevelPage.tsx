"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, FileText, Video, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCourses, getQuestions } from "@/lib/api";
import { motion } from "framer-motion";

interface LevelPageProps {
  level: string;
  title: string;
  subtitle: string;
  description: string;
}

export default function LevelPage({ level, title, subtitle, description }: LevelPageProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [coursesData, questionsData] = await Promise.all([
          getCourses(level),
          getQuestions({ level, limit: 1000 })
        ]);
        setCourses(coursesData);
        setTotalQuestions(questionsData.length);
      } catch (error) {
        console.error("Error loading level data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [level]);

  const totalModules = courses.reduce((acc, course) => acc + (course.modules_count || 0), 0);
  const totalWeeks = courses.reduce((acc, course) => acc + (course.duration_weeks || 12), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 bg-gradient-to-br from-brand/5 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs sm:text-sm font-bold text-brand uppercase tracking-wider mb-2 block">{level}</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4 sm:mb-6">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-6 sm:py-8 border-y border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-brand">{courses.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Core Courses</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-brand">{totalModules}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Modules</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-brand">{totalWeeks}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Study Weeks</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-brand">{totalQuestions}+</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Practice Questions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-foreground mb-6 sm:mb-8">Available Courses</h2>
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courses available for {level} yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {courses.map((course) => (
                <div key={course.id} className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border bg-card hover:border-brand/50 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-brand/10 text-brand">
                        <BookOpen size={18} className="sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-brand">{course.code}</span>
                    </div>
                    <Lock size={14} className="sm:w-4 sm:h-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1.5 sm:mb-2">{course.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">{course.description}</p>
                  <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText size={12} className="sm:w-3.5 sm:h-3.5" /> {course.modules_count} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Video size={12} className="sm:w-3.5 sm:h-3.5" /> {course.duration_weeks} weeks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-brand text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold mb-3 sm:mb-4">Ready to Start Learning?</h2>
          <p className="text-white/80 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Access all {level} materials, track your progress, and test your knowledge with our CBT system.
          </p>
          <Link href="/dashboard">
            <Button className="bg-white text-brand hover:bg-white/90 rounded-full px-6 sm:px-8 py-5 sm:py-6 font-bold text-sm sm:text-base">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
