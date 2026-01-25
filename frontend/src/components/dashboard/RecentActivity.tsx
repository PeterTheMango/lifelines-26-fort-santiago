"use client";

import { Package, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/Card";

const activities = [
    { id: 1, item: "Industrial Steel", quantity: "+4,500 kg", time: "Just now", status: "good", type: "stock" },
    { id: 2, item: "Coolant Type A", quantity: "120 L", time: "15m ago", status: "warning", type: "update" },
    { id: 3, item: "Packaging Boxes", quantity: "0 units", time: "1h ago", status: "critical", type: "stock" },
    { id: 4, item: "Hydraulic Pump", quantity: "+5 units", time: "2h ago", status: "good", type: "stock" },
    { id: 5, item: "Safety Gloves", quantity: "+150 boxes", time: "4h ago", status: "good", type: "stock" },
    { id: 6, item: "Copper Wire", quantity: "300 m", time: "5h ago", status: "good", type: "stock" },
    { id: 7, item: "Generator Fuel", quantity: "Low (15%)", time: "6h ago", status: "warning", type: "update" },
    { id: 8, item: "Water Filters", quantity: "+20 units", time: "8h ago", status: "good", type: "stock" },
    { id: 9, item: "Medical Kits", quantity: "50 kits", time: "10h ago", status: "good", type: "stock" },
    { id: 10, item: "Canned Food", quantity: "500 cans", time: "12h ago", status: "good", type: "stock" },
];

export function RecentActivity() {
    return (
        <Card className="h-full flex flex-col shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Recent Updates</CardTitle>
                <RefreshCw className="h-4 w-4 text-text-muted hover:text-primary cursor-pointer transition-colors" />
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 rounded-md bg-surface-elevated border border-border-subtle hover:bg-surface-elevated/80 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-md ${activity.status === 'critical' ? 'bg-danger/10 text-danger' :
                                activity.status === 'warning' ? 'bg-warning/10 text-warning' :
                                    'bg-primary/10 text-primary'
                                }`}>
                                <Package className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{activity.item}</p>
                                <p className="text-xs text-text-muted font-mono flex items-center gap-1">
                                    {activity.type === 'stock' ? 'Updated' : 'Verified'} • {activity.time}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-sm font-mono font-bold text-text-primary">{activity.quantity}</p>
                            {activity.status === "good" && (
                                <span className="inline-flex items-center text-[10px] uppercase font-bold text-success gap-1">
                                    <CheckCircle className="w-3 h-3" /> Stock
                                </span>
                            )}
                            {activity.status === "warning" && (
                                <span className="inline-flex items-center text-[10px] uppercase font-bold text-warning gap-1">
                                    <AlertCircle className="w-3 h-3" /> Low
                                </span>
                            )}
                            {activity.status === "critical" && (
                                <span className="inline-flex items-center text-[10px] uppercase font-bold text-danger gap-1">
                                    <AlertCircle className="w-3 h-3" /> Out
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="justify-center border-t border-border-subtle bg-surface-elevated/50 py-3">
                <button className="text-xs text-text-muted hover:text-text-primary uppercase font-bold tracking-wider transition-colors">View All History</button>
            </CardFooter>
        </Card>
    );
}
