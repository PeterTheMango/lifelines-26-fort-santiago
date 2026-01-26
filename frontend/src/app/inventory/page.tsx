"use client";

import { useState } from "react";
import { LayoutList, Map as MapIcon } from "lucide-react";
import { InventoryListView } from "@/components/inventory/InventoryListView";
import { InventoryMapView } from "@/components/inventory/InventoryMapView";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<"table" | "map">("table");

  return (
    <div className="min-h-screen p-2 md:p-4 lg:p-6 animate-fade-in">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slide-up" style={{ animationDelay: "0.05s" }}>
        <div>
          <h1 className="text-[2rem] font-bold text-text-primary leading-tight tracking-tight mb-2" style={{ fontWeight: 700, lineHeight: 1.2 }}>
            Material Inventory
          </h1>
          <p className="text-text-secondary text-[0.875rem]" style={{ lineHeight: 1.5 }}>
            Live tracking of scavenged resources across all sectors
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex bg-surface-elevated p-1 rounded-lg border border-border-subtle shadow-sm flex-shrink-0">
          <button
            onClick={() => setActiveTab("table")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200
              ${activeTab === "table"
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-surface"
              }
            `}
            aria-label="Table View"
          >
            <LayoutList className="w-4 h-4" />
            <span>Table View</span>
          </button>

          <button
            onClick={() => setActiveTab("map")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200
              ${activeTab === "map"
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-surface"
              }
            `}
            aria-label="Map View"
          >
            <MapIcon className="w-4 h-4" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        {activeTab === "table" ? (
          <InventoryListView />
        ) : (
          <InventoryMapView />
        )}
      </div>
    </div>
  );
}
