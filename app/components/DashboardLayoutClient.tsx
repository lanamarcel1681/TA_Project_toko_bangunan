"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

interface DashboardLayoutClientProps {
    children: React.ReactNode;
    userName: string;
    role: "owner" | "employee";
}

export default function DashboardLayoutClient({ children, userName, role }: DashboardLayoutClientProps) {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="bg-white min-h-screen flex antialiased text-gray-800">
            {/* Desktop Sidebar */}
            <DashboardSidebar
                userName={userName}
                role={role}
                isExpanded={isSidebarExpanded}
                setIsExpanded={setIsSidebarExpanded}
                isMobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
            />
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-gray-50">
                <DashboardTopbar
                    userName={userName}
                    role={role}
                    isSidebarExpanded={isSidebarExpanded}
                    toggleSidebar={() => {
                        // On desktop: toggle expand/collapse
                        // On mobile: toggle mobile drawer
                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
                            setIsMobileSidebarOpen(!isMobileSidebarOpen);
                        } else {
                            setIsSidebarExpanded(!isSidebarExpanded);
                        }
                    }}
                />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
