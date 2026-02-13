import { SignIn } from "@clerk/clerk-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-24">
                <SignIn
                    routing="path"
                    path="/login"
                    signUpUrl="/signup"
                    appearance={{
                        elements: {
                            formButtonPrimary: "bg-brand hover:bg-brand-dim text-sm normal-case",
                            card: "shadow-2xl border border-border/50 backdrop-blur-sm bg-card/50",
                            headerTitle: "font-serif text-2xl text-foreground",
                            headerSubtitle: "text-muted-foreground",
                        }
                    }}
                />
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;
