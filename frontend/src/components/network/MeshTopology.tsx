"use client";

import { useEffect, useState, useMemo } from "react";
import Map, { Marker, Source, Layer, MapRef } from "react-map-gl/mapbox";
import type { CircleLayer, LineLayer } from "mapbox-gl";

interface Node {
    id: string;
    lat: number;
    lng: number;
    status: "online" | "offline" | "weak";
    role: "Gateway" | "Relay" | "Sensor";
}

// Centered on Fort Santiago, Manila (Intramuros)
// 14.5939° N, 120.9712° E
const CENTER = { lat: 14.5939, lng: 120.9712 };

const initialNodes: Node[] = [
    { id: "Brain", lat: 14.5939, lng: 120.9712, status: "online", role: "Gateway" },
    { id: "N-01", lat: 14.5945, lng: 120.9705, status: "online", role: "Sensor" }, // NW
    { id: "N-02", lat: 14.5942, lng: 120.9720, status: "online", role: "Sensor" }, // E
    { id: "N-03", lat: 14.5930, lng: 120.9702, status: "weak", role: "Relay" },   // SW
    { id: "N-04", lat: 14.5928, lng: 120.9725, status: "offline", role: "Sensor" }, // SE
    { id: "N-05", lat: 14.5935, lng: 120.9712, status: "online", role: "Sensor" }, // S
    { id: "N-06", lat: 14.5948, lng: 120.9710, status: "online", role: "Relay" },   // N
];

// Mapbox Token - using environment variable or a placeholder instruction
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const layerStyle: LineLayer = {
    id: 'mesh-links',
    type: 'line',
    source: 'mesh-data',
    paint: {
        'line-color': [
            'case',
            ['==', ['get', 'status'], 'offline'], '#EF4444',
            ['==', ['get', 'status'], 'weak'], '#F59E0B',
            '#3B82F6'
        ],
        'line-width': 2,
        'line-opacity': 0.6,
        'line-dasharray': [
            'case',
            ['==', ['get', 'status'], 'weak'], ['literal', [2, 2]],
            ['literal', [1, 0]] // Solid line
        ]
    }
};

export function MeshTopology() {
    const [nodes, setNodes] = useState(initialNodes);
    const [viewState, setViewState] = useState({
        latitude: CENTER.lat,
        longitude: CENTER.lng,
        zoom: 16
    });

    // Generate GeoJSON for lines
    const linkGeoJSON = useMemo(() => {
        const features = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeA = nodes[i];
                const nodeB = nodes[j];

                // Calculate distance manually or just draw lines regardless for the mesh visual
                // For valid mesh, we usually connect nodes within range.
                // Simple distance approx (Euclidean on lat/lng is okay for small scale)
                const dLat = nodeA.lat - nodeB.lat;
                const dLng = nodeA.lng - nodeB.lng;
                const dist = Math.sqrt(dLat * dLat + dLng * dLng);

                // Connection threshold approx 0.002 degrees (~200m)
                if (dist < 0.0025) {
                    const status = (nodeA.status === 'offline' || nodeB.status === 'offline') ? 'offline' :
                        (nodeA.status === 'weak' || nodeB.status === 'weak') ? 'weak' : 'online';

                    features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: [[nodeA.lng, nodeA.lat], [nodeB.lng, nodeB.lat]]
                        },
                        properties: { status }
                    });
                }
            }
        }
        return {
            type: 'FeatureCollection',
            features
        };
    }, [nodes]);

    if (!MAPBOX_TOKEN) {
        return (
            <div className="bg-[#0F172A] w-full h-full flex items-center justify-center border border-white/5 rounded-lg text-gray-400 p-6 text-center">
                <div>
                    <p className="font-bold text-white mb-2">Mapbox Token Missing</p>
                    <p className="text-sm">Please add specific NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0F172A] relative w-full h-full overflow-hidden border border-white/5 rounded-lg shadow-inner">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 shadow-lg">
                    <span className="text-xs text-primary font-mono font-bold tracking-wider flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        MESH VIEW
                    </span>
                </div>
            </div>

            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                {/* Connections Layer */}
                <Source id="mesh-data" type="geojson" data={linkGeoJSON as any}>
                    <Layer {...layerStyle} />
                </Source>

                {/* Node Markers */}
                {nodes.map((node) => (
                    <Marker key={node.id} longitude={node.lng} latitude={node.lat} anchor="center">
                        <div className="group relative flex flex-col items-center">
                            {/* Ping Animation for active nodes */}
                            {node.status === 'online' && (
                                <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-sm animate-pulse"></div>
                            )}

                            <div className={`
                                w-4 h-4 rounded-full border-2 border-[#0F172A] shadow-lg
                                ${node.status === 'offline' ? 'bg-red-500' : node.status === 'weak' ? 'bg-amber-500' : 'bg-emerald-500'}
                                transition-all duration-300 group-hover:scale-125
                             `}></div>

                            <div className="absolute top-5 bg-black/90 text-[10px] text-white px-2 py-0.5 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                <span className="font-mono font-bold text-primary">{node.id}</span>
                                <span className="opacity-50 mx-1">|</span>
                                <span className="text-gray-300">{node.role}</span>
                            </div>
                        </div>
                    </Marker>
                ))}
            </Map>
        </div>
    );
}
