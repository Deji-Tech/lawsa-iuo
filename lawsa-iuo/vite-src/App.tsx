import { ComponentType, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SteveFAB from "@/components/SteveFAB";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load pages for performance code splitting
const Index = lazy(() => import("./pages/Index"));
const LevelPage = lazy(() => import("./pages/LevelPage"));
const NotePage = lazy(() => import("./pages/NotePage"));
const CBTPage = lazy(() => import("./pages/CBTPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

import { useAuth } from "@clerk/clerk-react";
import ProtectedRoute from "./auth/ProtectedRoute";

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-brand" />
  </div>
);

const AppContent = () => {
  const { isSignedIn } = useAuth();

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/level/:id" element={<LevelPage />} />
          <Route
            path="/level/:id/note/:courseId"
            element={
              <ProtectedRoute>
                <NotePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cbt"
            element={
              <ProtectedRoute>
                <CBTPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/signup/*" element={<SignupPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {isSignedIn && <SteveFAB />}
    </>
  );
};

const App = () => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
