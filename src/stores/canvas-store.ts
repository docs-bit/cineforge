"use client";

import { create } from "zustand";
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import type { CanvasNodeType, NodeData } from "@/types/canvas";

interface CanvasStore {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  viewport: { x: number; y: number; zoom: number };

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  addNode: (type: CanvasNodeType, position: { x: number; y: number }) => void;
  removeNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  setSelectedNodeId: (id: string | null) => void;
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void;

  loadCanvas: (nodes: Node<NodeData>[], edges: Edge[]) => void;
  clearCanvas: () => void;
}

const NODE_DEFAULTS: Record<CanvasNodeType, NodeData> = {
  prompt: { label: "Prompt", prompt: "", referenceImages: [] },
  generation: { label: "Generation", modelId: "sora-2", parameters: {}, status: "idle" },
  image: { label: "Image", imageUrl: null, alt: "" },
  video: { label: "Video", videoUrl: null, duration: 5, resolution: "1080p" },
  audio: { label: "Audio", audioUrl: null, type: "dialogue" },
  logic: { label: "Logic", condition: "", trueLabel: "True", falseLabel: "False" },
  output: { label: "Output", format: "mp4", resolution: "1080p", quality: "standard" },
};

let nodeIdCounter = 0;

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  viewport: { x: 0, y: 0, zoom: 1 },

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as Node<NodeData>[] });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    set({ edges: addEdge({ ...connection, type: "custom" }, get().edges) });
  },

  addNode: (type, position) => {
    const id = `node-${++nodeIdCounter}`;
    const newNode = {
      id,
      type,
      position,
      data: { ...NODE_DEFAULTS[type] },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  removeNode: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setViewport: (viewport) => set({ viewport }),

  loadCanvas: (nodes, edges) => set({ nodes, edges, selectedNodeId: null }),
  clearCanvas: () => set({ nodes: [], edges: [], selectedNodeId: null }),
}));
