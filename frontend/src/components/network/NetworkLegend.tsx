"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

export function NetworkLegend() {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-surface border border-border-subtle rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
            {/* Card Header - Collapsible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-surface-elevated p-4 border-b border-border-subtle flex items-center justify-between hover:bg-surface-elevated/80 transition-colors w-full text-left"
            >
                <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-info" />
                    <h3 className="font-semibold text-text-primary uppercase tracking-wider text-sm">
                        Map Legend
                    </h3>
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-text-secondary" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-text-secondary" />
                )}
            </button>

            {/* Card Body - Legend Content */}
            {isExpanded && (
                <div className="p-4 space-y-4 animate-fadeIn" style={{ animationDuration: '200ms' }}>
                    {/* Node Status Section */}
                    <div>
                        <h4 className="text-text-secondary text-[0.75rem] uppercase tracking-wide font-semibold mb-3">
                            Node Status
                        </h4>
                        <div className="space-y-2.5">
                            {/* Brain Hub */}
                            <div className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-success/20 rounded-full blur-md" />
                                    <div className="relative w-4 h-4 rounded-full bg-success border-2 border-background" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-text-primary text-sm font-medium">Brain Hub</p>
                                    <p className="text-text-muted text-[0.625rem]">Gateway node with glow</p>
                                </div>
                            </div>

                            {/* Online (Strong) */}
                            <div className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-success/20 rounded-full animate-pulse" />
                                    <div className="relative w-4 h-4 rounded-full bg-success border-2 border-background" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-text-primary text-sm font-medium">Online</p>
                                    <p className="text-text-muted text-[0.625rem]">Strong signal, active</p>
                                </div>
                            </div>

                            {/* Weak/Degraded */}
                            <div className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-warning/20 rounded-full animate-pulse" style={{ animationDuration: '1s' }} />
                                    <div className="relative w-4 h-4 rounded-full bg-warning border-2 border-background" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-text-primary text-sm font-medium">Weak Signal</p>
                                    <p className="text-text-muted text-[0.625rem]">Degraded connectivity</p>
                                </div>
                            </div>

                            {/* Offline */}
                            <div className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center">
                                    <div className="relative w-4 h-4 rounded-full bg-danger border-2 border-background border-dashed" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-text-primary text-sm font-medium">Offline</p>
                                    <p className="text-text-muted text-[0.625rem]">No connection</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border-subtle" />

                    {/* Connection Quality Section */}
                    <div>
                        <h4 className="text-text-secondary text-[0.75rem] uppercase tracking-wide font-semibold mb-3">
                            Connection Quality
                        </h4>
                        <div className="space-y-2.5">
                            {/* Excellent */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-0.5 bg-success rounded" />
                                <div className="flex-1">
                                    <p className="text-text-primary text-sm font-medium">Excellent</p>
                                    <p className="text-text-muted text-[0.625rem] font-mono">&gt; -70 dBm</p>
                                </div>
                            </div>

                            {/* Good */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-0.5 bg-primary rounded" />
                                <div className="flex-1">
                                    <p className="text-text-primary text-sm font-medium">Good</p>
                                    <p className="text-text-muted text-[0.625rem] font-mono">-70 to -85 dBm</p>
                                </div>
                            </div>

                            {/* Fair */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-0.5 border-t border-dashed border-warning" style={{ borderWidth: '1.5px' }} />
                                <div className="flex-1">
                                    <p className="text-text-primary text-sm font-medium">Fair</p>
                                    <p className="text-text-muted text-[0.625rem] font-mono">-85 to -100 dBm</p>
                                </div>
                            </div>

                            {/* Poor */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-0.5 border-t border-dotted border-danger" style={{ borderWidth: '1.5px' }} />
                                <div className="flex-1">
                                    <p className="text-text-primary text-sm font-medium">Poor</p>
                                    <p className="text-text-muted text-[0.625rem] font-mono">&lt; -100 dBm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="bg-info/10 border border-info/20 rounded-lg p-3">
                        <p className="text-text-secondary text-[0.625rem] leading-relaxed">
                            Click any node on the map to view detailed telemetry including battery level, role, and last seen timestamp.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
