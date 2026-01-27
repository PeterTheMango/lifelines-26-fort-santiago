"use client";

import { Clock, Search, ChevronDown, MapPin } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { fetchInventory, Material } from "@/lib/api";

interface GroupedMaterial {
  type: string;
  category: string;
  totalCurrentAmount: number;
  totalRequiredAmount: number;
  unit: string;
  locations: { location: string; currentAmount: number; requiredAmount: number }[];
  latestUpdate: string;
  status: "good" | "low" | "critical" | "warning";
}

interface InventoryTableProps {
  selectedCategory?: string;
}

export function InventoryTable({ selectedCategory = "all" }: InventoryTableProps) {
  const [inventory, setInventory] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchInventory();
        setInventory(data);
      } catch (error) {
        console.error("Failed to load inventory:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter inventory based on selected category
  const filteredInventory = selectedCategory === "all"
    ? inventory
    : inventory.filter(item => item.category === selectedCategory);

  // Group materials by type
  const groupedInventory = useMemo(() => {
    const groups = new Map<string, GroupedMaterial>();

    filteredInventory.forEach(item => {
      const existing = groups.get(item.type);

      if (existing) {
        existing.totalCurrentAmount += item.currentAmount;
        existing.totalRequiredAmount += item.requiredAmount;
        existing.locations.push({
          location: item.location,
          currentAmount: item.currentAmount,
          requiredAmount: item.requiredAmount
        });
        // Keep the worst status
        const statusPriority = { critical: 0, warning: 1, low: 2, good: 3 };
        if (statusPriority[item.status] < statusPriority[existing.status]) {
          existing.status = item.status;
        }
      } else {
        groups.set(item.type, {
          type: item.type,
          category: item.category,
          totalCurrentAmount: item.currentAmount,
          totalRequiredAmount: item.requiredAmount,
          unit: item.unit,
          locations: [{
            location: item.location,
            currentAmount: item.currentAmount,
            requiredAmount: item.requiredAmount
          }],
          latestUpdate: item.updated,
          status: item.status
        });
      }
    });

    return Array.from(groups.values());
  }, [filteredInventory]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Calculate pagination using grouped inventory
  const totalPages = Math.ceil(groupedInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInventory = groupedInventory.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
            {groupedInventory.length} items
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
            {paginatedInventory.map((item, index) => {
              // Calculate percentage and determine color
              const getStockLevel = (current: number, required: number) => {
                const safeRequired = required > 0 ? required : current;
                const percentage = required > 0 ? (current / required) * 100 : 100;

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
              const { percentage, color, bgColor } = getStockLevel(item.totalCurrentAmount, item.totalRequiredAmount);

              return (
                <tr
                  key={item.type}
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
                        {item.totalCurrentAmount} {item.unit}
                      </span>
                      <span className="text-text-muted text-[0.75rem] font-mono">
                        / {item.totalRequiredAmount} required
                      </span>
                    </div>
                  </td>

                  {/* Stock Level Progress Bar */}
                  <td className="py-4 px-4">
                    <div className="w-full">
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

                  {/* Locations */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      {item.locations.map((loc, locIndex) => (
                        <div key={locIndex} className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-text-muted flex-shrink-0" />
                          <span className="text-text-secondary text-[0.875rem]">
                            {loc.location}
                          </span>
                          <span className="text-text-muted text-[0.75rem] font-mono">
                            ({loc.currentAmount} {item.unit})
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Last Update */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-text-muted">
                      <Clock className="w-3 h-3" />
                      <span className="text-[0.75rem]">
                        {item.latestUpdate}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {groupedInventory.length === 0 && (
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
      {groupedInventory.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border-subtle flex items-center justify-between">
          <p className="text-text-muted text-[0.75rem]">
            Showing <span className="text-text-secondary font-semibold">{paginatedInventory.length > 0 ? startIndex + 1 : 0}</span> to <span className="text-text-secondary font-semibold">{Math.min(startIndex + itemsPerPage, groupedInventory.length)}</span> of{" "}
            <span className="text-text-secondary font-semibold">{groupedInventory.length}</span> materials
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-text-secondary text-sm border border-border-subtle rounded-lg hover:border-border hover:text-text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors
                            ${page === currentPage
                      ? "bg-primary text-text-inverse"
                      : "text-text-secondary hover:bg-surface-elevated"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-text-secondary text-sm border border-border-subtle rounded-lg hover:border-border hover:text-text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

