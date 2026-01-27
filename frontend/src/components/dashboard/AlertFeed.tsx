"use client";

import { AlertTriangle, AlertOctagon } from "lucide-react";

const alerts = [
    { id: 1, type: "critical", message: "Water Tank A Level < 15%", time: "2m ago" },
    { id: 2, type: "warning", message: "Mesh Node #04 Signal Weak (-85dBm)", time: "12m ago" },
    { id: 3, type: "critical", message: "Cement Supply Critical", time: "1h ago" },
];

export function AlertFeed() {
    return (
        <div className="bg-surface border border-white/5 rounded-lg overflow-hidden h-full flex flex-col">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Critical Alerts</h3>
                <span className="bg-danger/20 text-danger text-xs font-bold px-2 py-0.5 rounded-full animate-pulse border border-danger/20">
                    LIVE
                </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[300px]">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`flex items-start p-3 rounded-md border ${alert.type === "critical"
                                ? "bg-danger/10 border-danger/20"
                                : "bg-warning/10 border-warning/20"
                            }`}
                    >
                        {alert.type === "critical" ? (
                            <AlertOctagon className="h-5 w-5 mt-0.5 flex-shrink-0 text-danger" />
                        ) : (
                            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 text-warning" />
                        )}
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-bold text-white">
                                {alert.message}
                            </p>
                            <p className="text-xs text-white/50 mt-1 font-mono">{alert.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
