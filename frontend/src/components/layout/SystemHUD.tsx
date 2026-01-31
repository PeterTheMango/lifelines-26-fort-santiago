"use client";

import { Battery, Wifi, Activity, Menu } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

export function SystemHUD() {
    const { toggleMobileSidebar } = useSidebar();

    return (
        <header className="h-16 bg-background border-b border-border-subtle flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleMobileSidebar}
                    className="md:hidden text-text-secondary hover:text-primary focus:outline-none"
                    aria-label="Toggle menu"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Breadcrumb or Title placeholder */}
                <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-success animate-pulse" />
                    <span className="text-sm font-mono text-text-secondary">SYSTEM NORMAL</span>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                {/* Brain Status */}
                <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_var(--color-success)]" />
                    <span className="text-xs font-mono text-text-secondary">BRAIN: ONLINE</span>
                </div>

                {/* Mesh Status */}
                <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_var(--color-success)]" />
                    <span className="text-xs font-mono text-text-secondary">MESH: 12 NODES</span>
                </div>

                <div className="h-8 w-px bg-border-subtle" />

                <div className="flex items-center space-x-3 text-text-secondary">
                    <Wifi className="h-5 w-5" />
                    <div className="flex items-center space-x-1">
                        <span className="text-xs font-mono">98%</span>
                        <Battery className="h-5 w-5 text-success" />
                    </div>
                </div>
            </div>
        </header>
    );
}
