import type { Genre, SpeedVariation } from "@/types/cinema-studio";

// ─── Genres ──────────────────────────────────────────────────────────
export interface GenreOption {
  id: Genre;
  label: string;
  icon: string;
  color: string; // Tailwind class for tint
}

export const GENRES: GenreOption[] = [
  { id: "general", label: "General", icon: "🎬", color: "bg-muted" },
  { id: "action", label: "Action", icon: "💥", color: "bg-red-500/20" },
  { id: "horror", label: "Horror", icon: "👻", color: "bg-purple-500/20" },
  { id: "comedy", label: "Comedy", icon: "😂", color: "bg-yellow-500/20" },
  { id: "noir", label: "Noir", icon: "🕵️", color: "bg-zinc-500/20" },
  { id: "drama", label: "Drama", icon: "🎭", color: "bg-blue-500/20" },
  { id: "epic", label: "Epic", icon: "⚔️", color: "bg-amber-500/20" },
];

// ─── Speed Variations ────────────────────────────────────────────────
export interface SpeedOption {
  id: SpeedVariation;
  label: string;
  description: string;
}

export const SPEED_VARIATIONS: SpeedOption[] = [
  { id: "linear", label: "Linear", description: "Constant, even motion" },
  { id: "auto", label: "Auto", description: "AI-selected optimal speed" },
  { id: "flash_in", label: "Flash In", description: "Rapid start, settles slow" },
  { id: "flash_out", label: "Flash Out", description: "Slow start, rapid finish" },
  { id: "slow_mo", label: "Slow-Mo", description: "Dreamy slow motion" },
  { id: "bullet_time", label: "Bullet Time", description: "Frozen subject, moving camera" },
  { id: "impact", label: "Impact", description: "Sudden high-speed moment" },
  { id: "ramp_up", label: "Ramp Up", description: "Gradual acceleration to peak" },
];

// ─── Color Grading Presets ───────────────────────────────────────────
export interface ColorGradingPreset {
  id: string;
  label: string;
  settings: {
    temperature: number;
    contrast: number;
    saturation: number;
    sharpness: number;
    filmGrain: number;
    highlights: number;
    exposure: number;
  };
}

export const COLOR_GRADING_PRESETS: ColorGradingPreset[] = [
  { id: "none", label: "None", settings: { temperature: 0, contrast: 0, saturation: 0, sharpness: 0, filmGrain: 0, highlights: 0, exposure: 0 } },
  { id: "cinematic", label: "Cinematic", settings: { temperature: 10, contrast: 20, saturation: -10, sharpness: 15, filmGrain: 5, highlights: -15, exposure: 0 } },
  { id: "vintage", label: "Vintage", settings: { temperature: 25, contrast: -10, saturation: -20, sharpness: -5, filmGrain: 30, highlights: 10, exposure: 5 } },
  { id: "neon", label: "Neon", settings: { temperature: -15, contrast: 30, saturation: 40, sharpness: 20, filmGrain: 0, highlights: 20, exposure: 5 } },
  { id: "noir", label: "Noir", settings: { temperature: -5, contrast: 40, saturation: -80, sharpness: 10, filmGrain: 15, highlights: -20, exposure: -10 } },
  { id: "warm", label: "Warm Glow", settings: { temperature: 40, contrast: 5, saturation: 10, sharpness: 5, filmGrain: 0, highlights: 15, exposure: 10 } },
  { id: "cool", label: "Cool Tone", settings: { temperature: -30, contrast: 10, saturation: -5, sharpness: 10, filmGrain: 0, highlights: -5, exposure: 0 } },
];

// ─── Resolution Options ──────────────────────────────────────────────
export const RESOLUTIONS = ["720p", "1080p", "4k"] as const;
export const ASPECT_RATIOS = ["16:9", "9:16", "1:1", "3:4", "2:3", "3:2"] as const;
export const FRAME_RATES = [24, 30, 60] as const;
