import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/auth/ProtectedRoute";

const NotePage = () => {
    const { id, courseId } = useParams();
    const navigate = useNavigate();

    // Mock content for demonstration
    const courseName = decodeURIComponent(courseId || "Course");

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <Navbar />

                <div className="container mx-auto max-w-4xl px-5 py-24 sm:px-6 lg:px-8">
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft size={16} />
                        Back to Curriculum
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                                <ShieldCheck size={12} />
                                Premium Content
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock size={12} />
                                15 min read
                            </span>
                        </div>

                        <h1 className="mb-6 font-serif text-4xl leading-tight text-foreground md:text-5xl">
                            {courseName}: Introductory Concepts
                        </h1>

                        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                            <p className="lead text-xl text-muted-foreground">
                                This is a protected lecture note accessible only to authenticated law students.
                                Below is a comprehensive overview of the fundamental principles regarding {courseName}.
                            </p>

                            <div className="my-8 h-px w-full bg-border" />

                            <h2 className="text-foreground">1. Introduction to Jurisprudence</h2>
                            <p>
                                Law, in its generic sense, is a body of rules of action or conduct prescribed by controlling authority,
                                and having binding legal force. That which must be obeyed and followed by citizens subject to
                                sanctions or legal consequence is a law.
                            </p>

                            <div className="my-8 rounded-xl border border-l-4 border-l-brand bg-secondary/50 p-6">
                                <p className="m-0 font-medium italic text-foreground">
                                    "The life of the law has not been logic: it has been experience." — Oliver Wendell Holmes Jr.
                                </p>
                            </div>

                            <h2 className="text-foreground">2. Legal Systems in Nigeria</h2>
                            <p>
                                The Nigerian legal system is modeled after the English common law.
                                It includes English Common Law, doctrines of equity, and statutes of general application.
                            </p>

                            <h2 className="text-foreground">3. Key Takeaways</h2>
                            <ul>
                                <li>Understanding the hierarchy of courts.</li>
                                <li>The role of the constitution as the grand norm.</li>
                                <li>Distinction between civil and criminal liability.</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>

                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default NotePage;
