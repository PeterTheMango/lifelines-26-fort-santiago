"use client";

import { AlertTriangle, Package, TrendingUp, AlertCircle, Plus, FileDown, RefreshCw, Layers, Droplet, Fuel } from "lucide-react";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { AddMaterialModal } from "@/components/inventory/AddMaterialModal";
import { useState } from "react";
import { Material } from "@/lib/api";

interface InventoryListViewProps {
    className?: string;
    inventory: Material[];
}

export function InventoryListView({ className, inventory }: InventoryListViewProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

    const inventoryStats = {
        totalMaterials: inventory.length,
        totalCategories: new Set(inventory.map(i => i.category)).size,
        criticalItems: inventory.filter(i => i.status === 'critical').length,
        lowStockItems: inventory.filter(i => i.status === 'low' || i.status === 'warning').length,
    };

    const categoryData = [
        {
            name: "Construction",
            count: inventory.filter(i => i.category === 'construction').length,
            icon: Layers,
            color: "text-primary"
        },
        {
            name: "Water",
            count: inventory.filter(i => i.category === 'water').length,
            icon: Droplet,
            color: "text-info"
        },
        {
            name: "Fuel",
            count: inventory.filter(i => i.category === 'fuel').length,
            icon: Fuel,
            color: "text-warning"
        },
    ];

    const criticalAlerts = inventory
        .filter(item => item.status === 'critical')
        .map(item => ({
            id: item.id,
            material: item.type,
            quantity: item.quantity,
            threshold: "10%", // Assuming 10% for now or could be calculated
            location: item.location
        }));

    const handleDismissAlert = (alertId: number) => {
        setDismissedAlerts([...dismissedAlerts, alertId]);
    };

    const visibleAlerts = criticalAlerts.filter(alert => !dismissedAlerts.includes(alert.id));

    return (
        <div className={`animate-fade-in ${className}`}>
            {/* Critical Alerts Banner */}
            {visibleAlerts.length > 0 && (
                <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    {visibleAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="bg-danger/10 border-l-4 border-danger rounded-lg p-4 flex items-start gap-4 group hover:bg-danger/15 transition-colors"
                            style={{
                                backgroundColor: "rgba(248, 113, 113, 0.15)",
                                borderRadius: "12px",
                            }}
                        >
                            <div className="flex-shrink-0 mt-0.5">
                                <div className="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center animate-pulse-warning">
                                    <AlertTriangle className="w-5 h-5 text-danger" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-text-primary font-semibold text-[1rem] mb-1">
                                    Critical Stock Alert: {alert.material}
                                </h3>
                                <p className="text-text-secondary text-[0.875rem]">
                                    Current stock at <span className="font-mono text-danger font-semibold">{alert.quantity}</span> —
                                    Below {alert.threshold} threshold • Location: {alert.location} • Resupply required immediately
                                </p>
                            </div>
                            <button
                                onClick={() => handleDismissAlert(alert.id)}
                                className="flex-shrink-0 text-text-muted hover:text-text-secondary transition-colors p-2"
                                aria-label="Dismiss alert"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 5L5 15M5 5l10 10" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Inventory Summary Card */}
                <div
                    className="bg-surface border border-border-subtle rounded-xl p-6 hover:border-border transition-all animate-slide-up"
                    style={{
                        backgroundColor: "#162118",
                        borderColor: "#2A3D2E",
                        borderRadius: "12px",
                        padding: "16px",
                        animationDelay: "0.15s"
                    }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-[1.25rem] font-semibold text-text-primary" style={{ fontWeight: 600 }}>
                            Inventory Summary
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Materials */}
                        <div className="flex flex-col justify-between p-4 rounded-lg bg-surface-elevated border border-border-subtle hover:border-border transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-text-secondary text-[0.75rem] uppercase tracking-wider font-medium" style={{ letterSpacing: "0.02em" }}>
                                    Total Materials
                                </p>
                                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="w-4 h-4 text-success" />
                                </div>
                            </div>
                            <p className="text-text-primary font-mono text-[2rem] font-bold leading-none" style={{ fontWeight: 700 }}>
                                {inventoryStats.totalMaterials}
                            </p>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-col justify-between p-4 rounded-lg bg-surface-elevated border border-border-subtle hover:border-border transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-text-secondary text-[0.75rem] uppercase tracking-wider font-medium">
                                    Categories
                                </p>
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Layers className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                            <p className="text-text-primary font-mono text-[2rem] font-bold leading-none">
                                {inventoryStats.totalCategories}
                            </p>
                        </div>

                        {/* Critical Items */}
                        <div className="flex flex-col justify-between p-4 rounded-lg bg-danger/10 border border-danger/20 hover:border-danger/30 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-text-secondary text-[0.75rem] uppercase tracking-wider font-medium">
                                    Critical
                                </p>
                                <div className="w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center animate-pulse-warning flex-shrink-0">
                                    <AlertCircle className="w-4 h-4 text-danger" />
                                </div>
                            </div>
                            <p className="text-danger font-mono text-[2rem] font-bold leading-none">
                                {inventoryStats.criticalItems}
                            </p>
                        </div>

                        {/* Low Stock Items */}
                        <div className="flex flex-col justify-between p-4 rounded-lg bg-warning/10 border border-warning/20 hover:border-warning/30 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-text-secondary text-[0.75rem] uppercase tracking-wider font-medium">
                                    Low Stock
                                </p>
                                <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-4 h-4 text-warning" />
                                </div>
                            </div>
                            <p className="text-warning font-mono text-[2rem] font-bold leading-none">
                                {inventoryStats.lowStockItems}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div
                    className="bg-surface border border-border-subtle rounded-xl p-6 hover:border-border transition-all animate-slide-up"
                    style={{
                        backgroundColor: "#162118",
                        borderColor: "#2A3D2E",
                        borderRadius: "12px",
                        padding: "16px",
                        animationDelay: "0.2s"
                    }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-[1.25rem] font-semibold text-text-primary">
                            Quick Actions
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {/* Add Material Button */}
                        <AddMaterialModal />

                        {/* Export Report Button */}
                        <button
                            className="w-full h-12 bg-transparent border border-primary text-primary rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-primary/10 transition-all group"
                            style={{
                                minHeight: "48px",
                                borderRadius: "8px",
                                borderWidth: "1px"
                            }}
                        >
                            <FileDown className="w-5 h-5 group-hover:animate-pulse" />
                            Export Report
                        </button>

                        {/* Refresh Stock Button */}
                        <button
                            className="w-full h-12 bg-transparent border border-border text-text-secondary rounded-lg flex items-center justify-center gap-2 font-semibold hover:border-border-subtle hover:text-text-primary transition-all group"
                            style={{
                                minHeight: "48px",
                                borderRadius: "8px"
                            }}
                        >
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            Refresh Stock
                        </button>
                    </div>

                    {/* Last Updated Info */}
                    <div className="mt-6 pt-6 border-t border-border-subtle">
                        <p className="text-text-muted text-[0.75rem] text-center">
                            Last synced: <span className="text-text-secondary font-medium">2 minutes ago</span>
                        </p>
                    </div>
                </div>

                {/* Category Filter Card */}
                <div
                    className="bg-surface border border-border-subtle rounded-xl p-6 hover:border-border transition-all animate-slide-up"
                    style={{
                        backgroundColor: "#162118",
                        borderColor: "#2A3D2E",
                        borderRadius: "12px",
                        padding: "16px",
                        animationDelay: "0.25s"
                    }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-[1.25rem] font-semibold text-text-primary">
                            Filter by Category
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* All Categories */}
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`p-4 rounded-lg border transition-all text-left flex flex-col justify-between group ${selectedCategory === "all"
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-surface-elevated border-border-subtle text-text-secondary hover:border-border hover:text-text-primary"
                                }`}
                            style={{ minHeight: "80px", borderRadius: "8px" }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedCategory === "all" ? "bg-primary/20" : "bg-border-subtle group-hover:bg-border"
                                    }`}>
                                    <Package className="w-4 h-4" />
                                </div>
                                <span className="font-mono text-[0.75rem] font-semibold">{inventoryStats.totalMaterials}</span>
                            </div>
                            <span className="font-semibold text-[0.875rem] leading-tight">All Materials</span>
                        </button>

                        {/* Category Buttons */}
                        {categoryData.map((category) => (
                            <button
                                key={category.name}
                                onClick={() => setSelectedCategory(category.name.toLowerCase())}
                                className={`p-4 rounded-lg border transition-all text-left flex flex-col justify-between group ${selectedCategory === category.name.toLowerCase()
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-surface-elevated border-border-subtle text-text-secondary hover:border-border hover:text-text-primary"
                                    }`}
                                style={{ minHeight: "80px", borderRadius: "8px" }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedCategory === category.name.toLowerCase() ? "bg-primary/20" : "bg-border-subtle group-hover:bg-border"
                                        }`}>
                                        <category.icon className={`w-4 h-4 ${category.color}`} />
                                    </div>
                                    <span className="font-mono text-[0.75rem] font-semibold">{category.count}</span>
                                </div>
                                <span className="font-semibold text-[0.875rem] leading-tight">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Inventory Table - Full Width Below Bento Grid */}
            <div
                className="mt-6 animate-slide-up"
                style={{ animationDelay: "0.3s" }}
            >
                <InventoryTable selectedCategory={selectedCategory} inventory={inventory} />
            </div>
        </div>
    );
}
