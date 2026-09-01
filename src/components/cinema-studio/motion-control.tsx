"use client";

import { cn } from "@/lib/utils";
import { useCinemaStudioStore } from "@/stores/cinema-studio-store";
import { CAMERA_PRESETS } from "@/constants/camera-presets";
import { SPEED_VARIATIONS } from "@/constants/genres";
import { MAX_MOTIONS, type SpeedVariation } from "@/types/cinema-studio";
import { Plus, X, Move } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function MotionSlotEditor({
  index,
  presetId,
  speed,
}: {
  index: number;
  presetId: string;
  speed: SpeedVariation;
}) {
  const updateMotion = useCinemaStudioStore((s) => s.updateMotion);
  const removeMotion = useCinemaStudioStore((s) => s.removeMotion);
  const preset = CAMERA_PRESETS.find((p) => p.id === presetId);

  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface p-2.5">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gold/15 text-[10px] font-bold text-gold">
        {index + 1}
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        {/* Preset selector */}
        <select
          value={presetId}
          onChange={(e) => updateMotion(index, { presetId: e.target.value })}
          autoComplete="off"
          className="w-full rounded bg-background px-2 py-1 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
          aria-label={`Motion ${index + 1} camera preset`}
          style={{ backgroundColor: "var(--color-surface)", color: "var(--color-foreground)" }}
        >
          {CAMERA_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Speed selector */}
        <select
          value={speed}
          onChange={(e) =>
            updateMotion(index, {
              speed: e.target.value as SpeedVariation,
            })
          }
          autoComplete="off"
          className="w-full rounded bg-background px-2 py-1 text-[10px] text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
          aria-label={`Motion ${index + 1} speed variation`}
          style={{ backgroundColor: "var(--color-surface)", color: "var(--color-muted-foreground)" }}
        >
          {SPEED_VARIATIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => removeMotion(index)}
        className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        aria-label={`Remove motion ${index + 1}: ${preset?.name ?? "unknown"}`}
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

export function MotionControl() {
  const motions = useCinemaStudioStore((s) => s.camera.motions);
  const addMotion = useCinemaStudioStore((s) => s.addMotion);
  const canAdd = motions.length < MAX_MOTIONS;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Motion Control
        </h3>
        <span className="text-[10px] tabular-nums text-muted-foreground/60">
          {motions.length}/{MAX_MOTIONS}
        </span>
      </div>

      <div className="space-y-2">
        {motions.map((motion, idx) => (
          <MotionSlotEditor
            key={`${idx}-${motion.presetId}`}
            index={idx}
            presetId={motion.presetId}
            speed={motion.speed}
          />
        ))}
      </div>

      <Tooltip>
        <TooltipTrigger>
          <button
            onClick={() =>
              addMotion({ presetId: "pan-left", speed: "linear" })
            }
            disabled={!canAdd}
            className={cn(
              "flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed py-2 text-xs transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              canAdd
                ? "border-gold/30 text-gold hover:bg-gold/5"
                : "border-border text-muted-foreground/30 cursor-not-allowed"
            )}
            aria-label={
              canAdd
                ? "Add another camera motion"
                : "Maximum 3 motions reached"
            }
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{canAdd ? "Add Motion" : "Max motions reached"}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {canAdd
            ? "Stack up to 3 simultaneous camera motions"
            : "Remove a motion to add another"}
        </TooltipContent>
      </Tooltip>

      {/* Visual stacking indicator */}
      {motions.length > 0 && (
        <div className="flex items-center gap-1 rounded bg-surface/50 px-2 py-1.5">
          <Move className="h-3 w-3 text-muted-foreground/50" aria-hidden="true" />
          <span className="text-[10px] text-muted-foreground/50">
            {motions.length === 1
              ? "Single motion"
              : motions.length === 2
                ? "Dual motion stack"
                : "Triple motion stack \u2014 cinematic richness"}
          </span>
        </div>
      )}
    </div>
  );
}
