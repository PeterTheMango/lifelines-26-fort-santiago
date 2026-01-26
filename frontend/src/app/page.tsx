"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StockChart } from "@/components/dashboard/StockChart";
import { NetworkHealthMap } from "@/components/dashboard/NetworkHealthMap";
import { InventorySummary } from "@/components/dashboard/InventorySummary";
import { AIArchitectQuickAccess } from "@/components/dashboard/AIArchitectQuickAccess";
import { Box, Activity, Radio, DollarSign } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="max-w-[1280px] mx-auto mb-6 lg:mb-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-[2rem] font-bold text-text-primary tracking-tight font-sans leading-tight">
            Command Center
          </h1>
          <p className="text-text-secondary text-base">
            Real-time logistics overview and system health monitoring
          </p>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="max-w-[1280px] mx-auto">
        {/* Stats Overview - Full Width Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4 lg:mb-6">
          <StatsCard
            title="Total Resources"
            value="1,248"
            label="units tracked"
            icon={Box}
            status="normal"
          />
          <StatsCard
            title="Active Mesh"
            value="12/14"
            label="nodes online"
            icon={Radio}
            status="warning"
          />
          <StatsCard
            title="Est. Value"
            value="$46.7k"
            label="scavenged assets"
            icon={DollarSign}
            status="normal"
          />
          <StatsCard
            title="Active Alerts"
            value="3"
            label="critical issues"
            icon={Activity}
            status="critical"
          />
        </div>

        {/* Main Bento Grid - Adaptive 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Column: Inventory + AI Quick Access (Mobile: Full, Tablet: Left Half, Desktop: 4 cols) */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            <div className="h-[400px]">
              <InventorySummary />
            </div>
            <div className="h-[280px]">
              <AIArchitectQuickAccess />
            </div>
          </div>

          {/* Center Column: Resource Chart + Recent Activity (Mobile: Full, Tablet: Right Half, Desktop: 5 cols) */}
          <div className="lg:col-span-5 space-y-4 lg:space-y-6">
            <div className="h-[360px]">
              <StockChart />
            </div>
            <div className="h-[320px]">
              <RecentActivity />
            </div>
          </div>

          {/* Right Column: Network Health Map (Mobile: Full, Tablet: Full, Desktop: 3 cols) */}
          <div className="lg:col-span-3">
            <div className="h-[400px] lg:h-[696px]">
              <NetworkHealthMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
