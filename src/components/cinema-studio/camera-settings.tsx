"use client";

import { cn } from "@/lib/utils";
import { useCinemaStudioStore } from "@/stores/cinema-studio-store";
import {
  SENSOR_PROFILES,
  FOCAL_LENGTHS,
  APERTURE_STOPS,
  type SensorProfile,
  type FocalLength,
  type ApertureStop,
} from "@/types/cinema-studio";
import { CAMERA_PRESETS, PRESET_CATEGORIES } from "@/constants/camera-presets";
import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function SectionHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

function SensorProfileSelector() {
  const { sensorProfile, setSensorProfile } = useCinemaStudioStore();

  return (
    <div className="space-y-2">
      <SectionHeader title="Sensor Profile" />
      <div className="grid grid-cols-3 gap-1.5">
        {SENSOR_PROFILES.map((sp) => (
          <button
            key={sp.id}
            onClick={() => setSensorProfile(sp.id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              sensorProfile === sp.id
                ? "bg-gold/15 text-gold ring-1 ring-gold/30"
                : "bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            )}
            aria-pressed={sensorProfile === sp.id}
          >
            <span className="font-medium">{sp.label}</span>
            <span className="text-[10px] leading-tight text-muted-foreground">
              {sp.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FocalLengthSelector() {
  const { focalLength, setFocalLength } = useCinemaStudioStore();

  return (
    <div className="space-y-2">
      <SectionHeader title="Focal Length">
        <span className="text-xs font-mono text-gold tabular-nums">
          {focalLength}mm
        </span>
      </SectionHeader>
      <div className="flex gap-1">
        {FOCAL_LENGTHS.map((fl) => (
          <button
            key={fl}
            onClick={() => setFocalLength(fl)}
            className={cn(
              "flex-1 rounded-md py-1.5 text-[10px] font-mono transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              focalLength === fl
                ? "bg-gold/15 text-gold"
                : "bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            )}
            aria-pressed={focalLength === fl}
          >
            {fl}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground">
        {focalLength <= 24
          ? "Wide-angle — expansive scenes"
          : focalLength <= 50
            ? "Standard — natural perspective"
            : "Telephoto — compressed, intimate"}
      </p>
    </div>
  );
}

function ApertureSelector() {
  const { aperture, setAperture } = useCinemaStudioStore();

  return (
    <div className="space-y-2">
      <SectionHeader title="Aperture">
        <span className="text-xs font-mono text-gold tabular-nums">
          f/{aperture}
        </span>
      </SectionHeader>
      <div className="flex gap-1">
        {APERTURE_STOPS.map((f) => (
          <button
            key={f}
            onClick={() => setAperture(f)}
            className={cn(
              "flex-1 rounded-md py-1.5 text-[10px] font-mono transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              aperture === f
                ? "bg-gold/15 text-gold"
                : "bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            )}
            aria-pressed={aperture === f}
          >
            {f}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground">
        {aperture <= 2.8
          ? "Wide open — shallow depth of field"
          : aperture >= 8
            ? "Narrow — deep focus, everything sharp"
            : "Balanced depth of field"}
      </p>
    </div>
  );
}

function CameraPresetBrowser() {
  const { cameraPresetId, setCameraPreset } = useCinemaStudioStore();
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>("dolly");

  const filtered = CAMERA_PRESETS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = PRESET_CATEGORIES.map((cat) => ({
    ...cat,
    presets: filtered.filter((p) => p.category === cat.id),
  })).filter((g) => g.presets.length > 0);

  return (
    <div className="space-y-2">
      <SectionHeader title="Camera Presets" />
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search presets…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
          className="w-full rounded-md bg-surface pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
          aria-label="Search camera presets"
        />
      </div>

      {/* Grouped presets */}
      <div className="max-h-48 space-y-0.5 overflow-y-auto pr-1">
        {grouped.map((group) => (
          <div key={group.id}>
            <button
              onClick={() =>
                setOpenCategory(openCategory === group.id ? null : group.id)
              }
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                "hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                openCategory === group.id
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
              aria-expanded={openCategory === group.id}
            >
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true">{group.icon}</span>
                {group.label}
                <span className="text-muted-foreground/50">
                  ({group.presets.length})
                </span>
              </span>
              {openCategory === group.id ? (
                <ChevronUp className="h-3 w-3" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
              )}
            </button>
            {openCategory === group.id && (
              <div
                className="ml-2 space-y-0.5 pb-1"
                style={{ contentVisibility: "auto", containIntrinsicSize: "0 40px" }}
              >
                {group.presets.map((preset) => (
                  <Tooltip key={preset.id}>
                    <TooltipTrigger>
                      <button
                        onClick={() =>
                          setCameraPreset(
                            cameraPresetId === preset.id ? null : preset.id
                          )
                        }
                        className={cn(
                          "w-full rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                          cameraPresetId === preset.id
                            ? "bg-gold/15 text-gold"
                            : "text-muted-foreground hover:bg-surface hover:text-foreground"
                        )}
                        aria-pressed={cameraPresetId === preset.id}
                      >
                        {preset.name}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-48">
                      <p>{preset.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CameraSettings() {
  return (
    <div className="space-y-5">
      <SensorProfileSelector />
      <FocalLengthSelector />
      <ApertureSelector />
      <CameraPresetBrowser />
    </div>
  );
}
