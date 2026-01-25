"use client";

import { Signal, Battery, WifiOff, Wifi } from "lucide-react";

const nodes = [
    { id: "Brain", role: "Gateway", battery: "100%", rssi: "-30 dBm", status: "online", lastSeen: "Now" },
    { id: "N-01", role: "Sensor", battery: "85%", rssi: "-54 dBm", status: "online", lastSeen: "2m" },
    { id: "N-02", role: "Sensor", battery: "72%", rssi: "-60 dBm", status: "online", lastSeen: "4m" },
    { id: "N-03", role: "Relay", battery: "45%", rssi: "-88 dBm", status: "weak", lastSeen: "8m" },
    { id: "N-04", role: "Sensor", battery: "0%", rssi: "N/A", status: "offline", lastSeen: "4h" },
    { id: "N-05", role: "Sensor", battery: "92%", rssi: "-45 dBm", status: "online", lastSeen: "Now" },
    { id: "N-06", role: "Relay", battery: "60%", rssi: "-65 dBm", status: "online", lastSeen: "12m" },
    { id: "N-07", role: "Sensor", battery: "78%", rssi: "-58 dBm", status: "online", lastSeen: "3m" },
];

export function NodeList() {
    return (
        <div className="bg-surface border border-border-subtle rounded-lg overflow-hidden flex flex-col h-full shadow-sm">
            <div className="bg-surface-elevated p-4 border-b border-border-subtle flex justify-between items-center">
                <h3 className="font-bold text-text-primary uppercase tracking-wider text-sm">Node Status</h3>
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">98.5% Uptime</span>
            </div>
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#0f172a] text-text-muted font-mono text-xs sticky top-0">
                        <tr>
                            <th className="px-4 py-3 border-b border-border-subtle bg-surface-elevated">ID</th>
                            <th className="px-4 py-3 border-b border-border-subtle bg-surface-elevated">Signal (RSSI)</th>
                            <th className="px-4 py-3 border-b border-border-subtle bg-surface-elevated">Battery</th>
                            <th className="px-4 py-3 border-b border-border-subtle bg-surface-elevated">Last Seen</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                        {nodes.map(node => (
                            <tr key={node.id} className="hover:bg-surface-elevated transition-colors group">
                                <td className="px-4 py-3 font-bold text-text-primary">
                                    <div className="flex flex-col">
                                        <span>{node.id}</span>
                                        <span className="text-[10px] text-text-muted font-normal uppercase">{node.role}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-text-secondary">
                                    <div className="flex items-center gap-2">
                                        {node.status === 'offline' ? (
                                            <WifiOff className="h-3 w-3 text-text-muted" />
                                        ) : (
                                            <Signal className={`h-3 w-3 ${node.status === 'weak' ? 'text-warning' : 'text-success'}`} />
                                        )}
                                        <span className={node.status === 'offline' ? 'text-text-muted' : ''}>{node.rssi}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-text-secondary">
                                    <div className="flex items-center gap-2">
                                        <Battery className={`h-3 w-3 ${parseInt(node.battery) < 20 ? 'text-danger' : 'text-success'}`} />
                                        <span>{node.battery}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {node.status === 'offline' ? (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-danger/10 text-danger border border-danger/20">
                                            OFFLINE
                                        </span>
                                    ) : (
                                        <span className="text-xs text-text-muted font-mono">
                                            {node.lastSeen}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
