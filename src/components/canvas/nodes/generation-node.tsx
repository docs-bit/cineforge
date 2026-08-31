"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import { useCanvasStore } from "@/stores/canvas-store";
import { Sparkles } from "lucide-react";

const MODELS = [
  { id: "sora-2", name: "Sora 2" },
  { id: "veo-3.1", name: "Veo 3.1" },
  { id: "kling-3.0", name: "Kling 3.0" },
  { id: "seedance-2.0", name: "Seedance 2.0" },
  { id: "wan-2.6", name: "WAN 2.6" },
  { id: "flux-3.0", name: "Flux 3.0" },
];

export function GenerationNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const status = (data as any).status || "idle";

  return (
    <div className={`rounded-lg border bg-surface p-3 min-w-[200px] ${selected ? "border-gold ring-1 ring-gold/30" : "border-border"}`}>
      <Handle type="target" position={Position.Left} className="!bg-gold !w-2 !h-2" />
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
        <span className="text-xs font-medium text-foreground">{data.label}</span>
        <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded ${
          status === "completed" ? "bg-green-500/20 text-green-400" :
          status === "processing" ? "bg-blue-500/20 text-blue-400" :
          status === "failed" ? "bg-red-500/20 text-red-400" :
          "bg-muted text-muted-foreground"
        }`}>
          {status}
        </span>
      </div>
      <select
        value={(data as any).modelId || "sora-2"}
        onChange={(e) => updateNodeData(id, { modelId: e.target.value })}
        className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
        style={{ backgroundColor: "var(--color-background)", color: "var(--color-foreground)" }}
        aria-label="Select AI model"
      >
        {MODELS.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
      <Handle type="source" position={Position.Right} className="!bg-gold !w-2 !h-2" />
    </div>
  );
}
