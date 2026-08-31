"use client";

import { useCanvasStore } from "@/stores/canvas-store";
import { FileText, Sparkles, Image, Video, AudioLines, GitBranch, Download } from "lucide-react";
import type { CanvasNodeType } from "@/types/canvas";

const NODE_ITEMS: { type: CanvasNodeType; label: string; icon: React.ElementType }[] = [
  { type: "prompt", label: "Prompt", icon: FileText },
  { type: "generation", label: "Generation", icon: Sparkles },
  { type: "image", label: "Image", icon: Image },
  { type: "video", label: "Video", icon: Video },
  { type: "audio", label: "Audio", icon: AudioLines },
  { type: "logic", label: "Logic", icon: GitBranch },
  { type: "output", label: "Output", icon: Download },
];

export function NodeToolbox() {
  const addNode = useCanvasStore((s) => s.addNode);

  const onDragStart = (e: React.DragEvent, type: CanvasNodeType) => {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-48 shrink-0 border-r border-border bg-surface p-3" aria-label="Node toolbox">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Nodes
      </h2>
      <div className="space-y-1.5">
        {NODE_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => onDragStart(e, item.type)}
              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-xs text-muted-foreground bg-background cursor-grab transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              role="button"
              tabIndex={0}
              aria-label={`Add ${item.label} node`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  addNode(item.type, { x: 250, y: 250 });
                }
              }}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
