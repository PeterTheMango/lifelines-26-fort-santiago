"use client";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Package, Droplet, Fuel, Layers, Box, AlertTriangle } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  max: number;
  icon: LucideIcon;
  category: string;
}

const inventory: InventoryItem[] = [
  { id: "1", name: "Concrete", quantity: 850, max: 1000, unit: "kg", icon: Box, category: "Materials" },
  { id: "2", name: "Timber", quantity: 45, max: 200, unit: "units", icon: Layers, category: "Materials" },
  { id: "3", name: "Water", quantity: 1200, max: 2000, unit: "L", icon: Droplet, category: "Resources" },
  { id: "4", name: "Fuel", quantity: 85, max: 500, unit: "L", icon: Fuel, category: "Resources" },
  { id: "5", name: "Tires", quantity: 32, max: 50, unit: "units", icon: Package, category: "Materials" },
];

const getStockLevel = (quantity: number, max: number): "critical" | "low" | "normal" => {
  const percentage = (quantity / max) * 100;
  if (percentage < 10) return "critical";
  if (percentage < 25) return "low";
  return "normal";
};

const getStockColor = (level: "critical" | "low" | "normal") => {
  switch (level) {
    case "critical":
      return "bg-danger";
    case "low":
      return "bg-warning";
    case "normal":
      return "bg-success";
  }
};

export function InventorySummary() {
  return (
    <Card className="h-full flex flex-col group hover:border-border transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm uppercase tracking-wider text-text-secondary flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            Inventory Summary
          </CardTitle>
          <button className="text-xs text-text-muted hover:text-primary transition-colors font-mono">
            View All →
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 pt-0 space-y-3">
        {inventory.map((item, index) => {
          const percentage = (item.quantity / item.max) * 100;
          const level = getStockLevel(item.quantity, item.max);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="group/item p-3 rounded-lg bg-surface-elevated border border-border-subtle hover:border-border transition-all duration-200 hover:bg-surface-elevated/80"
              style={{
                animation: `slide-in 0.3s ease-out ${index * 0.05}s both`,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-md ${
                      level === "critical"
                        ? "bg-danger/10 text-danger"
                        : level === "low"
                        ? "bg-warning/10 text-warning"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">
                      {item.name}
                    </h4>
                    <p className="text-xs text-text-muted">{item.category}</p>
                  </div>
                </div>

                {/* Alert Icon for Critical/Low */}
                {level !== "normal" && (
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      level === "critical" ? "text-danger" : "text-warning"
                    } ${level === "critical" ? "animate-pulse" : ""}`}
                  />
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStockColor(level)} transition-all duration-500 ease-out rounded-full`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-text-primary font-semibold">
                  {item.quantity.toLocaleString()} {item.unit}
                </span>
                <span className="text-text-muted">
                  {percentage.toFixed(0)}% of {item.max.toLocaleString()}
                </span>
              </div>

              {/* Status Badge */}
              {level !== "normal" && (
                <div className="mt-2 pt-2 border-t border-border-subtle">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold ${
                      level === "critical" ? "text-danger" : "text-warning"
                    }`}
                  >
                    {level === "critical" ? "⚠ Critical" : "⚠ Low Stock"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </Card>
  );
}
