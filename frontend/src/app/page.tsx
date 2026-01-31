import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StockChart } from "@/components/dashboard/StockChart";
import { NetworkHealthMap } from "@/components/dashboard/NetworkHealthMap";
import { InventorySummary } from "@/components/dashboard/InventorySummary";
import { AIArchitectQuickAccess } from "@/components/dashboard/AIArchitectQuickAccess";
import { Box, Activity, Radio, DollarSign } from "lucide-react";
import { fetchDashboardStats } from "@/lib/api";

export default async function Dashboard() {
  // Fetch dashboard stats from the database
  let stats;
  try {
    stats = await fetchDashboardStats();
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    // Fallback to default values if fetch fails
    stats = {
      totalResources: 0,
      activeMesh: { online: 0, total: 14 },
      estValue: 0,
      activeAlerts: 0,
    };
  }

  // Format values for display
  const formattedResources = stats.totalResources.toLocaleString();
  const activeMeshValue = `${stats.activeMesh.online}/${stats.activeMesh.total}`;
  const formattedValue = `$${(stats.estValue / 1000).toFixed(1)}k`;
  const alertsValue = stats.activeAlerts.toString();

  // Determine status based on data
  const meshStatus = stats.activeMesh.online === stats.activeMesh.total ? "normal" : "warning";
  const alertStatus = stats.activeAlerts === 0 ? "normal" : stats.activeAlerts > 5 ? "critical" : "warning";

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
            value={formattedResources}
            label="units tracked"
            icon={Box}
            status="normal"
          />
          <StatsCard
            title="Active Mesh"
            value={activeMeshValue}
            label="nodes online"
            icon={Radio}
            status={meshStatus}
          />
          <StatsCard
            title="Est. Value"
            value={formattedValue}
            label="scavenged assets"
            icon={DollarSign}
            status="normal"
          />
          <StatsCard
            title="Active Alerts"
            value={alertsValue}
            label="critical issues"
            icon={Activity}
            status={alertStatus}
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
