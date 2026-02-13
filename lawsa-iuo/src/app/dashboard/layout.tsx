import Sidebar from "@/components/dashboard/Sidebar";
import SteveFAB from "@/components/SteveFAB";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Persistent Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/20 via-transparent to-transparent">
                {/* Added pt-20 for mobile header and pb-20 for mobile nav */}
                <div className="container mx-auto p-6 pb-24 pt-24 md:p-8 md:pt-8 lg:p-12">
                    {children}
                </div>
            </main>

            {/* Persistent Steve AI */}
            <SteveFAB />
        </div>
    );
}
