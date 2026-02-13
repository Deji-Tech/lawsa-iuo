import { useAuth } from "@clerk/clerk-react";
import LockedContent from "@/components/LockedContent";
import { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return (
            <div className="flex min-h-[400px] w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-brand" />
            </div>
        );
    }

    if (!isSignedIn) {
        return <LockedContent />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
