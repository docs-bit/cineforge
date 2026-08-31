"use client";

import { useCanvasStore } from "@/stores/canvas-store";
import { Save, Trash2 } from "lucide-react";

export function CanvasToolbar() {
  const { nodes, edges, clearCanvas } = useCanvasStore();

  const handleSave = () => {
    const data = { nodes, edges, savedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas-workflow.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-2">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-foreground">Canvas</h1>
        <span className="text-[10px] text-muted-foreground">
          {nodes.length} nodes · {edges.length} edges
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          aria-label="Save canvas as JSON"
        >
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
          Save
        </button>
        <button
          onClick={() => {
            if (confirm("Clear entire canvas?")) clearCanvas();
          }}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          aria-label="Clear canvas"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Clear
        </button>
      </div>
    </header>
  );
}
