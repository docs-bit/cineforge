import type { VFXEffect, VFXCategory } from "@/types/cinema-studio";

export const VFX_EFFECTS: VFXEffect[] = [
  // ─── Particles ─────────────────────────────────
  { id: "sparks", name: "Sparks", category: "particles", description: "Fiery spark particles" },
  { id: "smoke", name: "Smoke", category: "particles", description: "Wispy smoke trails" },
  { id: "snowflakes", name: "Snowflakes", category: "particles", description: "Falling snow particles" },
  { id: "rain", name: "Rain", category: "particles", description: "Realistic rain droplets" },
  { id: "dust", name: "Dust Motes", category: "particles", description: "Floating dust particles" },
  { id: "embers", name: "Embers", category: "particles", description: "Rising fire embers" },

  // ─── Lighting ──────────────────────────────────
  { id: "lens-flare", name: "Lens Flare", category: "lighting", description: "Cinematic lens flare" },
  { id: "glow", name: "Glow", category: "lighting", description: "Soft diffused glow" },
  { id: "flash", name: "Flash", category: "lighting", description: "Bright flash burst" },
  { id: "god-rays", name: "God Rays", category: "lighting", description: "Volumetric light shafts" },
  { id: "neon-glow", name: "Neon Glow", category: "lighting", description: "Neon-colored light bloom" },

  // ─── Transitions ───────────────────────────────
  { id: "dissolve", name: "Dissolve", category: "transitions", description: "Smooth cross-dissolve" },
  { id: "wipe", name: "Wipe", category: "transitions", description: "Directional wipe transition" },
  { id: "fade-in", name: "Fade In", category: "transitions", description: "Fade from black" },
  { id: "fade-out", name: "Fade Out", category: "transitions", description: "Fade to black" },

  // ─── Stylization ───────────────────────────────
  { id: "black-and-white", name: "Black & White", category: "stylization", description: "Monochrome look" },
  { id: "vintage", name: "Vintage", category: "stylization", description: "Aged film aesthetic" },
  { id: "neon", name: "Neon", category: "stylization", description: "Vibrant neon color grade" },
  { id: "cinematic-bars", name: "Cinematic Bars", category: "stylization", description: "Letterbox black bars" },

  // ─── Text ──────────────────────────────────────
  { id: "title-card", name: "Title Card", category: "text", description: "Animated title overlay" },
  { id: "lower-third", name: "Lower Third", category: "text", description: "Name/title lower third graphic" },

  // ─── Motion ────────────────────────────────────
  { id: "motion-blur", name: "Motion Blur", category: "motion", description: "Directional motion blur" },
  { id: "slow-mo-overlay", name: "Slow-Mo Overlay", category: "motion", description: "Enhanced slow-motion look" },
  { id: "speed-ramp-vfx", name: "Speed Ramp", category: "motion", description: "Dynamic speed change effect" },
];

export const VFX_CATEGORIES: {
  id: VFXCategory;
  label: string;
  icon: string;
}[] = [
  { id: "particles", label: "Particles", icon: "✨" },
  { id: "lighting", label: "Lighting", icon: "💡" },
  { id: "transitions", label: "Transitions", icon: "🔀" },
  { id: "stylization", label: "Stylization", icon: "🎨" },
  { id: "text", label: "Text", icon: "📝" },
  { id: "motion", label: "Motion", icon: "💨" },
];
