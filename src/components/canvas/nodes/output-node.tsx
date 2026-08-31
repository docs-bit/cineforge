"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import { useCanvasStore } from "@/stores/canvas-store";
import { Download } from "lucide-react";

export function OutputNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);

  return (
    <div className={`rounded-lg border bg-surface p-3 min-w-[200px] ${selected ? "border-gold ring-1 ring-gold/30" : "border-border"}`}>
      <Handle type="target" position={Position.Left} className="!bg-gold !w-2 !h-2" />
      <div className="flex items-center gap-2 mb-2">
        <Download className="h-4 w-4 text-gold" aria-hidden="true" />
        <span className="text-xs font-medium text-foreground">{data.label}</span>
      </div>
      <div className="space-y-2">
        <div>
          <label htmlFor={`format-${id}`} className="text-[10px] text-muted-foreground block mb-1">Format</label>
          <select
            id={`format-${id}`}
            value={(data as any).format || "mp4"}
            onChange={(e) => updateNodeData(id, { format: e.target.value })}
            className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
            style={{ backgroundColor: "var(--color-background)", color: "var(--color-foreground)" }}
          >
            <option value="mp4">MP4</option>
            <option value="webm">WebM</option>
            <option value="gif">GIF</option>
          </select>
        </div>
        <div>
          <label htmlFor={`quality-${id}`} className="text-[10px] text-muted-foreground block mb-1">Quality</label>
          <select
            id={`quality-${id}`}
            value={(data as any).quality || "standard"}
            onChange={(e) => updateNodeData(id, { quality: e.target.value })}
            className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
            style={{ backgroundColor: "var(--color-background)", color: "var(--color-foreground)" }}
          >
            <option value="draft">Draft</option>
            <option value="standard">Standard</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
}
