import { PromptNode } from "./prompt-node";
import { GenerationNode } from "./generation-node";
import { ImageNode } from "./image-node";
import { VideoNode } from "./video-node";
import { AudioNode } from "./audio-node";
import { LogicNode } from "./logic-node";
import { OutputNode } from "./output-node";

export const NODE_TYPES = {
  prompt: PromptNode,
  generation: GenerationNode,
  image: ImageNode,
  video: VideoNode,
  audio: AudioNode,
  logic: LogicNode,
  output: OutputNode,
};
