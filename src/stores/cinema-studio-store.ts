"use client";

import { create } from "zustand";
import { apiPost, apiGet } from "@/lib/api";
import type {
  CinemaVersion,
  SensorProfile,
  FocalLength,
  ApertureStop,
  MotionSlot,
  Genre,
  SpeedVariation,
  ColorGradingSettings,
  GenerationStatus,
  Resolution,
  AspectRatio,
  FrameRate,
} from "@/types/cinema-studio";

// ─── Sub-object interfaces ────────────────────────────────────────

export interface CameraSettings {
  sensorProfile: SensorProfile;
  focalLength: FocalLength;
  aperture: ApertureStop;
  cameraPresetId: string | null;
  cameraPresetName: string | null;
  motions: MotionSlot[];
}

export interface StyleSettings {
  genre: Genre;
  speed: SpeedVariation;
  selectedEffects: string[];
  colorGrading: ColorGradingSettings;
}

export interface OutputSettings {
  resolution: Resolution;
  aspectRatio: AspectRatio;
  frameRate: FrameRate;
}

export interface GenerationState {
  status: GenerationStatus;
  progress: number;
  error: string | null;
  jobId: string | null;
  resultUrls: string[];
}

// ─── API response type ───────────────────────────────────────────

interface GenerationJobResponse {
  id: string;
  status: string;
  resultUrls?: string[];
  errorMessage?: string;
}

// ─── Top-level state ─────────────────────────────────────────────

interface CinemaStudioState {
  // Domain data
  version: CinemaVersion;
  prompt: string;
  camera: CameraSettings;
  style: StyleSettings;
  output: OutputSettings;
  generation: GenerationState;

  // Domain setters
  setVersion: (v: CinemaVersion) => void;
  setPrompt: (p: string) => void;
  updateCamera: (partial: Partial<CameraSettings>) => void;
  updateStyle: (partial: Partial<StyleSettings>) => void;
  updateOutput: (partial: Partial<OutputSettings>) => void;

  // Camera motion helpers
  addMotion: (motion: MotionSlot) => void;
  removeMotion: (index: number) => void;
  updateMotion: (index: number, motion: Partial<MotionSlot>) => void;

  // Style helpers
  toggleEffect: (effectId: string) => void;
  setColorGrading: (settings: Partial<ColorGradingSettings>) => void;
  resetColorGrading: () => void;

  // Generation actions
  startGeneration: () => void;
  cancelGeneration: () => void;
  resetGeneration: () => void;
}

// ─── Defaults ────────────────────────────────────────────────────

const DEFAULT_COLOR_GRADING: ColorGradingSettings = {
  temperature: 0, contrast: 0, saturation: 0, sharpness: 0,
  filmGrain: 0, highlights: 0, exposure: 0,
};

const GENERATION_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 2_000;

let activeGenerationAbort: AbortController | null = null;

// ─── Store ───────────────────────────────────────────────────────

export const useCinemaStudioStore = create<CinemaStudioState>((set, get) => ({
  // ── Domain data ──
  version: "3.0",
  prompt: "",

  camera: {
    sensorProfile: "digital_cinema",
    focalLength: 35,
    aperture: 2.8,
    cameraPresetId: null,
    cameraPresetName: null,
    motions: [{ presetId: "dolly-in", speed: "linear" }],
  },

  style: {
    genre: "general",
    speed: "linear",
    selectedEffects: [],
    colorGrading: DEFAULT_COLOR_GRADING,
  },

  output: {
    resolution: "1080p",
    aspectRatio: "16:9",
    frameRate: 24,
  },

  generation: {
    status: "idle",
    progress: 0,
    error: null,
    jobId: null,
    resultUrls: [],
  },

  // ── Domain setters ──
  setVersion: (version) => set({ version }),
  setPrompt: (prompt) => set({ prompt }),

  updateCamera: (partial) =>
    set((state) => ({ camera: { ...state.camera, ...partial } })),

  updateStyle: (partial) =>
    set((state) => ({ style: { ...state.style, ...partial } })),

  updateOutput: (partial) =>
    set((state) => ({ output: { ...state.output, ...partial } })),

  // ── Camera motion helpers ──
  addMotion: (motion) =>
    set((state) => {
      if (state.camera.motions.length >= 3) return state;
      return { camera: { ...state.camera, motions: [...state.camera.motions, motion] } };
    }),

  removeMotion: (index) =>
    set((state) => ({
      camera: {
        ...state.camera,
        motions: state.camera.motions.filter((_, i) => i !== index),
      },
    })),

  updateMotion: (index, update) =>
    set((state) => ({
      camera: {
        ...state.camera,
        motions: state.camera.motions.map((m, i) =>
          i === index ? { ...m, ...update } : m
        ),
      },
    })),

  // ── Style helpers ──
  toggleEffect: (effectId) =>
    set((state) => {
      const has = state.style.selectedEffects.includes(effectId);
      return {
        style: {
          ...state.style,
          selectedEffects: has
            ? state.style.selectedEffects.filter((id) => id !== effectId)
            : [...state.style.selectedEffects, effectId],
        },
      };
    }),

  setColorGrading: (settings) =>
    set((state) => ({
      style: {
        ...state.style,
        colorGrading: { ...state.style.colorGrading, ...settings },
      },
    })),

  resetColorGrading: () =>
    set((state) => ({
      style: { ...state.style, colorGrading: DEFAULT_COLOR_GRADING },
    })),

  // ── Generation actions ──
  startGeneration: () => {
    if (activeGenerationAbort) activeGenerationAbort.abort();
    activeGenerationAbort = new AbortController();
    const signal = activeGenerationAbort.signal;

    set({
      generation: {
        status: "pending",
        progress: 0,
        error: null,
        jobId: null,
        resultUrls: [],
      },
    });

    const s = get();
    const payload = {
      modelId: "sora-2",
      inputType: "text",
      inputData: { prompt: s.prompt },
      parameters: {
        camera: s.camera,
        style: s.style,
        output: s.output,
      },
    };

    const timeoutId = setTimeout(() => {
      if (!signal.aborted) {
        activeGenerationAbort?.abort();
        set((state) => ({
          generation: { ...state.generation, status: "failed", error: "Request timed out after 30 seconds" },
        }));
      }
    }, GENERATION_TIMEOUT_MS);

    (async () => {
      try {
        const job = await apiPost<GenerationJobResponse>("/api/v1/generate", payload, signal);
        if (signal.aborted) return;

        set((state) => ({
          generation: { ...state.generation, status: "processing", progress: 10, jobId: job.id },
        }));

        while (!signal.aborted) {
          await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
          if (signal.aborted) return;

          const status = await apiGet<GenerationJobResponse>(`/api/v1/generate/${job.id}`, signal);
          if (signal.aborted) return;

          if (status.status === "completed") {
            set((state) => ({
              generation: { ...state.generation, status: "completed", progress: 100, resultUrls: status.resultUrls || [] },
            }));
            return;
          }
          if (status.status === "failed") {
            set((state) => ({
              generation: { ...state.generation, status: "failed", error: status.errorMessage || "Generation failed" },
            }));
            return;
          }
          set((state) => ({
            generation: { ...state.generation, progress: Math.min(state.generation.progress + 15, 90) },
          }));
        }
      } catch (err: unknown) {
        if (signal.aborted) return;
        const message = err instanceof Error ? err.message : "Unknown error occurred";
        const isUnavailable =
          message.includes("Failed to fetch") || message.includes("NetworkError") ||
          message.includes("ECONNREFUSED") || message.includes("ERR_CONNECTION_REFUSED");
        set((state) => ({
          generation: {
            ...state.generation,
            status: "failed",
            error: isUnavailable
              ? "Backend unavailable \u2014 start the NestJS server at apps/api"
              : message,
          },
        }));
      } finally {
        clearTimeout(timeoutId);
      }
    })();
  },

  cancelGeneration: () => {
    activeGenerationAbort?.abort();
    activeGenerationAbort = null;
  },

  resetGeneration: () => {
    activeGenerationAbort?.abort();
    activeGenerationAbort = null;
    set({
      generation: { status: "idle", progress: 0, error: null, jobId: null, resultUrls: [] },
    });
  },
}));
