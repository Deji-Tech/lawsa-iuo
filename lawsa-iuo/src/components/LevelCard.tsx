"use client";

import { motion } from "framer-motion";
import { Scale, BookOpen, GraduationCap, Gavel, ScrollText, ArrowRight } from "lucide-react";

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-500 hover:border-brand/50 hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-1"
    >
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors duration-500 group-hover:bg-brand group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand/20">
            {icon}
          </div>
          <span className="font-serif text-3xl font-medium text-foreground/20 transition-colors duration-500 group-hover:text-brand/20">{level}</span>
        </div>

        <h3 className="mb-2 font-serif text-xl text-foreground transition-colors group-hover:text-primary">{title}</h3>

        <div className="mb-6 h-px w-10 bg-border transition-all duration-500 group-hover:w-full group-hover:bg-brand/30" />

        <ul className="mb-6 space-y-2 flex-grow">
          {courses.slice(0, 3).map((course) => (
            <li key={course} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-brand/50" />
              {course}
            </li>
          ))}
          {courses.length > 3 && (
            <li className="text-xs font-medium text-muted-foreground/50 pl-3">
              +{courses.length - 3} more modules
            </li>
          )}
        </ul>

        <div className="flex items-center gap-2 text-sm font-semibold text-primary/80 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand">
          View Curriculum <ArrowRight size={16} />
        </div>
      </div>
    </motion.div>
  );
};

export const levelData = [
  {
    level: "100L",
    title: "Foundations of Law",
    courses: ["Legal Methods I & II", "Logic & Philosophy", "Nigerian Peoples & Culture"],
    icon: <BookOpen size={24} />,
  },
  {
    level: "200L",
    title: "Constitutional Foundations",
    courses: ["Constitutional Law", "Law of Contract", "Nigerian Legal System", "Administrative Law"],
    icon: <Scale size={24} />,
  },
  {
    level: "300L",
    title: "Core Legal Disciplines",
    courses: ["Criminal Law", "Law of Torts", "Commercial Law", "Islamic/Customary Law"],
    icon: <Gavel size={24} />,
  },
  {
    level: "400L",
    title: "Advanced Legal Studies",
    courses: ["Land Law", "Equity & Trusts", "Law of Evidence", "Conflict of Laws"],
    icon: <ScrollText size={24} />,
  },
  {
    level: "500L",
    title: "Jurisprudence & Practice",
    courses: ["Jurisprudence & Legal Theory", "Company Law", "Environmental Law", "Long Essay (Project)"],
    icon: <GraduationCap size={24} />,
  },
];

export default LevelCard;
