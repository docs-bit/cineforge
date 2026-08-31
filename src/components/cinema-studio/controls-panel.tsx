"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CameraSettings } from "./camera-settings";
import { MotionControl } from "./motion-control";
import { GenreSpeedSelector } from "./genre-speed-selector";
import { VFXPanel } from "./vfx-panel";
import { ColorGradingPanel } from "./color-grading-panel";

export function ControlsPanel() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="space-y-5 p-4">
        <CameraSettings />
        <Separator className="bg-border/50" />
        <MotionControl />
        <Separator className="bg-border/50" />
        <GenreSpeedSelector />
        <Separator className="bg-border/50" />
        <VFXPanel />
        <Separator className="bg-border/50" />
        <ColorGradingPanel />
        {/* Spacer for bottom padding */}
        <div className="h-4" />
      </div>
    </ScrollArea>
  );
}
