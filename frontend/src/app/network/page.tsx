"use client";

import { useState } from "react";
import { MeshTopology } from "@/components/network/MeshTopology";
import { NodeList } from "@/components/network/NodeList";
import { NetworkStats } from "@/components/network/NetworkStats";
import { NetworkLegend } from "@/components/network/NetworkLegend";
import { AlertTriangle, X } from "lucide-react";

export default function NetworkPage() {
    const [showAlert, setShowAlert] = useState(true);
    const [showLegend, setShowLegend] = useState(true);

    return (
        <div className="space-y-4 md:space-y-6 min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)] flex flex-col">
            {/* Page Header */}
            <div>
                <h1 className="text-[1.563rem] font-semibold text-text-primary tracking-tight leading-tight">
                    Network Health
                </h1>
                <p className="text-text-secondary mt-1 text-[0.875rem]">
                    LoRa mesh topology and node telemetry
                </p>
            </div>

            {/* Alert Banner - Critical Network Issues */}
            {showAlert && (
                <div
                    className="relative bg-danger/15 border-l-4 border-danger rounded-lg p-4 flex items-start gap-3 animate-fadeIn"
                    style={{ animationDuration: '200ms' }}
                >
                    <AlertTriangle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="text-text-primary text-sm font-medium">
                            Node N-04 offline for 4 hours — Resupply or inspection required
                        </p>
                        <p className="text-text-secondary text-xs mt-1">
                            Last known location: Southeast sector (14.5928°N, 120.9725°E)
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAlert(false)}
                        className="flex-shrink-0 p-1 hover:bg-danger/20 rounded transition-colors"
                        aria-label="Dismiss alert"
                    >
                        <X className="h-4 w-4 text-danger" />
                    </button>
                </div>
            )}

            {/* Bento Grid Layout */}
            <div className="flex-1 flex flex-col gap-4 md:gap-6">
                {/* Top Row: Network Overview (50%) + Node Telemetry (50%) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="min-h-[300px]">
                        <NetworkStats />
                    </div>
                    <div className="min-h-[300px]">
                        <NodeList />
                    </div>
                </div>

                {/* Bottom Row: Topology View (70%) + Map Legend (30%) */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-4 md:gap-6 min-h-[500px]">
                    <div className={`min-h-[400px] lg:min-h-0 ${
                        showLegend ? 'lg:col-span-7' : 'lg:col-span-10'
                    }`}>
                        <MeshTopology
                            showLegend={showLegend}
                            onToggleLegend={() => setShowLegend(!showLegend)}
                        />
                    </div>

                    {/* Desktop: Slide in/out legend */}
                    <div className={`hidden lg:block lg:col-span-3 min-h-0 transition-all duration-300 ${
                        showLegend ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'
                    }`}>
                        <NetworkLegend />
                    </div>

                    {/* Mobile: Modal overlay legend */}
                    {showLegend && (
                        <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fadeIn" onClick={() => setShowLegend(false)}>
                            <div className="w-[90%] max-w-md max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                                <NetworkLegend />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
