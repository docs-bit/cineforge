"use client";

import { ReactFlowProvider } from "reactflow";
import { CanvasEditor } from "./canvas-editor";
import { NodeToolbox } from "./panels/node-toolbox";
import { PropertiesPanel } from "./panels/properties-panel";
import { CanvasToolbar } from "./panels/canvas-toolbar";

export function CanvasLayout() {
  return (
    <ReactFlowProvider>
      <div className="flex h-full flex-col">
        <CanvasToolbar />
        <div className="flex flex-1 min-h-0">
          <NodeToolbox />
          <div className="flex-1 min-w-0">
            <CanvasEditor />
          </div>
          <PropertiesPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
