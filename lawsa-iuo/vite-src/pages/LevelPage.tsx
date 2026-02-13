import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import { levelData } from "@/components/LevelCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LevelPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const level = levelData.find(
    (l) => l.level.replace("L", "").toLowerCase() === id
  );

  if (!level) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Level not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-dark-surface py-14 sm:py-16 md:py-20">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-sm text-dark-surface-foreground/60 transition-colors hover:text-dark-surface-foreground"
          >
            <ArrowLeft size={16} />
            Back to Home
          </motion.button>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-2 text-sm font-medium uppercase tracking-widest text-dark-surface-foreground/50"
          >
            {level.level} Curriculum
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-serif text-3xl text-dark-surface-foreground sm:text-4xl md:text-5xl"
          >
            {level.title}
          </motion.h1>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {level.courses.map((course, i) => (
              <Link
                key={course}
                to={`/level/${id}/note/${encodeURIComponent(course)}`}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-brand/50 hover:shadow-lg hover:shadow-brand/5 cursor-pointer"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors group-hover:bg-brand group-hover:text-white">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-foreground group-hover:text-brand transition-colors">{course}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">Click to read lecture notes</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LevelPage;
