"use client";

import { FileText, Download, Share2, Maximize2 } from "lucide-react";

export function PlanViewer() {
    return (
        <div className="flex flex-col h-full bg-surface border border-border-subtle rounded-lg overflow-hidden shadow-sm">
            <div className="bg-surface-elevated p-4 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-text-muted" />
                    <span className="font-bold text-text-primary uppercase tracking-wider text-sm">Blueprint Viewer</span>
                </div>
                <div className="flex gap-3">
                    <button className="text-text-muted hover:text-text-primary transition-colors"><Share2 className="h-4 w-4" /></button>
                    <button className="text-text-muted hover:text-text-primary transition-colors"><Download className="h-4 w-4" /></button>
                    <button className="text-text-muted hover:text-text-primary transition-colors"><Maximize2 className="h-4 w-4" /></button>
                </div>
            </div>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-surface relative">
                {/* Blueprint Grid Pattern Background */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}></div>

                <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    <div className="border border-border-subtle p-6 rounded-lg bg-surface-elevated/50 backdrop-blur-sm">
                        <h1 className="text-2xl font-bold text-text-primary mb-2 font-mono">Structure: Emergency Storage V2</h1>
                        <div className="flex flex-wrap gap-4 text-xs text-text-secondary font-mono mb-6 uppercase tracking-wider">
                            <span className="bg-surface-elevated px-2 py-1 rounded border border-border-subtle">Est. Time: 2h 15m</span>
                            <span className="bg-surface-elevated px-2 py-1 rounded border border-border-subtle">Materials: Rubble, Tarps</span>
                            <span className="bg-success/10 text-success px-2 py-1 rounded border border-success/20">Integrity: High</span>
                        </div>

                        <div className="aspect-video bg-[#0C141C] rounded-md border border-border-subtle flex items-center justify-center mb-6 relative overflow-hidden group shadow-inner">
                            <div className="text-center p-4">
                                {/* Simple CSS representation of a diagram */}
                                <div className="relative w-48 h-32 mx-auto border-2 border-primary/30 mb-2 flex flex-col justify-end items-center bg-primary/5">
                                    <div className="w-40 h-2 bg-primary/50 mb-1"></div>
                                    <div className="w-2 h-24 bg-primary/50 absolute left-4 bottom-0"></div>
                                    <div className="w-2 h-24 bg-primary/50 absolute right-4 bottom-0"></div>
                                    <div className="border-t-2 border-l-2 border-r-2 border-primary/50 w-32 h-12 absolute bottom-0"></div>
                                </div>
                                <p className="text-xs text-primary font-mono mt-2 opacity-70">FIG 1.1: Load Bearing Frame</p>
                            </div>
                        </div>

                        <div className="space-y-6 text-text-secondary text-sm leading-relaxed">
                            <div>
                                <h3 className="text-lg font-bold text-text-primary border-b border-border-subtle pb-2 mb-2 flex items-center">
                                    <span className="bg-primary/20 text-primary w-6 h-6 rounded flex items-center justify-center text-xs mr-2">1</span>
                                    Foundation Prep
                                </h3>
                                <p>Clear a 3x3m area. Use <span className="text-primary font-mono bg-primary/10 px-1 rounded">Concrete Rubble</span> to fill the base layer up to 15cm. Compact thoroughly to prevent settling.</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-text-primary border-b border-border-subtle pb-2 mb-2 flex items-center">
                                    <span className="bg-primary/20 text-primary w-6 h-6 rounded flex items-center justify-center text-xs mr-2">2</span>
                                    Wall Construction
                                </h3>
                                <p>Stack heavy debris on perimeter. Use <span className="text-primary font-mono bg-primary/10 px-1 rounded">Plastic Sheeting</span> as damp proof course before laying first course.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
