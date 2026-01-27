"use client";

import { Radio, Activity, WifiOff, TrendingUp } from "lucide-react";

export function NetworkStats() {
    const stats = {
        totalNodes: 8,
        onlineNodes: 6,
        offlineNodes: 1,
        weakNodes: 1,
        uptime: 98.5,
        avgSignal: -58.2,
    };

    return (
        <div className="bg-surface border border-border-subtle rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
            {/* Card Header */}
            <div className="bg-surface-elevated p-4 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-text-primary uppercase tracking-wider text-sm">
                        Network Overview
                    </h3>
                </div>
            </div>

            {/* Card Body - Stats Grid */}
            <div className="p-4 space-y-4 flex-1">
                {/* Primary Stat - Uptime */}
                <div className="bg-surface-elevated rounded-lg p-4 border border-border-subtle">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-text-secondary text-xs uppercase tracking-wide font-medium mb-1">
                                Network Uptime
                            </p>
                            <p className="text-text-primary font-mono text-3xl font-bold tracking-tight">
                                {stats.uptime}%
                            </p>
                        </div>
                        <div className="bg-success/10 p-2 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-success" />
                        </div>
                    </div>
                    <div className="mt-3 h-2 bg-background rounded-full overflow-hidden">
                        <div
                            className="h-full bg-success rounded-full transition-all duration-500"
                            style={{ width: `${stats.uptime}%` }}
                        />
                    </div>
                </div>

                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Total Nodes */}
                    <div className="bg-surface-elevated rounded-lg p-3 border border-border-subtle">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <p className="text-text-muted text-[0.75rem] uppercase tracking-wide font-medium">
                                Total
                            </p>
                        </div>
                        <p className="text-text-primary font-mono text-2xl font-bold">
                            {stats.totalNodes}
                        </p>
                        <p className="text-text-secondary text-[0.75rem] mt-0.5">nodes</p>
                    </div>

                    {/* Online Nodes */}
                    <div className="bg-surface-elevated rounded-lg p-3 border border-border-subtle">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            <p className="text-text-muted text-[0.75rem] uppercase tracking-wide font-medium">
                                Online
                            </p>
                        </div>
                        <p className="text-success font-mono text-2xl font-bold">
                            {stats.onlineNodes}
                        </p>
                        <p className="text-text-secondary text-[0.75rem] mt-0.5">active</p>
                    </div>

                    {/* Weak Nodes */}
                    <div className="bg-surface-elevated rounded-lg p-3 border border-border-subtle">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-warning" />
                            <p className="text-text-muted text-[0.75rem] uppercase tracking-wide font-medium">
                                Weak
                            </p>
                        </div>
                        <p className="text-warning font-mono text-2xl font-bold">
                            {stats.weakNodes}
                        </p>
                        <p className="text-text-secondary text-[0.75rem] mt-0.5">degraded</p>
                    </div>

                    {/* Offline Nodes */}
                    <div className="bg-surface-elevated rounded-lg p-3 border border-border-subtle">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-danger" />
                            <p className="text-text-muted text-[0.75rem] uppercase tracking-wide font-medium">
                                Offline
                            </p>
                        </div>
                        <p className="text-danger font-mono text-2xl font-bold">
                            {stats.offlineNodes}
                        </p>
                        <p className="text-text-secondary text-[0.75rem] mt-0.5">down</p>
                    </div>
                </div>

                {/* Average Signal Strength */}
                <div className="bg-surface-elevated rounded-lg p-3 border border-border-subtle">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-muted text-[0.75rem] uppercase tracking-wide font-medium mb-1">
                                Avg Signal (RSSI)
                            </p>
                            <p className="text-text-primary font-mono text-xl font-bold">
                                {stats.avgSignal} dBm
                            </p>
                        </div>
                        <Activity className="h-5 w-5 text-primary-muted" />
                    </div>
                    {/* Signal Quality Indicator */}
                    <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-success via-primary to-warning rounded-full"
                                style={{ width: '75%' }}
                            />
                        </div>
                        <span className="text-text-secondary text-[0.625rem] font-mono">Good</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
