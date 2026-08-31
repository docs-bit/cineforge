"use client";

import { useCanvasStore } from "@/stores/canvas-store";

export function PropertiesPanel() {
  const { nodes, selectedNodeId, updateNodeData, removeNode } = useCanvasStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside className="w-64 shrink-0 border-l border-border bg-surface p-3" aria-label="Properties panel">
        <p className="text-xs text-muted-foreground/50 text-center mt-8">
          Select a node to edit its properties
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-64 shrink-0 border-l border-border bg-surface p-3" aria-label="Node properties">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Properties
        </h2>
        <button
          onClick={() => removeNode(selectedNode.id)}
          className="text-[10px] text-destructive hover:text-destructive/80 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          aria-label={`Delete ${selectedNode.data.label} node`}
        >
          Delete
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="node-label" className="text-[10px] text-muted-foreground block mb-1">
            Label
          </label>
          <input
            id="node-label"
            type="text"
            value={selectedNode.data.label}
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
          />
        </div>

        <div className="text-[10px] text-muted-foreground/50">
          Type: {selectedNode.type}
        </div>

        <div className="text-[10px] text-muted-foreground/50">
          ID: {selectedNode.id}
        </div>
      </div>
    </aside>
  );
}
