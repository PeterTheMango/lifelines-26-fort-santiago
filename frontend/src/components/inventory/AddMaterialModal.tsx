"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";
import { createInventoryItem } from "@/lib/api";

import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const unitMap: Record<string, string> = {
  "Concrete Rubble": "kg",
  "Timber Beams": "units",
  "Metal Scraps": "kg",
  "Plastic Sheeting": "rolls",
  "Water (Potable)": "L",
  "Fuel (Diesel)": "L",
  "Aggregates": "kg"
};

export function AddMaterialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState("Concrete Rubble");
  const [coordinates, setCoordinates] = useState({ lat: 14.5939, lng: 120.9712 });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const type = formData.get("type") as string;
    const category = type.includes("Water") ? "water" : type.includes("Fuel") ? "fuel" : "construction";
    // unit is disabled so formData won't have it, retrieve from map
    const unit = unitMap[type] || "kg";

    try {
      await createInventoryItem({
        type: type,
        category: category,
        currentAmount: Number(formData.get("currentAmount")),
        unit: unit,
        location: formData.get("location"),
        lat: coordinates.lat, // Use state coordinates
        lng: coordinates.lng, // Use state coordinates
        maxCapacity: 0, // Deprecated in favor of requiredAmount
        description: formData.get("description"),
        status: "good",
        requiredAmount: Number(formData.get("requiredAmount") || 0)
      });
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to create item", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-text-inverse font-semibold rounded-lg flex items-center justify-center gap-2 transition-all group active:scale-98 shadow-lg shadow-primary/20 hover:shadow-primary/30"
        style={{
          backgroundColor: "#2DD4BF",
          minHeight: "48px",
          borderRadius: "8px",
          boxShadow: "0 4px 14px 0 rgba(45, 212, 191, 0.2)"
        }}
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        Add Material
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log Scavenged Material">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Material Type */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Material Type
            </label>
            <select
              name="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-11 bg-surface-elevated border border-border-subtle rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              style={{
                backgroundColor: "#1E2D21",
                borderColor: "#2A3D2E",
                borderRadius: "8px",
                minHeight: "44px"
              }}
            >
              <option>Concrete Rubble</option>
              <option>Timber Beams</option>
              <option>Metal Scraps</option>
              <option>Plastic Sheeting</option>
              <option>Water (Potable)</option>
              <option>Fuel (Diesel)</option>
              <option>Aggregates</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Quantity
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="currentAmount"
                className="flex-1 h-11 bg-surface-elevated border border-border-subtle rounded-lg px-4 py-2 text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="0"
                style={{
                  backgroundColor: "#1E2D21",
                  borderColor: "#2A3D2E",
                  borderRadius: "8px",
                  minHeight: "44px"
                }}
              />
              <select
                name="unit"
                defaultValue={unitMap[selectedType] || "kg"}
                key={selectedType}
                disabled // Disabled as requested
                className="w-24 h-11 bg-surface-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all opacity-70 cursor-not-allowed"
                style={{
                  backgroundColor: "#1E2D21",
                  borderColor: "#2A3D2E",
                  borderRadius: "8px",
                  minHeight: "44px"
                }}
              >
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="units">units</option>
                <option value="m³">m³</option>
                <option value="rolls">rolls</option>
              </select>
            </div>
          </div>

          {/* Location / Sector */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Location / Sector
            </label>
            <div className="space-y-2">
              <input
                type="text"
                name="location"
                required
                className="w-full h-11 bg-surface-elevated border border-border-subtle rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Location Name (e.g. Sector A)"
                style={{
                  backgroundColor: "#1E2D21",
                  borderColor: "#2A3D2E",
                  borderRadius: "8px",
                  minHeight: "44px"
                }}
              />

              {/* Map Picker */}
              <div className="h-48 w-full rounded-lg overflow-hidden border border-border-subtle relative group">
                <Map
                  initialViewState={{
                    longitude: 120.9712,
                    latitude: 14.5939,
                    zoom: 15
                  }}
                  style={{ width: "100%", height: "100%" }}
                  mapStyle="mapbox://styles/mapbox/dark-v11"
                  mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                  onClick={(e) => setCoordinates({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
                  cursor="crosshair"
                >
                  <Marker longitude={coordinates.lng} latitude={coordinates.lat} color="#2DD4BF" />
                </Map>
                <div className="absolute bottom-2 left-2 bg-black/50 text-[10px] text-white px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                  Click map to set location
                </div>
              </div>
              <div className="text-[10px] text-text-muted font-mono flex justify-between">
                <span>Lat: {coordinates.lat.toFixed(6)}</span>
                <span>Lng: {coordinates.lng.toFixed(6)}</span>
              </div>
            </div>
          </div>

          {/* Required Units */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Required Units
            </label>
            <input
              type="number"
              name="requiredAmount"
              className="w-full h-11 bg-surface-elevated border border-border-subtle rounded-lg px-4 py-2 text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Target amount needed"
              style={{
                backgroundColor: "#1E2D21",
                borderColor: "#2A3D2E",
                borderRadius: "8px",
                minHeight: "44px"
              }}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Notes <span className="text-text-muted">(Optional)</span>
            </label>
            <textarea
              name="description"
              className="w-full bg-surface-elevated border border-border-subtle rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              placeholder="Additional details about the material..."
              rows={3}
              style={{
                backgroundColor: "#1E2D21",
                borderColor: "#2A3D2E",
                borderRadius: "8px"
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors"
              style={{ minHeight: "40px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-text-inverse font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-98 disabled:opacity-50"
              style={{
                backgroundColor: "#2DD4BF",
                borderRadius: "8px",
                minHeight: "40px"
              }}
            >
              {submitting ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </form>
      </Modal>    </>
  );
}
