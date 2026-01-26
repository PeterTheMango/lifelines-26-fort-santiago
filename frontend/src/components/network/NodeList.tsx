"use client";

import { Signal, Battery, WifiOff, Radio } from "lucide-react";

const nodes = [
    { id: "Brain", role: "Gateway", battery: "100%", rssi: "-30 dBm", status: "online", lastSeen: "Now" },
    { id: "N-01", role: "Sensor", battery: "85%", rssi: "-54 dBm", status: "online", lastSeen: "2m" },
    { id: "N-02", role: "Sensor", battery: "72%", rssi: "-60 dBm", status: "online", lastSeen: "4m" },
    { id: "N-03", role: "Relay", battery: "45%", rssi: "-88 dBm", status: "weak", lastSeen: "8m" },
    { id: "N-04", role: "Sensor", battery: "0%", rssi: "N/A", status: "offline", lastSeen: "4h" },
    { id: "N-05", role: "Sensor", battery: "92%", rssi: "-45 dBm", status: "online", lastSeen: "Now" },
    { id: "N-06", role: "Relay", battery: "60%", rssi: "-65 dBm", status: "online", lastSeen: "12m" },
];

export function NodeList() {
    return (
        <div className="bg-surface border border-border-subtle rounded-lg overflow-hidden flex flex-col h-full shadow-sm">
            {/* Card Header */}
            <div className="bg-surface-elevated p-4 border-b border-border-subtle flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-text-primary uppercase tracking-wider text-sm">
                        Node Telemetry
                    </h3>
                </div>
                <span className="text-[0.75rem] font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                    {nodes.filter(n => n.status !== 'offline').length}/{nodes.length} Active
                </span>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-text-muted text-xs sticky top-0 bg-surface-elevated z-10">
                        <tr>
                            <th className="px-4 py-3 border-b border-border-subtle font-medium uppercase tracking-wide">
                                Node ID
                            </th>
                            <th className="px-4 py-3 border-b border-border-subtle font-medium uppercase tracking-wide">
                                Signal
                            </th>
                            <th className="px-4 py-3 border-b border-border-subtle font-medium uppercase tracking-wide">
                                Battery
                            </th>
                            <th className="px-4 py-3 border-b border-border-subtle font-medium uppercase tracking-wide">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                        {nodes.map(node => {
                            const batteryLevel = parseInt(node.battery);
                            const isBrain = node.id === "Brain";

                            return (
                                <tr
                                    key={node.id}
                                    className="hover:bg-surface-elevated transition-colors group"
                                >
                                    {/* Node ID & Role */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {/* Status Indicator */}
                                            <div className="relative flex items-center justify-center flex-shrink-0">
                                                {isBrain && (
                                                    <div className="absolute inset-0 bg-success/20 rounded-full blur-sm" />
                                                )}
                                                {node.status === 'online' && (
                                                    <div className="absolute -inset-1 bg-success/20 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
                                                )}
                                                {node.status === 'weak' && (
                                                    <div className="absolute -inset-1 bg-warning/20 rounded-full animate-pulse" style={{ animationDuration: '1s' }} />
                                                )}
                                                <div className={`
                                                    relative w-2.5 h-2.5 rounded-full
                                                    ${node.status === 'offline' ? 'bg-danger border border-danger/50 border-dashed' :
                                                      node.status === 'weak' ? 'bg-warning' :
                                                      'bg-success'}
                                                `} />
                                            </div>

                                            {/* ID and Role */}
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-text-primary font-mono">
                                                    {node.id}
                                                </span>
                                                <span className="text-[0.625rem] text-text-muted uppercase tracking-wide">
                                                    {node.role}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Signal (RSSI) */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {node.status === 'offline' ? (
                                                <WifiOff className="h-3.5 w-3.5 text-danger flex-shrink-0" />
                                            ) : (
                                                <Signal className={`h-3.5 w-3.5 flex-shrink-0 ${
                                                    node.status === 'weak' ? 'text-warning' : 'text-success'
                                                }`} />
                                            )}
                                            <span className={`font-mono text-sm ${
                                                node.status === 'offline' ? 'text-text-muted' : 'text-text-secondary'
                                            }`}>
                                                {node.rssi}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Battery */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Battery className={`h-3.5 w-3.5 flex-shrink-0 ${
                                                batteryLevel === 0 ? 'text-danger' :
                                                batteryLevel < 20 ? 'text-warning' :
                                                'text-success'
                                            }`} />
                                            <span className="font-mono text-sm text-text-secondary">
                                                {node.battery}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status / Last Seen */}
                                    <td className="px-4 py-3">
                                        {node.status === 'offline' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.625rem] uppercase font-semibold bg-danger/10 text-danger border border-danger/20">
                                                Offline
                                            </span>
                                        ) : node.status === 'weak' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.625rem] uppercase font-semibold bg-warning/10 text-warning border border-warning/20">
                                                Weak
                                            </span>
                                        ) : (
                                            <span className="text-xs text-text-muted font-mono">
                                                {node.lastSeen}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Optional Footer with Summary */}
            <div className="bg-surface-elevated p-3 border-t border-border-subtle">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            <span className="text-text-secondary">
                                {nodes.filter(n => n.status === 'online').length} Online
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-warning" />
                            <span className="text-text-secondary">
                                {nodes.filter(n => n.status === 'weak').length} Weak
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-danger" />
                            <span className="text-text-secondary">
                                {nodes.filter(n => n.status === 'offline').length} Offline
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
