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

interface GenerationJobResponse {
  id: string;
  status: string;
  resultUrls?: string[];
  errorMessage?: string;
}

interface CinemaStudioState {
  version: CinemaVersion;
  setVersion: (v: CinemaVersion) => void;
  sensorProfile: SensorProfile;
  focalLength: FocalLength;
  aperture: ApertureStop;
  cameraPresetId: string | null;
  setSensorProfile: (p: SensorProfile) => void;
  setFocalLength: (l: FocalLength) => void;
  setAperture: (a: ApertureStop) => void;
  setCameraPreset: (id: string | null) => void;
  motions: MotionSlot[];
  addMotion: (motion: MotionSlot) => void;
  removeMotion: (index: number) => void;
  updateMotion: (index: number, motion: Partial<MotionSlot>) => void;
  genre: Genre;
  speed: SpeedVariation;
  setGenre: (g: Genre) => void;
  setSpeed: (s: SpeedVariation) => void;
  selectedEffects: string[];
  toggleEffect: (effectId: string) => void;
  colorGrading: ColorGradingSettings;
  setColorGrading: (settings: Partial<ColorGradingSettings>) => void;
  resetColorGrading: () => void;
  prompt: string;
  setPrompt: (p: string) => void;
  resolution: Resolution;
  aspectRatio: AspectRatio;
  frameRate: FrameRate;
  setResolution: (r: Resolution) => void;
  setAspectRatio: (a: AspectRatio) => void;
  setFrameRate: (f: FrameRate) => void;
  generationStatus: GenerationStatus;
  generationProgress: number;
  generationError: string | null;
  generationResultUrls: string[];
  startGeneration: () => void;
  setGenerationStatus: (status: GenerationStatus) => void;
  setGenerationProgress: (progress: number) => void;
  setGenerationError: (error: string | null) => void;
  resetGeneration: () => void;
}

const DEFAULT_COLOR_GRADING: ColorGradingSettings = {
  temperature: 0, contrast: 0, saturation: 0, sharpness: 0,
  filmGrain: 0, highlights: 0, exposure: 0,
};

const GENERATION_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 2_000;

let activeGenerationAbort: AbortController | null = null;

export const useCinemaStudioStore = create<CinemaStudioState>((set, get) => ({
  version: "3.0",
  setVersion: (version) => set({ version }),
  sensorProfile: "digital_cinema",
  focalLength: 35,
  aperture: 2.8,
  cameraPresetId: null,
  setSensorProfile: (sensorProfile) => set({ sensorProfile }),
  setFocalLength: (focalLength) => set({ focalLength }),
  setAperture: (aperture) => set({ aperture }),
  setCameraPreset: (cameraPresetId) => set({ cameraPresetId }),
  motions: [{ presetId: "dolly-in", speed: "linear" }],
  addMotion: (motion) =>
    set((state) => {
      if (state.motions.length >= 3) return state;
      return { motions: [...state.motions, motion] };
    }),
  removeMotion: (index) =>
    set((state) => ({ motions: state.motions.filter((_, i) => i !== index) })),
  updateMotion: (index, update) =>
    set((state) => ({
      motions: state.motions.map((m, i) => (i === index ? { ...m, ...update } : m)),
    })),
  genre: "general",
  speed: "linear",
  setGenre: (genre) => set({ genre }),
  setSpeed: (speed) => set({ speed }),
  selectedEffects: [],
  toggleEffect: (effectId) =>
    set((state) => ({
      selectedEffects: state.selectedEffects.includes(effectId)
        ? state.selectedEffects.filter((id) => id !== effectId)
        : [...state.selectedEffects, effectId],
    })),
  colorGrading: DEFAULT_COLOR_GRADING,
  setColorGrading: (settings) =>
    set((state) => ({ colorGrading: { ...state.colorGrading, ...settings } })),
  resetColorGrading: () => set({ colorGrading: DEFAULT_COLOR_GRADING }),
  prompt: "",
  setPrompt: (prompt) => set({ prompt }),
  resolution: "1080p",
  aspectRatio: "16:9",
  frameRate: 24,
  setResolution: (resolution) => set({ resolution }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  setFrameRate: (frameRate) => set({ frameRate }),
  generationStatus: "idle",
  generationProgress: 0,
  generationError: null,
  generationResultUrls: [],

  startGeneration: () => {
    if (activeGenerationAbort) activeGenerationAbort.abort();
    activeGenerationAbort = new AbortController();
    const signal = activeGenerationAbort.signal;

    set({ generationStatus: "pending", generationProgress: 0, generationError: null, generationResultUrls: [] });

    const s = get();
    const payload = {
      modelId: "sora-2",
      inputType: "text",
      inputData: { prompt: s.prompt },
      parameters: {
        camera: { sensorProfile: s.sensorProfile, focalLength: s.focalLength, aperture: s.aperture, cameraPresetId: s.cameraPresetId, motions: s.motions },
        style: { genre: s.genre, speed: s.speed, selectedEffects: s.selectedEffects, colorGrading: s.colorGrading },
        output: { resolution: s.resolution, aspectRatio: s.aspectRatio, frameRate: s.frameRate },
      },
    };

    const timeoutId = setTimeout(() => {
      if (!signal.aborted) {
        activeGenerationAbort?.abort();
        set({ generationStatus: "failed", generationError: "Request timed out after 30 seconds" });
      }
    }, GENERATION_TIMEOUT_MS);

    (async () => {
      try {
        const job = await apiPost<GenerationJobResponse>("/api/v1/generate", payload, signal);
        if (signal.aborted) return;
        set({ generationStatus: "processing", generationProgress: 10 });

        while (!signal.aborted) {
          await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
          if (signal.aborted) return;
          const status = await apiGet<GenerationJobResponse>(`/api/v1/generate/${job.id}`, signal);
          if (signal.aborted) return;

          if (status.status === "completed") {
            set({ generationStatus: "completed", generationProgress: 100, generationResultUrls: status.resultUrls || [] });
            return;
          }
          if (status.status === "failed") {
            set({ generationStatus: "failed", generationError: status.errorMessage || "Generation failed" });
            return;
          }
          set((prev) => ({ generationProgress: Math.min(prev.generationProgress + 15, 90) }));
        }
      } catch (err: unknown) {
        if (signal.aborted) return;
        const message = err instanceof Error ? err.message : "Unknown error occurred";
        const isUnavailable =
          message.includes("Failed to fetch") || message.includes("NetworkError") ||
          message.includes("ECONNREFUSED") || message.includes("ERR_CONNECTION_REFUSED");
        set({
          generationStatus: "failed",
          generationError: isUnavailable
            ? "Backend unavailable \u2014 start the NestJS server at apps/api"
            : message,
        });
      } finally {
        clearTimeout(timeoutId);
      }
    })();
  },

  setGenerationStatus: (generationStatus) => set({ generationStatus }),
  setGenerationProgress: (generationProgress) => set({ generationProgress }),
  setGenerationError: (generationError) => set({ generationError }),
  resetGeneration: () => {
    activeGenerationAbort?.abort();
    activeGenerationAbort = null;
    set({ generationStatus: "idle", generationProgress: 0, generationError: null, generationResultUrls: [] });
  },
}));
