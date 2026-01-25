"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StockChart } from "@/components/dashboard/StockChart";
import { Box, Activity, Layers, Radio, DollarSign } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1280px] mx-auto h-[calc(100vh-6rem)] flex flex-col p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight font-display">Overview</h1>
        <p className="text-text-secondary">Logistics Overview & System Health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        {/* Combined Value Metric */}
        <StatsCard
          title="Est. Value"
          value="$46.7k"
          label="scavenged assets"
          icon={DollarSign}
          status="normal"
        />
        {/* Combined Alert Metric */}
        <StatsCard
          title="Active Alerts"
          value="3"
          label="critical issues"
          icon={Activity}
          status="critical"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 h-full max-h-[500px]">
          <StockChart />
        </div>
        <div className="lg:col-span-1 h-full max-h-[500px]">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
