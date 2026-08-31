"use client";

import { cn } from "@/lib/utils";
import { useCinemaStudioStore } from "@/stores/cinema-studio-store";
import { COLOR_GRADING_PRESETS } from "@/constants/genres";
import { Lock, RotateCcw } from "lucide-react";
import type { ColorGradingSettings } from "@/types/cinema-studio";

const SLIDER_FIELDS: {
  key: keyof ColorGradingSettings;
  label: string;
  min: number;
  max: number;
  step: number;
}[] = [
  { key: "temperature", label: "Temperature", min: -100, max: 100, step: 1 },
  { key: "contrast", label: "Contrast", min: -100, max: 100, step: 1 },
  { key: "saturation", label: "Saturation", min: -100, max: 100, step: 1 },
  { key: "sharpness", label: "Sharpness", min: 0, max: 100, step: 1 },
  { key: "filmGrain", label: "Film Grain", min: 0, max: 100, step: 1 },
  { key: "highlights", label: "Highlights", min: -100, max: 100, step: 1 },
  { key: "exposure", label: "Exposure", min: -100, max: 100, step: 1 },
];

function GradingSlider({
  field,
  value,
  onChange,
}: {
  field: (typeof SLIDER_FIELDS)[number];
  value: number;
  onChange: (key: keyof ColorGradingSettings, value: number) => void;
}) {
  const id = `grading-${field.key}`;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[10px] text-muted-foreground"
        >
          {field.label}
        </label>
        <span className="text-[10px] font-mono text-muted-foreground/60 tabular-nums">
          {value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => onChange(field.key, Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-surface cursor-pointer accent-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        aria-label={`${field.label}: ${value}`}
      />
    </div>
  );
}

export function ColorGradingPanel() {
  const { version, colorGrading, setColorGrading, resetColorGrading } =
    useCinemaStudioStore();

  const isLocked = version === "2.0";

  if (isLocked) {
    return (
      <div className="space-y-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Color Grading
        </h3>
        <div className="flex items-center gap-2 rounded-lg bg-surface/50 p-3 text-xs text-muted-foreground/50">
          <Lock className="h-4 w-4" aria-hidden="true" />
          <span>Available from Cinema Studio v2.5+</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Color Grading
        </h3>
        <button
          onClick={resetColorGrading}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          aria-label="Reset all color grading to defaults"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          Reset
        </button>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-1">
        {COLOR_GRADING_PRESETS.map((preset) => {
          const isActive =
            preset.id !== "none" &&
            Object.entries(preset.settings).every(
              ([key, val]) =>
                colorGrading[key as keyof ColorGradingSettings] === val
            );
          return (
            <button
              key={preset.id}
              onClick={() => setColorGrading(preset.settings)}
              className={cn(
                "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                isActive
                  ? "bg-gold/15 text-gold"
                  : "bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              )}
              aria-pressed={isActive}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        {SLIDER_FIELDS.map((field) => (
          <GradingSlider
            key={field.key}
            field={field}
            value={colorGrading[field.key]}
            onChange={(key, value) => setColorGrading({ [key]: value })}
          />
        ))}
      </div>
    </div>
  );
}
