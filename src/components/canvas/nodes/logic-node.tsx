"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import { useCanvasStore } from "@/stores/canvas-store";
import { GitBranch } from "lucide-react";

export function LogicNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);

  return (
    <div className={`rounded-lg border bg-surface p-3 min-w-[200px] ${selected ? "border-gold ring-1 ring-gold/30" : "border-border"}`}>
      <Handle type="target" position={Position.Left} className="!bg-gold !w-2 !h-2" />
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="h-4 w-4 text-gold" aria-hidden="true" />
        <span className="text-xs font-medium text-foreground">{data.label}</span>
      </div>
      <input
        type="text"
        placeholder="Condition…"
        value={(data as any).condition || ""}
        onChange={(e) => updateNodeData(id, { condition: e.target.value })}
        className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold mb-2"
        aria-label="Logic condition"
      />
      <div className="flex justify-between text-[10px]">
        <span className="text-green-400">True: {(data as any).trueLabel || "Yes"}</span>
        <span className="text-red-400">False: {(data as any).falseLabel || "No"}</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: "30%" }}
        className="!bg-green-500 !w-2 !h-2"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: "70%" }}
        className="!bg-red-500 !w-2 !h-2"
      />
    </div>
  );
}
