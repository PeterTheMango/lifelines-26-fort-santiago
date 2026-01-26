"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";

export function AddMaterialModal() {
  const [isOpen, setIsOpen] = useState(false);

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
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Material Type */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Material Type
            </label>
            <select
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
              <option>Metal Scrap</option>
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
                className="w-24 h-11 bg-surface-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                style={{
                  backgroundColor: "#1E2D21",
                  borderColor: "#2A3D2E",
                  borderRadius: "8px",
                  minHeight: "44px"
                }}
              >
                <option>kg</option>
                <option>L</option>
                <option>units</option>
                <option>m³</option>
                <option>rolls</option>
              </select>
            </div>
          </div>

          {/* Location / Sector */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Location / Sector
            </label>
            <input
              type="text"
              className="w-full h-11 bg-surface-elevated border border-border-subtle rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. Sector A, North Pile"
              style={{
                backgroundColor: "#1E2D21",
                borderColor: "#2A3D2E",
                borderRadius: "8px",
                minHeight: "44px"
              }}
            />
          </div>

          {/* Max Capacity (Optional) */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Max Capacity <span className="text-text-muted">(Optional)</span>
            </label>
            <input
              type="number"
              className="w-full h-11 bg-surface-elevated border border-border-subtle rounded-lg px-4 py-2 text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Maximum storage capacity"
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
              onClick={() => setIsOpen(false)}
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-text-inverse font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-98"
              style={{
                backgroundColor: "#2DD4BF",
                borderRadius: "8px",
                minHeight: "40px"
              }}
            >
              Save Entry
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
