"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Map, { Marker, MapRef, NavigationControl } from "react-map-gl/mapbox";
import { fetchInventory, Material } from "@/lib/api";
import { Package, X, Info, Hammer, Droplet, Fuel, Layout, Truck, Clock } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
const CENTER = { lat: 14.5939, lng: 120.9712 }; // Fort Santiago

interface InventoryMapViewProps {
    className?: string;
}

export function InventoryMapView({ className }: InventoryMapViewProps) {
    const mapRef = useRef<MapRef>(null);
    const [inventory, setInventory] = useState<Material[]>([]);
    const [selectedItem, setSelectedItem] = useState<Material | null>(null);
    const [viewState, setViewState] = useState({
        latitude: CENTER.lat,
        longitude: CENTER.lng,
        zoom: 16
    });

    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchInventory();
                setInventory(data);
            } catch (error) {
                console.error("Failed to load map data:", error);
            }
        }
        loadData();
    }, []);

    // Calculate bar visualizations
    const getBarStats = (item: Material) => {
        // Current vs Required
        const safeRequired = item.requiredAmount > 0 ? item.requiredAmount : item.currentAmount;
        const currentPercent = Math.min((item.currentAmount / safeRequired) * 100, 100);

        return { currentPercent };
    };

    // Helper for Category Icons
    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'water': return Droplet;
            case 'fuel': return Fuel;
            case 'construction': return Hammer;
            default: return Package;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'water': return "text-info";
            case 'fuel': return "text-warning";
            case 'construction': return "text-primary";
            default: return "text-text-secondary";
        }
    }

    if (!MAPBOX_TOKEN) {
        return (
            <div className="bg-surface w-full h-[600px] flex items-center justify-center border border-border-subtle rounded-lg p-6 text-center">
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
        <div className={`relative w-full h-[calc(100vh-12rem)] min-h-[500px] overflow-hidden border border-border-subtle rounded-xl shadow-sm bg-surface ${className}`}>
            {/* Floating Detail Card (MeshTopology Style) */}
            {selectedItem && (
                <div className="absolute top-4 right-4 z-20 bg-surface-elevated border border-border-default rounded-lg shadow-2xl w-72 animate-fadeIn ring-1 ring-white/5" style={{ animationDuration: '200ms' }}>
                    {/* Header */}
                    <div className="bg-surface p-4 border-b border-border-subtle flex items-center justify-between rounded-t-lg">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-surface-elevated border border-border-subtle ${getCategoryColor(selectedItem.category)}`}>
                                {(() => {
                                    const Icon = getCategoryIcon(selectedItem.category);
                                    return <Icon className="w-4 h-4" />;
                                })()}
                            </div>
                            <div>
                                <h4 className="font-semibold text-text-primary text-sm leading-tight">{selectedItem.type}</h4>
                                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{selectedItem.category}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="p-1.5 hover:bg-surface-elevated rounded-md transition-colors text-text-secondary hover:text-text-primary"
                            aria-label="Close details"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4">
                        {/* Status Row */}
                        <div className="flex items-center justify-between bg-background/50 p-2 rounded-lg border border-border-subtle">
                            <span className="text-xs font-medium text-text-secondary">Status</span>
                            <div className="flex items-center gap-2">
                                <span className={`relative flex h-2 w-2 mr-1`}>
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedItem.status === 'critical' ? 'bg-danger' :
                                        selectedItem.status === 'low' ? 'bg-warning' : 'bg-success'
                                        }`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${selectedItem.status === 'critical' ? 'bg-danger' :
                                        selectedItem.status === 'low' ? 'bg-warning' : 'bg-success'
                                        }`}></span>
                                </span>
                                <span className={`text-xs font-bold uppercase tracking-wide ${selectedItem.status === 'critical' ? 'text-danger' :
                                    selectedItem.status === 'low' ? 'text-warning' : 'text-success'
                                    }`}>
                                    {selectedItem.status}
                                </span>
                            </div>
                        </div>

                        {/* Stock Visualization */}
                        <div className="space-y-3">
                            {/* Current vs Required */}
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-text-secondary">Progress</span>
                                    <span className="font-mono font-bold text-text-primary">{Math.round(getBarStats(selectedItem).currentPercent)}%</span>
                                </div>
                                <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border-subtle/50">
                                    <div
                                        className={`h-full transition-all duration-500 rounded-full ${selectedItem.status === 'critical' ? 'bg-danger' :
                                            selectedItem.status === 'low' ? 'bg-warning' : 'bg-primary'
                                            }`}
                                        style={{ width: `${getBarStats(selectedItem).currentPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Meta Data */}
                        <div className="border-t border-border-subtle pt-3 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <Layout className="w-3.5 h-3.5 text-text-muted" />
                                <span>Required:</span>
                                <span className="ml-auto font-mono text-text-primary">{selectedItem.requiredAmount}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <Truck className="w-3.5 h-3.5 text-text-muted" />
                                <span>Location:</span>
                                <span className="ml-auto font-medium text-text-primary text-right truncate max-w-[120px]">{selectedItem.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <Clock className="w-3.5 h-3.5 text-text-muted" />
                                <span>Updated:</span>
                                <span className="ml-auto font-mono text-text-primary">{selectedItem.updated}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Description */}
                    {selectedItem.description && (
                        <div className="p-3 bg-surface/50 border-t border-border-subtle rounded-b-lg">
                            <p className="text-[11px] text-text-secondary leading-relaxed italic">
                                "{selectedItem.description}"
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Map Grid Overlay (Aesthetic) */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none opacity-20"
                style={{
                    backgroundImage: `
                    linear-gradient(to right, #2A3D2E 1px, transparent 1px),
                    linear-gradient(to bottom, #2A3D2E 1px, transparent 1px)
                `,
                    backgroundSize: '40px 40px'
                }}
            />

            <Map
                ref={mapRef}
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                <NavigationControl position="bottom-right" />

                {/* Inventory Markers */}
                {inventory.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    const Icon = getCategoryIcon(item.category);

                    return (
                        <Marker
                            key={item.id}
                            longitude={item.coordinates.lng}
                            latitude={item.coordinates.lat}
                            anchor="bottom"
                            onClick={(e) => {
                                e.originalEvent.stopPropagation();
                                setSelectedItem(item);
                            }}
                        >
                            <div className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                                {/* Icon Marker */}
                                <div className={`
                                w-8 h-8 rounded-lg rotate-45 flex items-center justify-center shadow-lg border transition-all duration-300
                                ${isSelected
                                        ? 'bg-primary border-white scale-110 z-20 shadow-primary/50'
                                        : 'bg-surface border-primary/50 hover:bg-surface-elevated hover:border-primary'
                                    }
                            `}>
                                    {/* Counter rotate icon to keep it straight */}
                                    <div className="-rotate-45">
                                        <Icon className={`w-4 h-4 ${isSelected ? 'text-text-inverse' : 'text-primary'}`} />
                                    </div>
                                </div>

                                {/* Pulse for critical/low items */}
                                {(item.status === 'critical' || item.status === 'low') && !isSelected && (
                                    <div className={`absolute -inset-1 bg-${item.status === 'critical' ? 'danger' : 'warning'}/30 rounded-full blur-md animate-pulse -z-10`} />
                                )}
                            </div>
                        </Marker>
                    );
                })}
            </Map>
        </div>
    );
}
