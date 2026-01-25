"use client";

import { InventoryTable } from "@/components/inventory/InventoryTable";
import { AddMaterialModal } from "@/components/inventory/AddMaterialModal";

export default function InventoryPage() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Material Inventory</h1>
                    <p className="text-gray-400 mt-1">Live tracking of scavenged resources across all sectors.</p>
                </div>
                <AddMaterialModal />
            </div>

            <InventoryTable />
        </div>
    );
}
