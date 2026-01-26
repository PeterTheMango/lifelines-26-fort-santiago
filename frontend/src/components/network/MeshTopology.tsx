"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Map, { Marker, Source, Layer, MapRef } from "react-map-gl/mapbox";
import type { LineLayer } from "mapbox-gl";
import { X, Radio, Battery, Signal, Clock, Info } from "lucide-react";

interface Node {
    id: string;
    lat: number;
    lng: number;
    status: "online" | "offline" | "weak";
    role: "Gateway" | "Relay" | "Sensor";
    battery?: string;
    rssi?: string;
    lastSeen?: string;
}

// Centered on Fort Santiago, Manila (Intramuros)
const CENTER = { lat: 14.5939, lng: 120.9712 };

const initialNodes: Node[] = [
    { id: "Brain", lat: 14.5939, lng: 120.9712, status: "online", role: "Gateway", battery: "100%", rssi: "-30 dBm", lastSeen: "Now" },
    { id: "N-01", lat: 14.5945, lng: 120.9705, status: "online", role: "Sensor", battery: "85%", rssi: "-54 dBm", lastSeen: "2m" },
    { id: "N-02", lat: 14.5942, lng: 120.9720, status: "online", role: "Sensor", battery: "72%", rssi: "-60 dBm", lastSeen: "4m" },
    { id: "N-03", lat: 14.5930, lng: 120.9702, status: "weak", role: "Relay", battery: "45%", rssi: "-88 dBm", lastSeen: "8m" },
    { id: "N-04", lat: 14.5928, lng: 120.9725, status: "offline", role: "Sensor", battery: "0%", rssi: "N/A", lastSeen: "4h" },
    { id: "N-05", lat: 14.5935, lng: 120.9712, status: "online", role: "Sensor", battery: "92%", rssi: "-45 dBm", lastSeen: "Now" },
    { id: "N-06", lat: 14.5948, lng: 120.9710, status: "online", role: "Relay", battery: "60%", rssi: "-65 dBm", lastSeen: "12m" },
];

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Helper function to determine connection quality based on RSSI
function getConnectionQuality(rssiA: string, rssiB: string): { color: string; width: number; dashArray: number[] | null } {
    // Parse RSSI values (remove "dBm" and convert to number)
    const parseRSSI = (rssi: string) => {
        if (rssi === "N/A") return -999;
        return parseFloat(rssi.replace(" dBm", ""));
    };

    const avgRSSI = (parseRSSI(rssiA) + parseRSSI(rssiB)) / 2;

    if (avgRSSI === -999) {
        // Offline connection
        return { color: "#F87171", width: 1, dashArray: [1, 3] }; // Dotted danger
    } else if (avgRSSI > -70) {
        // Excellent
        return { color: "#4ADE80", width: 2, dashArray: null }; // Solid success
    } else if (avgRSSI >= -85) {
        // Good
        return { color: "#2DD4BF", width: 2, dashArray: null }; // Solid primary
    } else if (avgRSSI >= -100) {
        // Fair
        return { color: "#FBBF24", width: 1, dashArray: [2, 2] }; // Dashed warning
    } else {
        // Poor
        return { color: "#F87171", width: 1, dashArray: [1, 3] }; // Dotted danger
    }
}

interface MeshTopologyProps {
    showLegend: boolean;
    onToggleLegend: () => void;
}

export function MeshTopology({ showLegend, onToggleLegend }: MeshTopologyProps) {
    const mapRef = useRef<MapRef>(null);
    const [nodes] = useState(initialNodes);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [viewState, setViewState] = useState({
        latitude: CENTER.lat,
        longitude: CENTER.lng,
        zoom: 16
    });

    // Resize map when legend toggles
    useEffect(() => {
        const timer = setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.resize();
            }
        }, 350); // Slightly after the 300ms transition

        return () => clearTimeout(timer);
    }, [showLegend]);

    // Generate GeoJSON for connection lines
    const linkGeoJSON = useMemo(() => {
        const features = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeA = nodes[i];
                const nodeB = nodes[j];

                const dLat = nodeA.lat - nodeB.lat;
                const dLng = nodeA.lng - nodeB.lng;
                const dist = Math.sqrt(dLat * dLat + dLng * dLng);

                if (dist < 0.0025) {
                    const quality = getConnectionQuality(nodeA.rssi || "N/A", nodeB.rssi || "N/A");

                    features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: [[nodeA.lng, nodeA.lat], [nodeB.lng, nodeB.lat]]
                        },
                        properties: {
                            color: quality.color,
                            width: quality.width,
                            dashArray: quality.dashArray
                        }
                    });
                }
            }
        }
        return { type: 'FeatureCollection', features };
    }, [nodes]);

    // Dynamic line layer style based on connection quality
    const layerStyle: LineLayer = {
        id: 'mesh-links',
        type: 'line',
        source: 'mesh-data',
        paint: {
            'line-color': ['get', 'color'],
            'line-width': ['get', 'width'],
            'line-opacity': 0.7,
        }
    };

    if (!MAPBOX_TOKEN) {
        return (
            <div className="bg-surface w-full h-full flex items-center justify-center border border-border-subtle rounded-lg p-6 text-center">
                <div>
                    <p className="font-semibold text-text-primary mb-2">Mapbox Token Required</p>
                    <p className="text-sm text-text-secondary">
                        Add <span className="font-mono bg-surface-elevated px-2 py-0.5 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</span> to your .env.local file
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-surface relative w-full h-full overflow-hidden border border-border-subtle rounded-lg shadow-sm">
            {/* Grid Texture Background Overlay */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none opacity-30"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #1E2D21 1px, transparent 1px),
                        linear-gradient(to bottom, #1E2D21 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between pointer-events-none">
                {/* Map Header Badge */}
                <div className="bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border-subtle shadow-lg">
                    <span className="text-xs text-primary font-mono font-semibold tracking-wider flex items-center gap-2 uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" style={{ animationDuration: '2s' }} />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                        </span>
                        Mesh Network
                    </span>
                </div>

                {/* Legend Toggle Button */}
                <div className="relative pointer-events-auto">
                    <button
                        onClick={onToggleLegend}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className={`p-2 rounded-lg border shadow-lg transition-all ${
                            showLegend
                                ? 'bg-primary/20 border-primary text-primary'
                                : 'bg-surface/90 border-border-subtle text-text-secondary hover:text-primary hover:border-primary/50'
                        } backdrop-blur-md`}
                        aria-label={showLegend ? 'Hide legend' : 'Show legend'}
                    >
                        <Info className="h-4 w-4" />
                    </button>

                    {/* Tooltip */}
                    {showTooltip && (
                        <div className="absolute top-full right-0 mt-2 bg-surface-elevated/95 backdrop-blur-sm border border-border-default rounded-lg px-3 py-1.5 shadow-lg whitespace-nowrap animate-fadeIn" style={{ animationDuration: '150ms' }}>
                            <span className="text-xs text-text-secondary">
                                {showLegend ? 'Hide' : 'Show'} map legend
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Node Detail Popover */}
            {selectedNode && (
                <div className="absolute top-4 right-4 z-10 bg-surface-elevated border border-border-default rounded-lg shadow-2xl w-64 animate-fadeIn" style={{ animationDuration: '200ms' }}>
                    {/* Popover Header */}
                    <div className="bg-surface p-4 border-b border-border-subtle flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Radio className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-text-primary font-mono">{selectedNode.id}</h4>
                        </div>
                        <button
                            onClick={() => setSelectedNode(null)}
                            className="p-1 hover:bg-surface-elevated rounded transition-colors"
                            aria-label="Close details"
                        >
                            <X className="h-4 w-4 text-text-secondary" />
                        </button>
                    </div>

                    {/* Popover Body */}
                    <div className="p-4 space-y-3">
                        {/* Role */}
                        <div className="flex items-center justify-between">
                            <span className="text-text-muted text-xs uppercase tracking-wide">Role</span>
                            <span className="text-text-primary text-sm font-medium">{selectedNode.role}</span>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between">
                            <span className="text-text-muted text-xs uppercase tracking-wide">Status</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    selectedNode.status === 'online' ? 'bg-success animate-pulse' :
                                    selectedNode.status === 'weak' ? 'bg-warning animate-pulse' :
                                    'bg-danger'
                                }`} style={{ animationDuration: selectedNode.status === 'weak' ? '1s' : '2s' }} />
                                <span className={`text-sm font-medium capitalize ${
                                    selectedNode.status === 'online' ? 'text-success' :
                                    selectedNode.status === 'weak' ? 'text-warning' :
                                    'text-danger'
                                }`}>
                                    {selectedNode.status}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-border-subtle pt-3 space-y-2">
                            {/* RSSI */}
                            <div className="flex items-center gap-2">
                                <Signal className="h-3.5 w-3.5 text-text-muted" />
                                <span className="text-text-secondary text-xs">Signal:</span>
                                <span className="text-text-primary text-sm font-mono ml-auto">{selectedNode.rssi}</span>
                            </div>

                            {/* Battery */}
                            <div className="flex items-center gap-2">
                                <Battery className="h-3.5 w-3.5 text-text-muted" />
                                <span className="text-text-secondary text-xs">Battery:</span>
                                <span className="text-text-primary text-sm font-mono ml-auto">{selectedNode.battery}</span>
                            </div>

                            {/* Last Seen */}
                            <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-text-muted" />
                                <span className="text-text-secondary text-xs">Last seen:</span>
                                <span className="text-text-primary text-sm font-mono ml-auto">{selectedNode.lastSeen}</span>
                            </div>
                        </div>

                        {/* Coordinates */}
                        <div className="bg-background rounded-lg p-2 mt-3">
                            <p className="text-text-muted text-[0.625rem] uppercase tracking-wide mb-1">Coordinates</p>
                            <p className="text-text-secondary font-mono text-xs">
                                {selectedNode.lat.toFixed(4)}°N, {selectedNode.lng.toFixed(4)}°E
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Map
                ref={mapRef}
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                {/* Connection Lines Layer */}
                <Source id="mesh-data" type="geojson" data={linkGeoJSON as any}>
                    <Layer {...layerStyle} />
                </Source>

                {/* Node Markers */}
                {nodes.map((node) => {
                    const isBrain = node.id === "Brain";
                    const isSelected = selectedNode?.id === node.id;

                    return (
                        <Marker key={node.id} longitude={node.lng} latitude={node.lat} anchor="center">
                            <button
                                onClick={() => setSelectedNode(node)}
                                className="group relative flex flex-col items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-full"
                                aria-label={`View details for node ${node.id}`}
                            >
                                {/* Glow for Brain Hub */}
                                {isBrain && (
                                    <div className="absolute -inset-3 bg-success/30 rounded-full blur-lg" />
                                )}

                                {/* Pulse Animation for Active Nodes */}
                                {node.status === 'online' && !isBrain && (
                                    <div className="absolute -inset-2 bg-success/20 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
                                )}
                                {node.status === 'weak' && (
                                    <div className="absolute -inset-2 bg-warning/20 rounded-full animate-pulse" style={{ animationDuration: '1s' }} />
                                )}

                                {/* Node Circle */}
                                <div className={`
                                    relative w-5 h-5 rounded-full border-2 shadow-lg transition-all duration-300
                                    ${isSelected ? 'scale-125 ring-2 ring-primary ring-offset-2 ring-offset-background' : 'group-hover:scale-110'}
                                    ${node.status === 'offline' ? 'bg-danger border-background border-dashed' :
                                      node.status === 'weak' ? 'bg-warning border-background' :
                                      'bg-success border-background'}
                                `} />

                                {/* Hover Tooltip */}
                                <div className="absolute top-7 bg-surface-elevated/95 backdrop-blur-sm text-[10px] px-2 py-1 rounded border border-border-default opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg">
                                    <span className="font-mono font-semibold text-primary">{node.id}</span>
                                    <span className="text-text-muted mx-1">•</span>
                                    <span className="text-text-secondary">{node.role}</span>
                                </div>
                            </button>
                        </Marker>
                    );
                })}
            </Map>
        </div>
    );
}
