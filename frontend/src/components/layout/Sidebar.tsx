"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Bot,
    Network,
    Settings,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { clsx } from "clsx";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const navigation = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Architect", href: "/architect", icon: Bot },
    { name: "Network", href: "/network", icon: Network },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Load collapsed state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem("sidebar-collapsed");
        if (savedState !== null) {
            setIsCollapsed(savedState === "true");
        }
    }, []);

    // Persist collapsed state to localStorage
    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem("sidebar-collapsed", String(newState));
    };

    return (
        <div
            className={clsx(
                "flex flex-col h-full bg-surface border-r border-border-subtle transition-all duration-200 ease-out",
                isCollapsed ? "w-20" : "w-20 md:w-64"
            )}
        >
            {/* Header */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={clsx(
                            "flex items-center border-b border-border-subtle px-4 py-5",
                            isCollapsed ? "justify-center" : "justify-center md:justify-start"
                        )}
                    >
                        <div className="h-12 w-12 relative shrink-0">
                            <img
                                src="/crisisbuild_logo.svg"
                                alt="CrisisBuild Logo"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div
                            className={clsx(
                                "flex flex-col justify-center overflow-hidden transition-all duration-200 ease-out ml-3",
                                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 hidden md:flex"
                            )}
                        >
                            <h1 className="font-bold text-lg tracking-wide text-text-primary leading-tight whitespace-nowrap">
                                CRISIS<span className="text-primary">BUILD</span>
                            </h1>
                            <p className="text-[0.625rem] text-text-muted tracking-wide leading-tight whitespace-nowrap mt-0.5">
                                By: Fort Santiago
                            </p>
                        </div>
                    </div>
                </TooltipTrigger>
                {isCollapsed && (
                    <TooltipContent side="right" sideOffset={12}>
                        <div className="text-center">
                            <div className="font-semibold">CrisisBuild</div>
                            <div className="text-[0.625rem] opacity-80">By: Fort Santiago</div>
                        </div>
                    </TooltipContent>
                )}
            </Tooltip>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Tooltip key={item.name}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={item.href}
                                    className={clsx(
                                        "group flex items-center px-3 py-3 text-sm font-medium rounded-md",
                                        "transition-all duration-150 ease-out",
                                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface",
                                        isCollapsed ? "justify-center" : "justify-start",
                                        isActive
                                            ? "bg-surface-elevated text-primary border border-border-subtle"
                                            : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary hover:border-transparent border border-transparent"
                                    )}
                                    aria-label={item.name}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <item.icon
                                        className={clsx(
                                            "flex-shrink-0 h-6 w-6 transition-colors duration-150 ease-out",
                                            isActive
                                                ? "text-primary"
                                                : "text-text-secondary group-hover:text-text-primary"
                                        )}
                                        strokeWidth={1.5}
                                    />
                                    <span
                                        className={clsx(
                                            "overflow-hidden transition-all duration-200 ease-out whitespace-nowrap",
                                            isCollapsed
                                                ? "w-0 opacity-0 ml-0"
                                                : "w-auto opacity-100 ml-3 hidden md:inline"
                                        )}
                                    >
                                        {item.name}
                                    </span>
                                </Link>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right" sideOffset={12}>
                                    {item.name}
                                </TooltipContent>
                            )}
                        </Tooltip>
                    );
                })}
            </nav>

            {/* Footer: Toggle Button + System Settings */}
            <div className="border-t border-border-subtle">
                {/* Toggle Button - Desktop only */}
                <div className="hidden md:flex items-center justify-center px-4 pt-3 pb-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={toggleSidebar}
                                className={clsx(
                                    "flex items-center justify-center w-full",
                                    "h-10 px-3 rounded-md",
                                    "bg-surface-elevated border border-border-subtle",
                                    "text-text-secondary hover:text-primary hover:border-border",
                                    "transition-all duration-150 ease-out",
                                    "hover:bg-surface-elevated",
                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
                                )}
                                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                                aria-expanded={!isCollapsed}
                            >
                                {isCollapsed ? (
                                    <ChevronRight className="h-5 w-5" strokeWidth={2} />
                                ) : (
                                    <>
                                        <ChevronLeft className="h-5 w-5 mr-2" strokeWidth={2} />
                                        <span className="text-sm font-medium">Collapse</span>
                                    </>
                                )}
                            </button>
                        </TooltipTrigger>
                        {isCollapsed && (
                            <TooltipContent side="right" sideOffset={12}>
                                Expand sidebar
                            </TooltipContent>
                        )}
                    </Tooltip>
                </div>

                {/* System Settings */}
                <div className="p-4 pt-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/settings"
                                className={clsx(
                                    "group flex items-center px-3 py-3 text-sm font-medium rounded-md",
                                    "text-text-secondary hover:bg-surface-elevated hover:text-text-primary",
                                    "transition-all duration-150 ease-out",
                                    "border border-transparent hover:border-transparent",
                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface",
                                    isCollapsed ? "justify-center" : "justify-start"
                                )}
                                aria-label="System settings"
                            >
                                <Settings
                                    className="flex-shrink-0 h-6 w-6 transition-colors duration-150 ease-out"
                                    strokeWidth={1.5}
                                />
                                <span
                                    className={clsx(
                                        "overflow-hidden transition-all duration-200 ease-out whitespace-nowrap",
                                        isCollapsed
                                            ? "w-0 opacity-0 ml-0"
                                            : "w-auto opacity-100 ml-3 hidden md:inline"
                                    )}
                                >
                                    System
                                </span>
                            </Link>
                        </TooltipTrigger>
                        {isCollapsed && (
                            <TooltipContent side="right" sideOffset={12}>
                                System
                            </TooltipContent>
                        )}
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
