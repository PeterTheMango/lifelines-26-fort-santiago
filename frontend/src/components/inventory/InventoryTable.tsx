"use client";

import { Clock, AlertCircle, CheckCircle, Search } from "lucide-react";

const inventory = [
    { id: 1, type: "Concrete Rubble", quantity: "450 kg", location: "Sector A", updated: "2m ago", status: "good" },
    { id: 2, type: "Timber Beams", quantity: "12 units", location: "Sector B", updated: "15m ago", status: "low" },
    { id: 3, type: "Water (Potable)", quantity: "120 L", location: "Base Camp", updated: "Just now", status: "critical" },
    { id: 4, type: "Metal Scraps", quantity: "85 kg", location: "Sector A", updated: "1h ago", status: "good" },
    { id: 5, type: "Plastic Sheeting", quantity: "4 rolls", location: "Sector C", updated: "3h ago", status: "good" },
    { id: 6, type: "Aggregates", quantity: "1200 kg", location: "Sector D", updated: "5m ago", status: "good" },
    { id: 7, type: "Fuel (Diesel)", quantity: "40 L", location: "Generator 1", updated: "10m ago", status: "warning" },
];

export function InventoryTable() {
    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search materials..."
                        className="w-full bg-surface border border-white/10 rounded-md pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-600"
                    />
                </div>
                {/* Filter buttons could go here */}
            </div>

            <div className="bg-surface border border-white/5 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Material</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Last Update</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {inventory.map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white tracking-wide">{item.type}</td>
                                    <td className="px-6 py-4 font-mono text-primary text-base">{item.quantity}</td>
                                    <td className="px-6 py-4 text-gray-400">{item.location}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            {item.updated}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.status === "good" && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-success/10 text-success border border-success/20 uppercase tracking-wider">
                                                <CheckCircle className="w-3 h-3 mr-1" /> OK
                                            </span>
                                        )}
                                        {item.status === "low" && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-warning/10 text-warning border border-warning/20 uppercase tracking-wider">
                                                <AlertCircle className="w-3 h-3 mr-1" /> Low
                                            </span>
                                        )}
                                        {item.status === "critical" && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-danger/10 text-danger border border-danger/20 uppercase tracking-wider">
                                                <AlertCircle className="w-3 h-3 mr-1" /> Crit
                                            </span>
                                        )}
                                        {item.status === "warning" && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-warning/10 text-warning border border-warning/20 uppercase tracking-wider">
                                                <AlertCircle className="w-3 h-3 mr-1" /> Warn
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
