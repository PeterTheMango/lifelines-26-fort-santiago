"use client";

import { MeshTopology } from "@/components/network/MeshTopology";
import { NodeList } from "@/components/network/NodeList";

export default function NetworkPage() {
    return (
        <div className="space-y-6 h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex flex-col">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Network Health</h1>
                <p className="text-gray-400 mt-1">LoRa Mesh Topology and Node Telemetry.</p>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                <div className="lg:w-2/3 h-full min-h-[300px] flex flex-col">
                    <MeshTopology />
                </div>
                <div className="lg:w-1/3 h-full min-h-[300px] flex flex-col">
                    <NodeList />
                </div>
            </div>
        </div>
    );
}
