"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import { Image } from "lucide-react";

export function ImageNode({ id, data, selected }: NodeProps) {
  return (
    <div className={`rounded-lg border bg-surface p-3 min-w-[200px] ${selected ? "border-gold ring-1 ring-gold/30" : "border-border"}`}>
      <Handle type="target" position={Position.Left} className="!bg-gold !w-2 !h-2" />
      <div className="flex items-center gap-2 mb-2">
        <Image className="h-4 w-4 text-gold" aria-hidden="true" />
        <span className="text-xs font-medium text-foreground">{data.label}</span>
      </div>
      <div className="aspect-video rounded bg-background flex items-center justify-center border border-border/50">
        {(data as any).imageUrl ? (
          <img src={(data as any).imageUrl} alt={(data as any).alt || "Image"} className="w-full h-full object-cover rounded" />
        ) : (
          <span className="text-[10px] text-muted-foreground/40">No image</span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-gold !w-2 !h-2" />
    </div>
  );
}
