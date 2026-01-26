"use client";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { BrainCircuit, MessageSquare, Sparkles, ArrowRight } from "lucide-react";

export function AIArchitectQuickAccess() {
  return (
    <Card className="h-full flex flex-col group hover:border-primary/40 transition-all duration-200 relative overflow-hidden">
      {/* Blueprint Grid Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm uppercase tracking-wider text-text-secondary flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-info" />
            AI Architect
          </CardTitle>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-info animate-pulse" />
            <span className="text-[10px] text-info font-mono uppercase tracking-wide">
              Ready
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-0 flex flex-col justify-between relative z-10">
        {/* Description */}
        <div className="space-y-3">
          <p className="text-sm text-text-secondary leading-relaxed">
            Generate construction plans, material estimates, and engineering solutions using
            your scavenged inventory.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-elevated border border-border-subtle rounded-md p-2">
              <div className="text-xs text-text-muted uppercase tracking-wide mb-1">
                Plans Created
              </div>
              <div className="text-lg font-bold text-text-primary font-mono">
                24
              </div>
            </div>
            <div className="bg-surface-elevated border border-border-subtle rounded-md p-2">
              <div className="text-xs text-text-muted uppercase tracking-wide mb-1">
                Active Projects
              </div>
              <div className="text-lg font-bold text-text-primary font-mono">
                3
              </div>
            </div>
          </div>

          {/* Recent Suggestion Chip */}
          <div className="bg-info/10 border border-info/20 rounded-lg p-2.5 flex items-start gap-2">
            <Sparkles className="h-3.5 w-3.5 text-info flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-text-secondary">
                <span className="text-info font-semibold">Latest:</span>{" "}
                Tire-Rammed Earth Wall construction plan
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full mt-4 bg-primary hover:bg-primary-muted text-text-inverse font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
          <MessageSquare className="h-4 w-4" />
          <span>Open AI Architect</span>
          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </CardContent>

      {/* Corner Accent (Blueprint Style) */}
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full text-primary/10"
          fill="currentColor"
        >
          <path d="M64 0 L64 8 L8 8 L8 64 L0 64 L0 0 Z" />
        </svg>
      </div>
    </Card>
  );
}
