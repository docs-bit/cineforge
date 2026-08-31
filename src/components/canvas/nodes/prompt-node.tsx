"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import { useCanvasStore } from "@/stores/canvas-store";
import { FileText } from "lucide-react";

export function PromptNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);

  return (
    <div className={`rounded-lg border bg-surface p-3 min-w-[200px] ${selected ? "border-gold ring-1 ring-gold/30" : "border-border"}`}>
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-4 w-4 text-gold" aria-hidden="true" />
        <span className="text-xs font-medium text-foreground">{data.label}</span>
      </div>
      <textarea
        placeholder="Enter prompt…"
        value={(data as any).prompt || ""}
        onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
        className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 resize-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
        rows={3}
        aria-label="Prompt text"
      />
      <Handle type="source" position={Position.Right} className="!bg-gold !w-2 !h-2" />
    </div>
  );
}
