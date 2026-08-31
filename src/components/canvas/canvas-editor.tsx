"use client";

import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCanvasStore } from "@/stores/canvas-store";
import { NODE_TYPES } from "./nodes/node-types";
import { CustomEdge } from "./edges/custom-edge";

const edgeTypes = { custom: CustomEdge };

export function CanvasEditor() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setSelectedNodeId } = useCanvasStore();

  const onNodeClick = (_: React.MouseEvent, node: { id: string }) => {
    setSelectedNodeId(node.id);
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
  };

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={NODE_TYPES}
        edgeTypes={edgeTypes}
        fitView
        className="bg-background"
        defaultEdgeOptions={{ type: "custom" }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--color-border)" />
        <Controls className="!bg-surface !border-border !rounded-lg" />
        <MiniMap
          className="!bg-surface !border-border !rounded-lg"
          nodeColor="var(--color-gold-dim)"
          maskColor="rgba(0,0,0,0.5)"
        />
      </ReactFlow>
    </div>
  );
}
