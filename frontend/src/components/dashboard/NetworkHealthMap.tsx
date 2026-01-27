"use client";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Radio, Wifi, Signal, ZapOff } from "lucide-react";
import { useState } from "react";

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  status: "online-strong" | "online-weak" | "degraded" | "offline" | "brain";
  signal?: string;
}

interface Connection {
  from: string;
  to: string;
  quality: "excellent" | "good" | "fair" | "poor";
}

const nodes: Node[] = [
  { id: "brain", name: "Brain Hub", x: 50, y: 15, status: "brain" },
  { id: "n1", name: "Node 1", x: 25, y: 35, status: "online-strong", signal: "-65 dBm" },
  { id: "n2", name: "Node 2", x: 75, y: 35, status: "online-strong", signal: "-68 dBm" },
  { id: "n3", name: "Node 3", x: 15, y: 60, status: "online-weak", signal: "-82 dBm" },
  { id: "n4", name: "Node 4", x: 50, y: 55, status: "degraded", signal: "-90 dBm" },
  { id: "n5", name: "Node 5", x: 85, y: 60, status: "online-strong", signal: "-70 dBm" },
  { id: "n6", name: "Node 6", x: 35, y: 80, status: "offline" },
  { id: "n7", name: "Node 7", x: 65, y: 85, status: "online-weak", signal: "-87 dBm" },
];

const connections: Connection[] = [
  { from: "brain", to: "n1", quality: "excellent" },
  { from: "brain", to: "n2", quality: "excellent" },
  { from: "n1", to: "n3", quality: "good" },
  { from: "n1", to: "n4", quality: "fair" },
  { from: "n2", to: "n4", quality: "good" },
  { from: "n2", to: "n5", quality: "excellent" },
  { from: "n4", to: "n7", quality: "fair" },
  { from: "n5", to: "n7", quality: "good" },
];

const getNodeColor = (status: Node["status"]) => {
  switch (status) {
    case "brain":
      return "text-success fill-success";
    case "online-strong":
      return "text-primary fill-primary";
    case "online-weak":
      return "text-primary-muted fill-primary-muted";
    case "degraded":
      return "text-warning fill-warning";
    case "offline":
      return "text-danger fill-danger";
  }
};

const getConnectionStyle = (quality: Connection["quality"]) => {
  switch (quality) {
    case "excellent":
      return { color: "#4ADE80", width: 2, dashArray: "none" };
    case "good":
      return { color: "#2DD4BF", width: 2, dashArray: "none" };
    case "fair":
      return { color: "#FBBF24", width: 1, dashArray: "5,5" };
    case "poor":
      return { color: "#F87171", width: 1, dashArray: "2,4" };
  }
};

export function NetworkHealthMap() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const activeNode = selectedNode || hoveredNode;
  const activeNodeData = nodes.find((n) => n.id === activeNode);

  return (
    <Card className="h-full flex flex-col group hover:border-border transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm uppercase tracking-wider text-text-secondary flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            Network Mesh
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-mono">
              12/14 nodes
            </span>
            <div className="h-2 w-2 rounded-full bg-success animate-pulse-slow" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 relative">
        {/* Network Visualization */}
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connection Lines */}
          <g className="connections">
            {connections.map((conn, idx) => {
              const fromNode = nodes.find((n) => n.id === conn.from);
              const toNode = nodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const style = getConnectionStyle(conn.quality);
              const isActive =
                activeNode === conn.from || activeNode === conn.to;

              return (
                <line
                  key={idx}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={style.color}
                  strokeWidth={style.width}
                  strokeDasharray={style.dashArray}
                  opacity={isActive ? 1 : 0.4}
                  className="transition-opacity duration-200"
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node) => {
              const isActive = activeNode === node.id;
              const colorClass = getNodeColor(node.status);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() =>
                    setSelectedNode(selectedNode === node.id ? null : node.id)
                  }
                  className="cursor-pointer"
                >
                  {/* Glow for Brain and Online Strong */}
                  {(node.status === "brain" ||
                    node.status === "online-strong") && (
                    <circle
                      r="3.5"
                      className={`${colorClass} opacity-20 blur-sm`}
                      style={{
                        filter: "blur(4px)",
                        animation:
                          node.status === "brain"
                            ? "pulse-glow 2s ease-in-out infinite"
                            : "none",
                      }}
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={node.status === "brain" ? "3" : "2.5"}
                    className={`${colorClass} ${
                      isActive ? "opacity-100" : "opacity-80"
                    } transition-all duration-200`}
                    strokeWidth={node.status === "offline" ? "0.4" : "0"}
                    stroke={node.status === "offline" ? "#F87171" : "none"}
                    strokeDasharray={node.status === "offline" ? "2,2" : "none"}
                    style={{
                      transform: isActive ? "scale(1.3)" : "scale(1)",
                      transformOrigin: "center",
                      animation:
                        node.status === "degraded"
                          ? "pulse-warning 1s ease-in-out infinite"
                          : "none",
                    }}
                  />

                  {/* Node Label */}
                  <text
                    y="-4"
                    textAnchor="middle"
                    className={`text-[2.5px] font-mono font-medium ${
                      isActive ? "fill-text-primary" : "fill-text-secondary"
                    } transition-all duration-200`}
                    style={{ userSelect: "none" }}
                  >
                    {node.name}
                  </text>

                  {/* Status Indicator Icon */}
                  {node.status === "offline" && (
                    <g transform="translate(-1, 3.5)">
                      <rect
                        x="0"
                        y="0"
                        width="2"
                        height="2"
                        fill="#0C1810"
                        opacity="0.9"
                      />
                      <text
                        x="1"
                        y="1.5"
                        textAnchor="middle"
                        className="text-[1.8px] fill-danger"
                      >
                        ✕
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Node Detail Popover */}
        {activeNodeData && (
          <div className="absolute bottom-4 left-4 right-4 bg-surface-elevated border border-border p-3 rounded-lg animate-fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      activeNodeData.status === "brain"
                        ? "bg-success"
                        : activeNodeData.status.includes("online")
                        ? "bg-primary"
                        : activeNodeData.status === "degraded"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  />
                  <h4 className="text-sm font-semibold text-text-primary">
                    {activeNodeData.name}
                  </h4>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-text-secondary">
                    Status:{" "}
                    <span className="text-text-primary font-mono">
                      {activeNodeData.status === "brain"
                        ? "Hub (Active)"
                        : activeNodeData.status === "online-strong"
                        ? "Online (Strong)"
                        : activeNodeData.status === "online-weak"
                        ? "Online (Weak)"
                        : activeNodeData.status === "degraded"
                        ? "Degraded"
                        : "Offline"}
                    </span>
                  </p>
                  {activeNodeData.signal && (
                    <p className="text-xs text-text-secondary">
                      Signal:{" "}
                      <span className="text-text-primary font-mono">
                        {activeNodeData.signal}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-text-muted hover:text-text-primary transition-colors text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-surface-elevated/90 backdrop-blur-sm border border-border-subtle rounded-lg p-2 text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-text-secondary text-[10px]">Brain Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-text-secondary text-[10px]">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-warning" />
            <span className="text-text-secondary text-[10px]">Degraded</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-danger" />
            <span className="text-text-secondary text-[10px]">Offline</span>
          </div>
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes pulse-warning {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </Card>
  );
}
