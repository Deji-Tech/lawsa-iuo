"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  BookOpen01Icon, 
  JusticeScale01Icon, 
  JudgeIcon, 
  File01Icon, 
  GraduationScrollIcon,
  ArrowRight01Icon 
} from "@hugeicons/core-free-icons";

interface LevelCardProps {
  level: string;
  title: string;
  courses: string[];
  icon: React.ReactNode;
  index: number;
  onClick: () => void;
}

const LevelCard = ({ level, title, courses, icon, index, onClick }: LevelCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm transition-all duration-500 hover:border-brand/50 hover:shadow-2xl hover:shadow-brand/10"
    >
      {/* Hover Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Shimmer Effect on Hover */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4 sm:mb-6 flex items-start justify-between">
          <motion.div 
            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-secondary text-foreground transition-all duration-500 group-hover:bg-brand group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand/20"
            whileHover={{ rotate: 5, scale: 1.05 }}
          >
            {icon}
          </motion.div>
          <span className="font-display text-2xl sm:text-3xl font-medium text-foreground/20 transition-colors duration-500 group-hover:text-brand/30">{level}</span>
        </div>

        <h3 className="mb-1.5 sm:mb-2 font-display text-lg sm:text-xl text-foreground transition-colors group-hover:text-brand">{title}</h3>

        <motion.div 
          className="mb-4 sm:mb-6 h-px bg-border"
          initial={{ width: "2.5rem" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.4 }}
        />

        <ul className="mb-4 sm:mb-6 space-y-1.5 sm:space-y-2 flex-grow">
          {courses.slice(0, 3).map((course, i) => (
            <motion.li 
              key={course} 
              className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand/60 flex-shrink-0" />
              <span className="line-clamp-1">{course}</span>
            </motion.li>
          ))}
          {courses.length > 3 && (
            <li className="text-[10px] sm:text-xs font-medium text-muted-foreground/50 pl-3">
              +{courses.length - 3} more modules
            </li>
          )}
        </ul>

        <motion.div 
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary/80 transition-all duration-300 group-hover:text-brand"
          whileHover={{ x: 5 }}
        >
          <span className="line-clamp-1">View Curriculum</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1 flex-shrink-0" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export const levelData = [
  {
    level: "100L",
    title: "Foundations of Law",
    courses: ["Legal Methods I & II", "Logic & Philosophy", "Nigerian Peoples & Culture"],
    icon: <HugeiconsIcon icon={BookOpen01Icon} className="w-5 h-5 sm:w-6 sm:h-6" />,
  },
  {
    level: "200L",
    title: "Constitutional Foundations",
    courses: ["Constitutional Law", "Law of Contract", "Nigerian Legal System", "Administrative Law"],
    icon: <HugeiconsIcon icon={JusticeScale01Icon} className="w-5 h-5 sm:w-6 sm:h-6" />,
  },
  {
    level: "300L",
    title: "Core Legal Disciplines",
    courses: ["Criminal Law", "Law of Torts", "Commercial Law", "Islamic/Customary Law"],
    icon: <HugeiconsIcon icon={JudgeIcon} className="w-5 h-5 sm:w-6 sm:h-6" />,
  },
  {
    level: "400L",
    title: "Advanced Legal Studies",
    courses: ["Land Law", "Equity & Trusts", "Law of Evidence", "Conflict of Laws"],
    icon: <HugeiconsIcon icon={File01Icon} className="w-5 h-5 sm:w-6 sm:h-6" />,
  },
  {
    level: "500L",
    title: "Jurisprudence & Practice",
    courses: ["Jurisprudence & Legal Theory", "Company Law", "Environmental Law", "Long Essay (Project)"],
    icon: <HugeiconsIcon icon={GraduationScrollIcon} className="w-5 h-5 sm:w-6 sm:h-6" />,
  },
];

export default LevelCard;
