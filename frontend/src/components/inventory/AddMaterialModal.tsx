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
                className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-md flex items-center shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all hover:scale-105 active:scale-95"
            >
                <Plus className="mr-2 h-5 w-5" />
                Log Material
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log Scavenged Material">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Material Type</label>
                        <select className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                            <option>Concrete Rubble</option>
                            <option>Timber Beams</option>
                            <option>Metal Scrap</option>
                            <option>Plastic</option>
                            <option>Water</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                        <div className="flex gap-2">
                            <input type="number" className="flex-1 bg-background border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="0" />
                            <select className="bg-background border border-white/10 rounded-md px-3 py-2 text-white w-24">
                                <option>kg</option>
                                <option>L</option>
                                <option>units</option>
                                <option>m³</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Location / Sector</label>
                        <input type="text" className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="e.g. Sector A, North Pile" />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-white transition-colors">CANCEL</button>
                        <button type="submit" onClick={() => setIsOpen(false)} className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-md shadow-lg shadow-primary/20">SAVE ENTRY</button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
