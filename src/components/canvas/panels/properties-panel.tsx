"use client";

import { useCanvasStore } from "@/stores/canvas-store";
import type { Node } from "reactflow";
import type { NodeData } from "@/types/canvas";

const MODELS = [
  { id: "sora-2", name: "Sora 2" },
  { id: "veo-3.1", name: "Veo 3.1" },
  { id: "kling-3.0", name: "Kling 3.0" },
  { id: "seedance-2.0", name: "Seedance 2.0" },
  { id: "wan-2.6", name: "WAN 2.6" },
  { id: "flux-3.0", name: "Flux 3.0" },
];

const RESOLUTIONS = ["720p", "1080p", "4k"];

function PromptProperties({ node }: { node: Node<NodeData> }) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const prompt = (node.data as any).prompt || "";

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="node-prompt" className="text-[10px] text-muted-foreground block mb-1">
          Prompt Text
        </label>
        <textarea
          id="node-prompt"
          value={prompt}
          onChange={(e) => updateNodeData(node.id, { prompt: e.target.value })}
          rows={4}
          placeholder="Describe your scene..."
          className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground resize-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
        />
      </div>
      {prompt.length > 0 && (
        <p className="text-[10px] text-muted-foreground/50 tabular-nums">{prompt.length} characters</p>
      )}
    </div>
  );
}

function GenerationProperties({ node }: { node: Node<NodeData> }) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const modelId = (node.data as any).modelId || "sora-2";
  const status = (node.data as any).status || "idle";
  const resolution = (node.data as any).resolution || "1080p";

  const statusColors: Record<string, string> = {
    idle: "bg-muted text-muted-foreground",
    pending: "bg-yellow-500/20 text-yellow-400",
    processing: "bg-blue-500/20 text-blue-400",
    completed: "bg-green-500/20 text-green-400",
    failed: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="node-model" className="text-[10px] text-muted-foreground block mb-1">Model</label>
        <select
          id="node-model"
          value={modelId}
          onChange={(e) => updateNodeData(node.id, { modelId: e.target.value })}
          className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
          style={{ backgroundColor: "var(--color-background)", color: "var(--color-foreground)" }}
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="node-resolution" className="text-[10px] text-muted-foreground block mb-1">Resolution</label>
        <select
          id="node-resolution"
          value={resolution}
          onChange={(e) => updateNodeData(node.id, { resolution: e.target.value })}
          className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
          style={{ backgroundColor: "var(--color-background)", color: "var(--color-foreground)" }}
        >
          {RESOLUTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <span className="text-[10px] text-muted-foreground block mb-1">Status</span>
        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium ${statusColors[status] || statusColors.idle}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function MediaProperties({ node, kind }: { node: Node<NodeData>; kind: string }) {
  const { edges, updateNodeData } = useCanvasStore();
  const hasInput = edges.some((e) => e.target === node.id);
  const url = (node.data as any).imageUrl || (node.data as any).videoUrl || (node.data as any).audioUrl;

  return (
    <div className="space-y-3">
      {hasInput && url ? (
        <div>
          <span className="text-[10px] text-muted-foreground block mb-1">Source</span>
          <p className="text-[10px] text-foreground break-all">{url}</p>
        </div>
      ) : (
        <p className="text-[10px] text-muted-foreground/50 italic">
          {hasInput ? "Processing..." : "No input connected"}
        </p>
      )}
      {kind === "image" && (
        <div>
          <label htmlFor="node-alt" className="text-[10px] text-muted-foreground block mb-1">Alt text</label>
          <input
            id="node-alt"
            type="text"
            value={(node.data as any).alt || ""}
            onChange={(e) => updateNodeData(node.id, { alt: e.target.value })}
            className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
          />
        </div>
      )}
      {kind === "video" && (
        <div>
          <label htmlFor="node-duration" className="text-[10px] text-muted-foreground block mb-1">Duration (s)</label>
          <input
            id="node-duration"
            type="number"
            min={1}
            max={60}
            value={(node.data as any).duration || 5}
            onChange={(e) => updateNodeData(node.id, { duration: Number(e.target.value) })}
            className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
          />
        </div>
      )}
    </div>
  );
}

function LogicProperties({ node }: { node: Node<NodeData> }) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="node-condition" className="text-[10px] text-muted-foreground block mb-1">Condition</label>
        <textarea
          id="node-condition"
          value={(node.data as any).condition || ""}
          onChange={(e) => updateNodeData(node.id, { condition: e.target.value })}
          rows={3}
          placeholder="e.g. prompt.includes('dramatic')"
          className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground resize-none font-mono focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="node-true" className="text-[10px] text-muted-foreground block mb-1">True label</label>
          <input
            id="node-true"
            type="text"
            value={(node.data as any).trueLabel || "True"}
            onChange={(e) => updateNodeData(node.id, { trueLabel: e.target.value })}
            className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
          />
        </div>
        <div>
          <label htmlFor="node-false" className="text-[10px] text-muted-foreground block mb-1">False label</label>
          <input
            id="node-false"
            type="text"
            value={(node.data as any).falseLabel || "False"}
            onChange={(e) => updateNodeData(node.id, { falseLabel: e.target.value })}
            className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
          />
        </div>
      </div>
    </div>
  );
}

function OutputProperties({ node }: { node: Node<NodeData> }) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const format = (node.data as any).format || "mp4";
  const quality = (node.data as any).quality || "standard";

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="node-format" className="text-[10px] text-muted-foreground block mb-1">Format</label>
        <select
          id="node-format"
          value={format}
          onChange={(e) => updateNodeData(node.id, { format: e.target.value })}
          className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
          style={{ backgroundColor: "var(--color-background)", color: "var(--color-foreground)" }}
        >
          <option value="mp4">MP4</option>
          <option value="webm">WebM</option>
          <option value="gif">GIF</option>
        </select>
      </div>
      <div>
        <label htmlFor="node-quality" className="text-[10px] text-muted-foreground block mb-1">Quality</label>
        <select
          id="node-quality"
          value={quality}
          onChange={(e) => updateNodeData(node.id, { quality: e.target.value })}
          className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
          style={{ backgroundColor: "var(--color-background)", color: "var(--color-foreground)" }}
        >
          <option value="draft">Draft</option>
          <option value="standard">Standard</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
}

function NodeProperties({ node }: { node: Node<NodeData> }) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="node-label" className="text-[10px] text-muted-foreground block mb-1">Label</label>
        <input
          id="node-label"
          type="text"
          value={node.data.label}
          onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
          className="w-full rounded bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
        />
      </div>
      <div className="text-[10px] text-muted-foreground/50">Type: {node.type}</div>
    </div>
  );
}

function TypeSpecificProperties({ node }: { node: Node<NodeData> }) {
  switch (node.type) {
    case "prompt":
      return <PromptProperties node={node} />;
    case "generation":
      return <GenerationProperties node={node} />;
    case "image":
      return <MediaProperties node={node} kind="image" />;
    case "video":
      return <MediaProperties node={node} kind="video" />;
    case "audio":
      return <MediaProperties node={node} kind="audio" />;
    case "logic":
      return <LogicProperties node={node} />;
    case "output":
      return <OutputProperties node={node} />;
    default:
      return null;
  }
}

export function PropertiesPanel() {
  const { nodes, selectedNodeId, removeNode } = useCanvasStore();
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
        <NodeProperties node={selectedNode} />
        <TypeSpecificProperties node={selectedNode} />
      </div>
    </aside>
  );
}
