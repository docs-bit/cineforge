"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import { AudioLines } from "lucide-react";

export function AudioNode({ id, data, selected }: NodeProps) {
  return (
    <div className={`rounded-lg border bg-surface p-3 min-w-[200px] ${selected ? "border-gold ring-1 ring-gold/30" : "border-border"}`}>
      <Handle type="target" position={Position.Left} className="!bg-gold !w-2 !h-2" />
      <div className="flex items-center gap-2 mb-2">
        <AudioLines className="h-4 w-4 text-gold" aria-hidden="true" />
        <span className="text-xs font-medium text-foreground">{data.label}</span>
      </div>
      <div className="rounded bg-background p-2 border border-border/50">
        {(data as any).audioUrl ? (
          <audio src={(data as any).audioUrl} controls className="w-full" />
        ) : (
          <div className="flex items-center justify-center h-8">
            <span className="text-[10px] text-muted-foreground/40">No audio</span>
          </div>
        )}
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground/50">
        Type: {(data as any).type || "dialogue"}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-gold !w-2 !h-2" />
    </div>
  );
}
