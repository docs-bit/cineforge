// ─── Cinema Studio Version ────────────────────────────────────────────
export type CinemaVersion = "2.0" | "2.5" | "3.0" | "3.5";

export const CINEMA_VERSIONS: CinemaVersion[] = ["2.0", "2.5", "3.0", "3.5"];

export const VERSION_LABELS: Record<CinemaVersion, string> = {
  "2.0": "Camera Gimbal Control",
  "2.5": "AI Actors & Color Grading",
  "3.0": "Maximum Realism & Physics",
  "3.5": "AI-Assisted Directing",
};

// ─── Camera ──────────────────────────────────────────────────────────
export type SensorProfile = "vhs" | "film" | "digital_cinema";

export const SENSOR_PROFILES: {
  id: SensorProfile;
  label: string;
  description: string;
}[] = [
  { id: "vhs", label: "VHS", description: "Retro analog warmth & scan lines" },
  { id: "film", label: "Film", description: "Classic celluloid grain & tone" },
  {
    id: "digital_cinema",
    label: "Digital Cinema",
    description: "Clean, high-fidelity digital look",
  },
];

export const FOCAL_LENGTHS = [12, 16, 24, 35, 50, 85, 105, 135] as const;
export type FocalLength = (typeof FOCAL_LENGTHS)[number];

export const APERTURE_STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16] as const;
export type ApertureStop = (typeof APERTURE_STOPS)[number];

// ─── Camera Presets ──────────────────────────────────────────────────
export type PresetCategory =
  | "dolly"
  | "pan"
  | "tilt"
  | "orbit"
  | "zoom"
  | "crane"
  | "steadicam"
  | "static";

export interface CameraPreset {
  id: string;
  name: string;
  category: PresetCategory;
  description: string;
}

// ─── Motion ──────────────────────────────────────────────────────────
export interface MotionSlot {
  presetId: string;
  speed: SpeedVariation;
}

export const MAX_MOTIONS = 3;

// ─── Speed ───────────────────────────────────────────────────────────
export type SpeedVariation =
  | "linear"
  | "auto"
  | "flash_in"
  | "flash_out"
  | "slow_mo"
  | "bullet_time"
  | "impact"
  | "ramp_up";

// ─── Genre ───────────────────────────────────────────────────────────
export type Genre =
  | "general"
  | "action"
  | "horror"
  | "comedy"
  | "noir"
  | "drama"
  | "epic";

// ─── VFX ─────────────────────────────────────────────────────────────
export type VFXCategory =
  | "particles"
  | "lighting"
  | "transitions"
  | "stylization"
  | "text"
  | "motion";

export interface VFXEffect {
  id: string;
  name: string;
  category: VFXCategory;
  description: string;
}

// ─── Color Grading ───────────────────────────────────────────────────
export interface ColorGradingSettings {
  temperature: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  sharpness: number; // 0 to 100
  filmGrain: number; // 0 to 100
  highlights: number; // -100 to 100
  exposure: number; // -100 to 100
}

// ─── Generation ──────────────────────────────────────────────────────
export type GenerationStatus =
  | "idle"
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface GenerationResult {
  id: string;
  status: GenerationStatus;
  videoUrl?: string;
  thumbnailUrl?: string;
  progress: number;
  error?: string;
}

// ─── Content Parameters ──────────────────────────────────────────────
export type Resolution = "720p" | "1080p" | "4k";
export type AspectRatio = "16:9" | "9:16" | "1:1" | "3:4" | "2:3" | "3:2";
export type FrameRate = 24 | 30 | 60;
