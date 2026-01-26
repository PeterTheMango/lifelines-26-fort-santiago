"use client";

import { Clock, Search, ChevronDown } from "lucide-react";

interface Material {
  id: number;
  type: string;
  category: string;
  quantity: string;
  maxCapacity: number;
  currentAmount: number;
  location: string;
  updated: string;
  status: "good" | "low" | "critical" | "warning";
}

const inventory: Material[] = [
  {
    id: 1,
    type: "Concrete Rubble",
    category: "construction",
    quantity: "450 kg",
    maxCapacity: 500,
    currentAmount: 450,
    location: "Sector A",
    updated: "2m ago",
    status: "good"
  },
  {
    id: 2,
    type: "Timber Beams",
    category: "construction",
    quantity: "12 units",
    maxCapacity: 50,
    currentAmount: 12,
    location: "Sector B",
    updated: "15m ago",
    status: "low"
  },
  {
    id: 3,
    type: "Water (Potable)",
    category: "water",
    quantity: "120 L",
    maxCapacity: 2000,
    currentAmount: 120,
    location: "Base Camp",
    updated: "Just now",
    status: "critical"
  },
  {
    id: 4,
    type: "Metal Scraps",
    category: "construction",
    quantity: "85 kg",
    maxCapacity: 100,
    currentAmount: 85,
    location: "Sector A",
    updated: "1h ago",
    status: "good"
  },
  {
    id: 5,
    type: "Plastic Sheeting",
    category: "construction",
    quantity: "4 rolls",
    maxCapacity: 5,
    currentAmount: 4,
    location: "Sector C",
    updated: "3h ago",
    status: "good"
  },
  {
    id: 6,
    type: "Aggregates",
    category: "construction",
    quantity: "1200 kg",
    maxCapacity: 1500,
    currentAmount: 1200,
    location: "Sector D",
    updated: "5m ago",
    status: "good"
  },
  {
    id: 7,
    type: "Fuel (Diesel)",
    category: "fuel",
    quantity: "40 L",
    maxCapacity: 200,
    currentAmount: 40,
    location: "Generator 1",
    updated: "10m ago",
    status: "warning"
  },
];

interface InventoryTableProps {
  selectedCategory?: string;
}

export function InventoryTable({ selectedCategory = "all" }: InventoryTableProps) {
  // Filter inventory based on selected category
  const filteredInventory = selectedCategory === "all"
    ? inventory
    : inventory.filter(item => item.category === selectedCategory);

  // Calculate percentage and determine color
  const getStockLevel = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    let color = "#4ADE80"; // Success green (healthy stock)
    let bgColor = "rgba(74, 222, 128, 0.1)";

    if (percentage < 10) {
      color = "#F87171"; // Danger red (critical)
      bgColor = "rgba(248, 113, 113, 0.1)";
    } else if (percentage < 25) {
      color = "#FBBF24"; // Warning yellow (low stock)
      bgColor = "rgba(251, 191, 36, 0.1)";
    }

    return { percentage, color, bgColor };
  };

  return (
    <div
      className="bg-surface border border-border-subtle rounded-xl p-6 hover:border-border transition-all"
      style={{
        backgroundColor: "#162118",
        borderColor: "#2A3D2E",
        borderRadius: "12px",
        padding: "16px"
      }}
    >
      {/* Table Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-[1.25rem] font-semibold text-text-primary">
            Material List
          </h2>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono font-semibold">
            {filteredInventory.length} items
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search materials..."
            className="w-full h-10 bg-surface-elevated border border-border-subtle rounded-lg pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            style={{
              backgroundColor: "#1E2D21",
              borderColor: "#2A3D2E",
              borderRadius: "8px"
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left py-4 px-4 text-text-secondary text-[0.75rem] font-semibold uppercase tracking-wider">
                <div className="flex items-center gap-2 cursor-pointer hover:text-text-primary transition-colors group">
                  Material
                  <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th className="text-left py-4 px-4 text-text-secondary text-[0.75rem] font-semibold uppercase tracking-wider">
                Quantity
              </th>
              <th className="text-left py-4 px-4 text-text-secondary text-[0.75rem] font-semibold uppercase tracking-wider">
                Stock Level
              </th>
              <th className="text-left py-4 px-4 text-text-secondary text-[0.75rem] font-semibold uppercase tracking-wider">
                Location
              </th>
              <th className="text-left py-4 px-4 text-text-secondary text-[0.75rem] font-semibold uppercase tracking-wider">
                Last Update
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, index) => {
              const { percentage, color, bgColor } = getStockLevel(item.currentAmount, item.maxCapacity);

              return (
                <tr
                  key={item.id}
                  className="border-b border-border-subtle hover:bg-surface-elevated transition-all group cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Material Name */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-text-primary font-semibold text-[1rem] group-hover:text-primary transition-colors">
                        {item.type}
                      </span>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-text-primary font-mono text-[0.875rem] font-semibold">
                        {item.quantity}
                      </span>
                      <span className="text-text-muted text-[0.75rem] font-mono">
                        / {item.maxCapacity} max
                      </span>
                    </div>
                  </td>

                  {/* Stock Level Progress Bar */}
                  <td className="py-4 px-4">
                    <div className="w-full">
                      {/* Progress Bar Container */}
                      <div
                        className="h-6 rounded-full overflow-hidden relative"
                        style={{
                          backgroundColor: bgColor,
                          borderRadius: "9999px"
                        }}
                      >
                        {/* Progress Bar Fill */}
                        <div
                          className="h-full transition-all duration-500 ease-out"
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: color,
                          }}
                        />
                        {/* Percentage Text Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-[0.75rem] font-bold font-mono"
                            style={{
                              color: percentage > 50 ? "#0C1810" : color,
                              textShadow: percentage > 50 ? "none" : "0 0 4px rgba(0,0,0,0.5)"
                            }}
                          >
                            {Math.round(percentage)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-4 px-4">
                    <span className="text-text-secondary text-[0.875rem]">
                      {item.location}
                    </span>
                  </td>

                  {/* Last Update */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-text-muted">
                      <Clock className="w-3 h-3" />
                      <span className="text-[0.75rem]">
                        {item.updated}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-elevated mb-4">
              <Search className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-text-primary font-semibold text-lg mb-2">
              No materials found
            </h3>
            <p className="text-text-secondary text-sm">
              Try adjusting your filter or search criteria
            </p>
          </div>
        )}
      </div>

      {/* Table Footer */}
      {filteredInventory.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border-subtle flex items-center justify-between">
          <p className="text-text-muted text-[0.75rem]">
            Showing <span className="text-text-secondary font-semibold">{filteredInventory.length}</span> of{" "}
            <span className="text-text-secondary font-semibold">{inventory.length}</span> materials
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-text-secondary text-sm border border-border-subtle rounded-lg hover:border-border hover:text-text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-text-inverse text-sm font-semibold">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary text-sm hover:bg-surface-elevated transition-colors">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary text-sm hover:bg-surface-elevated transition-colors">
                3
              </button>
            </div>
            <button className="px-3 py-1.5 text-text-secondary text-sm border border-border-subtle rounded-lg hover:border-border hover:text-text-primary transition-all">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
