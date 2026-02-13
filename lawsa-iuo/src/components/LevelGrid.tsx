"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LevelCard, { levelData } from "@/components/LevelCard";

const LevelGrid = () => {
  const router = useRouter();

  return (
    <section id="levels" className="bg-secondary/30 py-20 sm:py-24 md:py-32">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-brand">The Curriculum</span>
          <h2 className="mb-4 font-serif text-3xl text-foreground sm:text-4xl md:text-5xl">
            Choose Your Level
          </h2>
          <p className="mx-auto max-w-lg text-lg text-muted-foreground">
            Select your academic level to access curated lecture notes and study materials.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-center">
          {/* Note: changed to 3 cols max for better card width */}
          {levelData.map((level, i) => (
            <LevelCard
              key={level.level}
              {...level}
              index={i}
              onClick={() => router.push(`/level/${level.level.replace("L", "").toLowerCase()}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LevelGrid;
