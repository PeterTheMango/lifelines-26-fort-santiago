"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Bot, Network, Settings } from "lucide-react";
import { clsx } from "clsx";

const navigation = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Architect", href: "/architect", icon: Bot },
    { name: "Network", href: "/network", icon: Network },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full w-20 md:w-64 bg-surface border-r border-border-subtle">
            <div className="flex items-center justify-center md:justify-start md:px-6 h-16 border-b border-border-subtle">
                <div className="h-8 w-8 relative shrink-0">
                    <img src="/crisisbuild_logo.svg" alt="CrisisBuild Logo" className="h-full w-full object-contain" />
                </div>
                <span className="hidden md:ml-3 md:block font-bold text-lg tracking-wider text-text-primary">CRISIS<span className="text-primary">BUILD</span></span>
            </div>

            <nav className="flex-1 px-2 py-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                "group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-surface-elevated text-primary border border-border-subtle"
                                    : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                            )}
                        >
                            <item.icon
                                className={clsx(
                                    "flex-shrink-0 h-6 w-6 transition-colors",
                                    isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary"
                                )}
                            />
                            <span className="hidden md:ml-3 md:block">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border-subtle">
                <Link
                    href="/settings"
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                >
                    <Settings className="flex-shrink-0 h-6 w-6 mr-3" />
                    <span className="hidden md:block">System</span>
                </Link>
            </div>
        </div>
    );
}
