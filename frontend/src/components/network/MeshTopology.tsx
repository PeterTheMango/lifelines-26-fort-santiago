"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Map, { Marker, Source, Layer, MapRef } from "react-map-gl/mapbox";
import type { LineLayer } from "mapbox-gl";
import { X, Radio, Battery, Signal, Clock, Info, Brain, Router, Settings } from "lucide-react";
import { ToggleGroup } from "@/components/ui/ToggleGroup";

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

// Helper function to calculate convex hull using Graham's scan algorithm
function convexHull(points: { lat: number; lng: number }[]): { lat: number; lng: number }[] {
    if (points.length < 3) return points;

    // Find the point with the lowest y-coordinate (and leftmost if tied)
    let pivot = points[0];
    for (let i = 1; i < points.length; i++) {
        if (points[i].lat < pivot.lat || (points[i].lat === pivot.lat && points[i].lng < pivot.lng)) {
            pivot = points[i];
        }
    }

    // Sort points by polar angle with respect to pivot
    const sortedPoints = points.filter(p => p !== pivot).sort((a, b) => {
        const angleA = Math.atan2(a.lat - pivot.lat, a.lng - pivot.lng);
        const angleB = Math.atan2(b.lat - pivot.lat, b.lng - pivot.lng);
        if (angleA !== angleB) return angleA - angleB;
        // If angles are equal, sort by distance
        const distA = Math.sqrt((a.lat - pivot.lat) ** 2 + (a.lng - pivot.lng) ** 2);
        const distB = Math.sqrt((b.lat - pivot.lat) ** 2 + (b.lng - pivot.lng) ** 2);
        return distA - distB;
    });

    if (sortedPoints.length === 0) return [pivot];
    if (sortedPoints.length === 1) return [pivot, sortedPoints[0]];

    // Build the hull
    const hull = [pivot, sortedPoints[0]];

    for (let i = 1; i < sortedPoints.length; i++) {
        // Remove points that make a right turn
        while (hull.length > 1) {
            const top = hull[hull.length - 1];
            const nextToTop = hull[hull.length - 2];

            // Calculate cross product to determine turn direction
            const cross = (top.lng - nextToTop.lng) * (sortedPoints[i].lat - nextToTop.lat) -
                         (top.lat - nextToTop.lat) * (sortedPoints[i].lng - nextToTop.lng);

            if (cross > 0) break; // Left turn, keep the point
            hull.pop(); // Right turn or collinear, remove the point
        }

        hull.push(sortedPoints[i]);
    }

    return hull;
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
    const [showSettings, setShowSettings] = useState(false);
    const [showSettingsTooltip, setShowSettingsTooltip] = useState(false);
    const [viewState, setViewState] = useState({
        latitude: CENTER.lat,
        longitude: CENTER.lng,
        zoom: 16
    });

    // Settings state
    const [connectionView, setConnectionView] = useState<"Connection" | "Hybrid" | "Perimeter" | "Off">("Perimeter");
    const [filterByType, setFilterByType] = useState<"Brain" | "Nodes" | "All">("All");
    const [filterByStatus, setFilterByStatus] = useState<"Online" | "Weak" | "Offline" | "All">("All");
    const [filterByQuality, setFilterByQuality] = useState<"Excellent" | "Good" | "Fair" | "Poor" | "All">("All");

    // Resize map when legend toggles
    useEffect(() => {
        const timer = setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.resize();
            }
        }, 350); // Slightly after the 300ms transition

        return () => clearTimeout(timer);
    }, [showLegend]);

    // Helper function to get connection quality category from RSSI
    const getQualityCategory = (rssi: string): "Excellent" | "Good" | "Fair" | "Poor" => {
        if (rssi === "N/A") return "Poor";
        const rssiValue = parseFloat(rssi.replace(" dBm", ""));
        if (rssiValue > -70) return "Excellent";
        if (rssiValue >= -85) return "Good";
        if (rssiValue >= -100) return "Fair";
        return "Poor";
    };

    // Filter nodes based on current filter settings
    const filteredNodes = useMemo(() => {
        return nodes.filter(node => {
            // Filter by type
            const isBrain = node.id === "Brain";
            if (filterByType === "Brain" && !isBrain) return false;
            if (filterByType === "Nodes" && isBrain) return false;

            // Filter by status
            if (filterByStatus !== "All" && node.status !== filterByStatus.toLowerCase()) return false;

            // Filter by connection quality (based on RSSI)
            if (filterByQuality !== "All") {
                const quality = getQualityCategory(node.rssi || "N/A");
                if (quality !== filterByQuality) return false;
            }

            return true;
        });
    }, [nodes, filterByType, filterByStatus, filterByQuality]);

    // Generate GeoJSON for zone polygons (Perimeter view)
    const zoneGeoJSON = useMemo(() => {
        if (connectionView !== "Perimeter") {
            return { type: 'FeatureCollection', features: [] };
        }

        const features = [];

        // Helper function to find all neighbors of a node, sorted by distance
        const findNeighbors = (node: Node, allNodes: Node[]) => {
            const neighbors: { node: Node; dist: number }[] = [];

            for (const other of allNodes) {
                if (other.id === node.id) continue;

                const dLat = node.lat - other.lat;
                const dLng = node.lng - other.lng;
                const dist = Math.sqrt(dLat * dLat + dLng * dLng);

                neighbors.push({ node: other, dist });
            }

            // Sort by distance (closest first)
            return neighbors.sort((a, b) => a.dist - b.dist);
        };

        // Build clusters based on node connectivity
        // Each cluster represents nodes that form a mesh group
        const buildCluster = (statusNodes: Node[]) => {
            if (statusNodes.length === 0) return [];

            const clusterPoints: { lat: number; lng: number }[] = [];
            const visited = new Set<string>();

            // For each node of this status, include it and its nearest neighbors
            for (const node of statusNodes) {
                if (visited.has(node.id)) continue;

                clusterPoints.push({ lat: node.lat, lng: node.lng });
                visited.add(node.id);

                // Find nearest neighbors (any status) to create mesh connectivity
                const neighbors = findNeighbors(node, filteredNodes);

                // Add the two nearest neighbors to show mesh connectivity
                for (let i = 0; i < Math.min(2, neighbors.length); i++) {
                    const neighbor = neighbors[i].node;
                    const key = `${neighbor.lat},${neighbor.lng}`;
                    if (!clusterPoints.some(p => `${p.lat},${p.lng}` === key)) {
                        clusterPoints.push({ lat: neighbor.lat, lng: neighbor.lng });
                    }
                }
            }

            return clusterPoints;
        };

        // Group nodes by status (only online and weak)
        const onlineNodes = filteredNodes.filter(n => n.id !== "Brain" && n.status === "online");
        const weakNodes = filteredNodes.filter(n => n.id !== "Brain" && n.status === "weak");

        // Helper function to check if a point is inside a polygon using ray casting
        const isPointInPolygon = (point: { lat: number; lng: number }, polygon: { lat: number; lng: number }[]): boolean => {
            let inside = false;
            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                const xi = polygon[i].lng, yi = polygon[i].lat;
                const xj = polygon[j].lng, yj = polygon[j].lat;

                const intersect = ((yi > point.lat) !== (yj > point.lat))
                    && (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        };

        // Create zones for each status group
        const createZoneFeature = (statusNodes: Node[], color: string, fillOpacity: number) => {
            const clusterPoints = buildCluster(statusNodes);

            if (clusterPoints.length < 3) return null;

            // Use convex hull to create the zone boundary
            const hull = convexHull(clusterPoints);

            if (hull.length < 3) return null;

            // Close the polygon by adding the first point at the end
            const coordinates = [...hull.map(p => [p.lng, p.lat]), [hull[0].lng, hull[0].lat]];

            return {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [coordinates]
                },
                properties: {
                    color,
                    fillOpacity
                },
                hull // Store hull for point-in-polygon check
            };
        };

        // Create online zone first
        const onlineZoneData = onlineNodes.length > 0 ? createZoneFeature(onlineNodes, "#4ADE80", 0.3) : null;

        // Filter out weak nodes that are inside the online zone (they should be treated as online)
        let effectiveWeakNodes = weakNodes;
        if (onlineZoneData && onlineZoneData.hull) {
            effectiveWeakNodes = weakNodes.filter(weakNode => {
                const point = { lat: weakNode.lat, lng: weakNode.lng };
                return !isPointInPolygon(point, onlineZoneData.hull);
            });
        }

        // Create weak zone only with nodes outside the online zone
        const weakZoneData = effectiveWeakNodes.length > 0 ? createZoneFeature(effectiveWeakNodes, "#FBBF24", 0.3) : null;

        // Add zones with layering priority: weak (bottom) -> online (top)
        if (weakZoneData) features.push({ ...weakZoneData, hull: undefined }); // Remove hull from output
        if (onlineZoneData) features.push({ ...onlineZoneData, hull: undefined }); // Remove hull from output

        return { type: 'FeatureCollection', features };
    }, [filteredNodes, connectionView]);

    // Generate GeoJSON for connection lines (non-Perimeter views)
    const linkGeoJSON = useMemo(() => {
        if (connectionView === "Off" || connectionView === "Perimeter") {
            return { type: 'FeatureCollection', features: [] };
        }

        const features = [];
        const brainNode = filteredNodes.find(n => n.id === "Brain");

        for (let i = 0; i < filteredNodes.length; i++) {
            for (let j = i + 1; j < filteredNodes.length; j++) {
                const nodeA = filteredNodes[i];
                const nodeB = filteredNodes[j];

                const dLat = nodeA.lat - nodeB.lat;
                const dLng = nodeA.lng - nodeB.lng;
                const dist = Math.sqrt(dLat * dLat + dLng * dLng);

                // Determine if this connection should be shown based on view mode
                let shouldShow = false;
                const isBrainConnection = nodeA.id === "Brain" || nodeB.id === "Brain";

                if (connectionView === "Connection") {
                    // Show all connections within range
                    shouldShow = dist < 0.0025;
                } else if (connectionView === "Hybrid") {
                    // Show Brain connections and nearby node-to-node connections
                    shouldShow = dist < 0.0025 && (isBrainConnection || dist < 0.0015);
                }

                if (shouldShow) {
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
    }, [filteredNodes, connectionView]);

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

                {/* Control Buttons */}
                <div className="flex gap-2 pointer-events-auto">
                    {/* Settings Toggle Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            onMouseEnter={() => setShowSettingsTooltip(true)}
                            onMouseLeave={() => setShowSettingsTooltip(false)}
                            className={`p-2 rounded-lg border shadow-lg transition-all ${
                                showSettings
                                    ? 'bg-primary/20 border-primary text-primary'
                                    : 'bg-surface/90 border-border-subtle text-text-secondary hover:text-primary hover:border-primary/50'
                            } backdrop-blur-md`}
                            aria-label={showSettings ? 'Hide settings' : 'Show settings'}
                        >
                            <Settings className="h-4 w-4" />
                        </button>

                        {/* Tooltip */}
                        {showSettingsTooltip && !showSettings && (
                            <div className="absolute top-full right-0 mt-2 bg-surface-elevated/95 backdrop-blur-sm border border-border-default rounded-lg px-3 py-1.5 shadow-lg whitespace-nowrap animate-fadeIn" style={{ animationDuration: '150ms' }}>
                                <span className="text-xs text-text-secondary">
                                    Map settings
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Legend Toggle Button */}
                    <div className="relative">
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
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="absolute top-16 right-4 z-10 bg-surface-elevated border border-border-default rounded-lg shadow-2xl w-80 animate-fadeIn" style={{ animationDuration: '200ms' }}>
                    {/* Settings Header */}
                    <div className="bg-surface p-4 border-b border-border-subtle flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-text-primary">Map Settings</h4>
                        </div>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="p-1 hover:bg-surface-elevated rounded transition-colors"
                            aria-label="Close settings"
                        >
                            <X className="h-4 w-4 text-text-secondary" />
                        </button>
                    </div>

                    {/* Settings Body */}
                    <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                        {/* Connection View Toggle */}
                        <ToggleGroup
                            label="Connection View"
                            options={[
                                { value: "Connection", label: "Connection" },
                                { value: "Hybrid", label: "Hybrid" },
                                { value: "Perimeter", label: "Perimeter" },
                                { value: "Off", label: "Off" }
                            ]}
                            value={connectionView}
                            onChange={(value) => setConnectionView(value as typeof connectionView)}
                        />

                        <div className="border-t border-border-subtle pt-4">
                            <p className="text-xs text-text-muted uppercase tracking-wide font-medium mb-3">Filters</p>

                            {/* Filter by Type */}
                            <ToggleGroup
                                label="By Type"
                                options={[
                                    { value: "Brain", label: "Brain" },
                                    { value: "Nodes", label: "Nodes" },
                                    { value: "All", label: "All" }
                                ]}
                                value={filterByType}
                                onChange={(value) => setFilterByType(value as typeof filterByType)}
                                className="mb-4"
                            />

                            {/* Filter by Status */}
                            <ToggleGroup
                                label="By Status"
                                options={[
                                    { value: "Online", label: "Online" },
                                    { value: "Weak", label: "Weak" },
                                    { value: "Offline", label: "Offline" },
                                    { value: "All", label: "All" }
                                ]}
                                value={filterByStatus}
                                onChange={(value) => setFilterByStatus(value as typeof filterByStatus)}
                                className="mb-4"
                            />

                            {/* Filter by Connection Quality */}
                            <ToggleGroup
                                label="By Connection Quality"
                                options={[
                                    { value: "Excellent", label: "Excellent" },
                                    { value: "Good", label: "Good" },
                                    { value: "Fair", label: "Fair" },
                                    { value: "Poor", label: "Poor" },
                                    { value: "All", label: "All" }
                                ]}
                                value={filterByQuality}
                                onChange={(value) => setFilterByQuality(value as typeof filterByQuality)}
                            />
                        </div>
                    </div>
                </div>
            )}

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
                {/* Zone Polygon Layers (Perimeter View) */}
                <Source id="zone-data" type="geojson" data={zoneGeoJSON as any}>
                    <Layer
                        id="zone-fill"
                        type="fill"
                        source="zone-data"
                        paint={{
                            'fill-color': ['get', 'color'],
                            'fill-opacity': ['get', 'fillOpacity']
                        }}
                    />
                    <Layer
                        id="zone-outline"
                        type="line"
                        source="zone-data"
                        paint={{
                            'line-color': ['get', 'color'],
                            'line-width': 2,
                            'line-opacity': 0.8
                        }}
                    />
                </Source>

                {/* Connection Lines Layer */}
                <Source id="mesh-data" type="geojson" data={linkGeoJSON as any}>
                    <Layer {...layerStyle} />
                </Source>

                {/* Node Markers */}
                {filteredNodes.map((node) => {
                    const isBrain = node.id === "Brain";
                    const isSelected = selectedNode?.id === node.id;

                    return (
                        <Marker key={node.id} longitude={node.lng} latitude={node.lat} anchor="center">
                            <button
                                onClick={() => setSelectedNode(node)}
                                className="group relative flex flex-col items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-full z-10"
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

                                {/* Node Icon */}
                                <div className={`
                                    relative p-1 rounded-full border-2 shadow-lg transition-all duration-300 bg-surface
                                    ${isSelected ? 'scale-125 ring-2 ring-primary ring-offset-2 ring-offset-background' : 'group-hover:scale-110'}
                                    ${node.status === 'offline' ? 'border-danger border-dashed' :
                                      node.status === 'weak' ? 'border-warning' :
                                      'border-success'}
                                `}>
                                    {isBrain ? (
                                        <Brain className={`h-4 w-4 ${
                                            node.status === 'offline' ? 'text-danger' :
                                            node.status === 'weak' ? 'text-warning' :
                                            'text-success'
                                        }`} />
                                    ) : (
                                        <Router className={`h-4 w-4 ${
                                            node.status === 'offline' ? 'text-danger' :
                                            node.status === 'weak' ? 'text-warning' :
                                            'text-success'
                                        }`} />
                                    )}
                                </div>

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
