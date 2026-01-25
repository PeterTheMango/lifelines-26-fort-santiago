"use client";

import { ChatInterface } from "@/components/architect/ChatInterface";
import { PlanViewer } from "@/components/architect/PlanViewer";

export default function ArchitectPage() {
    return (
        <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4 md:gap-6 max-w-[1600px] mx-auto">
            <div className="flex-1 lg:flex-none lg:w-[400px] xl:w-[450px] h-full min-h-[400px] flex flex-col">
                <ChatInterface />
            </div>
            <div className="flex-1 h-full min-h-[400px] flex flex-col">
                <PlanViewer />
            </div>
        </div>
    );
}
