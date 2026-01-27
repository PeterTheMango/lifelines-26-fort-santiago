"use client";

import {
  Package,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Activity,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/Card";

const activities = [
  {
    id: 1,
    item: "Industrial Steel",
    quantity: "+4,500 kg",
    time: "Just now",
    status: "good",
    type: "stock",
  },
  {
    id: 2,
    item: "Coolant Type A",
    quantity: "120 L",
    time: "15m ago",
    status: "warning",
    type: "update",
  },
  {
    id: 3,
    item: "Packaging Boxes",
    quantity: "0 units",
    time: "1h ago",
    status: "critical",
    type: "stock",
  },
  {
    id: 4,
    item: "Hydraulic Pump",
    quantity: "+5 units",
    time: "2h ago",
    status: "good",
    type: "stock",
  },
  {
    id: 5,
    item: "Safety Gloves",
    quantity: "+150 boxes",
    time: "4h ago",
    status: "good",
    type: "stock",
  },
  {
    id: 6,
    item: "Copper Wire",
    quantity: "300 m",
    time: "5h ago",
    status: "good",
    type: "stock",
  },
  {
    id: 7,
    item: "Generator Fuel",
    quantity: "Low (15%)",
    time: "6h ago",
    status: "warning",
    type: "update",
  },
  {
    id: 8,
    item: "Water Filters",
    quantity: "+20 units",
    time: "8h ago",
    status: "good",
    type: "stock",
  },
  {
    id: 9,
    item: "Medical Kits",
    quantity: "50 kits",
    time: "10h ago",
    status: "good",
    type: "stock",
  },
  {
    id: 10,
    item: "Canned Food",
    quantity: "500 cans",
    time: "12h ago",
    status: "good",
    type: "stock",
  },
];

export function RecentActivity() {
  return (
    <Card className="h-full flex flex-col group hover:border-border transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Recent Updates
        </CardTitle>
        <RefreshCw className="h-4 w-4 text-text-muted hover:text-primary cursor-pointer transition-all hover:rotate-180 duration-500" />
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 pt-0 space-y-2">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-2.5 rounded-lg bg-surface-elevated border border-border-subtle hover:border-border transition-all duration-200 group/item cursor-pointer"
            style={{
              animation: `slide-up 0.3s ease-out ${index * 0.04}s both`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-1.5 rounded-md transition-all ${
                  activity.status === "critical"
                    ? "bg-danger/10 text-danger"
                    : activity.status === "warning"
                      ? "bg-warning/10 text-warning"
                      : "bg-primary/10 text-primary"
                }`}
              >
                <Package className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary group-hover/item:text-primary transition-colors truncate">
                  {activity.item}
                </p>
                <p className="text-[11px] text-text-muted font-mono flex items-center gap-1">
                  {activity.type === "stock" ? "Updated" : "Verified"} •{" "}
                  {activity.time}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-sm font-mono font-semibold text-text-primary mb-0.5">
                {activity.quantity}
              </p>
              {activity.status === "good" && (
                <span className="inline-flex items-center text-[10px] uppercase font-bold text-success gap-0.5">
                  <CheckCircle className="w-2.5 h-2.5" /> OK
                </span>
              )}
              {activity.status === "warning" && (
                <span className="inline-flex items-center text-[10px] uppercase font-bold text-warning gap-0.5">
                  <AlertCircle className="w-2.5 h-2.5" /> Low
                </span>
              )}
              {activity.status === "critical" && (
                <span className="inline-flex items-center text-[10px] uppercase font-bold text-danger gap-0.5 animate-pulse-slow">
                  <AlertCircle className="w-2.5 h-2.5" /> Out
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-center border-t border-border-subtle bg-surface-elevated/30 py-2.5">
        <button className="text-xs text-text-muted hover:text-primary uppercase font-semibold tracking-wider transition-colors flex items-center gap-1 group/btn">
          View All History
          <span className="group-hover/btn:translate-x-0.5 transition-transform">
            →
          </span>
        </button>
      </CardFooter>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  );
}
