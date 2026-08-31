"use client";

import { create } from "zustand";
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

interface CinemaStudioState {
  // Version
  version: CinemaVersion;
  setVersion: (v: CinemaVersion) => void;

  // Camera
  sensorProfile: SensorProfile;
  focalLength: FocalLength;
  aperture: ApertureStop;
  cameraPresetId: string | null;
  setSensorProfile: (p: SensorProfile) => void;
  setFocalLength: (l: FocalLength) => void;
  setAperture: (a: ApertureStop) => void;
  setCameraPreset: (id: string | null) => void;

  // Motion (up to 3)
  motions: MotionSlot[];
  addMotion: (motion: MotionSlot) => void;
  removeMotion: (index: number) => void;
  updateMotion: (index: number, motion: Partial<MotionSlot>) => void;

  // Genre & Speed
  genre: Genre;
  speed: SpeedVariation;
  setGenre: (g: Genre) => void;
  setSpeed: (s: SpeedVariation) => void;

  // VFX
  selectedEffects: string[];
  toggleEffect: (effectId: string) => void;

  // Color Grading (v2.5+)
  colorGrading: ColorGradingSettings;
  setColorGrading: (settings: Partial<ColorGradingSettings>) => void;
  resetColorGrading: () => void;

  // Prompt
  prompt: string;
  setPrompt: (p: string) => void;

  // Content parameters
  resolution: Resolution;
  aspectRatio: AspectRatio;
  frameRate: FrameRate;
  setResolution: (r: Resolution) => void;
  setAspectRatio: (a: AspectRatio) => void;
  setFrameRate: (f: FrameRate) => void;

  // Generation state
  generationStatus: GenerationStatus;
  generationProgress: number;
  generationError: string | null;
  startGeneration: () => void;
  setGenerationStatus: (status: GenerationStatus) => void;
  setGenerationProgress: (progress: number) => void;
  setGenerationError: (error: string | null) => void;
  resetGeneration: () => void;
}

const DEFAULT_COLOR_GRADING: ColorGradingSettings = {
  temperature: 0,
  contrast: 0,
  saturation: 0,
  sharpness: 0,
  filmGrain: 0,
  highlights: 0,
  exposure: 0,
};

export const useCinemaStudioStore = create<CinemaStudioState>((set) => ({
  // Version
  version: "3.0",
  setVersion: (version) => set({ version }),

  // Camera
  sensorProfile: "digital_cinema",
  focalLength: 35,
  aperture: 2.8,
  cameraPresetId: null,
  setSensorProfile: (sensorProfile) => set({ sensorProfile }),
  setFocalLength: (focalLength) => set({ focalLength }),
  setAperture: (aperture) => set({ aperture }),
  setCameraPreset: (cameraPresetId) => set({ cameraPresetId }),

  // Motion
  motions: [{ presetId: "dolly-in", speed: "linear" }],
  addMotion: (motion) =>
    set((state) => {
      if (state.motions.length >= 3) return state;
      return { motions: [...state.motions, motion] };
    }),
  removeMotion: (index) =>
    set((state) => ({
      motions: state.motions.filter((_, i) => i !== index),
    })),
  updateMotion: (index, update) =>
    set((state) => ({
      motions: state.motions.map((m, i) =>
        i === index ? { ...m, ...update } : m
      ),
    })),

  // Genre & Speed
  genre: "general",
  speed: "linear",
  setGenre: (genre) => set({ genre }),
  setSpeed: (speed) => set({ speed }),

  // VFX
  selectedEffects: [],
  toggleEffect: (effectId) =>
    set((state) => ({
      selectedEffects: state.selectedEffects.includes(effectId)
        ? state.selectedEffects.filter((id) => id !== effectId)
        : [...state.selectedEffects, effectId],
    })),

  // Color Grading
  colorGrading: DEFAULT_COLOR_GRADING,
  setColorGrading: (settings) =>
    set((state) => ({
      colorGrading: { ...state.colorGrading, ...settings },
    })),
  resetColorGrading: () => set({ colorGrading: DEFAULT_COLOR_GRADING }),

  // Prompt
  prompt: "",
  setPrompt: (prompt) => set({ prompt }),

  // Content parameters
  resolution: "1080p",
  aspectRatio: "16:9",
  frameRate: 24,
  setResolution: (resolution) => set({ resolution }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  setFrameRate: (frameRate) => set({ frameRate }),

  // Generation
  generationStatus: "idle",
  generationProgress: 0,
  generationError: null,
  startGeneration: () =>
    set({
      generationStatus: "pending",
      generationProgress: 0,
      generationError: null,
    }),
  setGenerationStatus: (generationStatus) => set({ generationStatus }),
  setGenerationProgress: (generationProgress) => set({ generationProgress }),
  setGenerationError: (generationError) => set({ generationError }),
  resetGeneration: () =>
    set({
      generationStatus: "idle",
      generationProgress: 0,
      generationError: null,
    }),
}));
