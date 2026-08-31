import type { Node, Edge } from "reactflow";

// ─── Node Types ──────────────────────────────────────────────────────
export type CanvasNode = Node<NodeData, CanvasNodeType>;
export type CanvasEdge = Edge;

export type CanvasNodeType =
  | "prompt"
  | "generation"
  | "image"
  | "video"
  | "audio"
  | "logic"
  | "output";

export interface NodeData {
  label: string;
  [key: string]: any;
}

export interface PromptNodeData extends NodeData {
  prompt: string;
  referenceImages: string[];
}

export interface GenerationNodeData extends NodeData {
  modelId: string;
  parameters: Record<string, any>;
  status: "idle" | "pending" | "processing" | "completed" | "failed";
}

export interface ImageNodeData extends NodeData {
  imageUrl: string | null;
  alt: string;
}

export interface VideoNodeData extends NodeData {
  videoUrl: string | null;
  duration: number;
  resolution: string;
}

export interface AudioNodeData extends NodeData {
  audioUrl: string | null;
  type: "dialogue" | "ambiance" | "score";
}

export interface LogicNodeData extends NodeData {
  condition: string;
  trueLabel: string;
  falseLabel: string;
}

export interface OutputNodeData extends NodeData {
  format: "mp4" | "webm" | "gif";
  resolution: string;
  quality: "draft" | "standard" | "high";
}

// ─── Canvas State ────────────────────────────────────────────────────
export interface CanvasState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  viewport: { x: number; y: number; zoom: number };
}

// ─── Node Connection Rules ───────────────────────────────────────────
export const NODE_CONNECTIONS: Record<CanvasNodeType, CanvasNodeType[]> = {
  prompt: ["generation", "logic"],
  generation: ["image", "video", "audio", "output"],
  image: ["generation", "logic", "output"],
  video: ["logic", "output"],
  audio: ["logic", "output"],
  logic: ["generation", "image", "video", "audio", "output"],
  output: [],
};
