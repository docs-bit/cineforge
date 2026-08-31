import type { CameraPreset, PresetCategory } from "@/types/cinema-studio";

export const CAMERA_PRESETS: CameraPreset[] = [
  // ─── Dolly ─────────────────────────────────────
  { id: "dolly-in", name: "Dolly In", category: "dolly", description: "Push toward subject on tracks" },
  { id: "dolly-out", name: "Dolly Out", category: "dolly", description: "Pull away from subject on tracks" },
  { id: "dolly-zoom", name: "Dolly Zoom (Vertigo)", category: "dolly", description: "Dolly in while zooming out — disorienting effect" },
  { id: "dolly-left", name: "Dolly Left", category: "dolly", description: "Track left alongside subject" },
  { id: "dolly-right", name: "Dolly Right", category: "dolly", description: "Track right alongside subject" },
  { id: "dolly-diagonal-in", name: "Dolly Diagonal In", category: "dolly", description: "Push in at a 45° angle" },
  { id: "dolly-diagonal-out", name: "Dolly Diagonal Out", category: "dolly", description: "Pull away at a 45° angle" },
  { id: "dolly-lateral", name: "Dolly Lateral", category: "dolly", description: "Side-to-side tracking movement" },

  // ─── Pan ───────────────────────────────────────
  { id: "pan-left", name: "Pan Left", category: "pan", description: "Rotate camera left from a fixed point" },
  { id: "pan-right", name: "Pan Right", category: "pan", description: "Rotate camera right from a fixed point" },
  { id: "whip-pan-left", name: "Whip Pan Left", category: "pan", description: "Fast snap pan left — transitional blur" },
  { id: "whip-pan-right", name: "Whip Pan Right", category: "pan", description: "Fast snap pan right — transitional blur" },
  { id: "pan-180", name: "Pan 180°", category: "pan", description: "Half-circle rotation revealing the full scene" },
  { id: "pan-follow", name: "Pan Follow", category: "pan", description: "Smoothly track a moving subject" },
  { id: "pan-reveal", name: "Pan Reveal", category: "pan", description: "Slow pan to unveil a subject or setting" },

  // ─── Tilt ──────────────────────────────────────
  { id: "tilt-up", name: "Tilt Up", category: "tilt", description: "Angle camera upward — environment reveal" },
  { id: "tilt-down", name: "Tilt Down", category: "tilt", description: "Angle camera downward — subject focus" },
  { id: "tilt-up-reveal", name: "Tilt Up Reveal", category: "tilt", description: "Slow upward tilt to reveal a tall subject" },
  { id: "tilt-down-chase", name: "Tilt Down Chase", category: "tilt", description: "Follow a falling or descending subject" },
  { id: "dutch-tilt-left", name: "Dutch Tilt Left", category: "tilt", description: "Roll camera left for tension" },
  { id: "dutch-tilt-right", name: "Dutch Tilt Right", category: "tilt", description: "Roll camera right for unease" },

  // ─── Orbit ─────────────────────────────────────
  { id: "orbit-left", name: "Orbit Left", category: "orbit", description: "Arc around subject counter-clockwise" },
  { id: "orbit-right", name: "Orbit Right", category: "orbit", description: "Arc around subject clockwise" },
  { id: "orbit-360", name: "Orbit 360°", category: "orbit", description: "Full rotation around subject" },
  { id: "orbit-180", name: "Orbit 180°", category: "orbit", description: "Half-circle orbit for dramatic reveal" },
  { id: "orbit-close", name: "Orbit Close", category: "orbit", description: "Tight orbit emphasizing detail" },
  { id: "orbit-wide", name: "Orbit Wide", category: "orbit", description: "Wide orbit showing full environment" },
  { id: "orbit-high", name: "Orbit High", category: "orbit", description: "Elevated arc looking down at subject" },
  { id: "orbit-low", name: "Orbit Low", category: "orbit", description: "Low-angle arc for heroic framing" },

  // ─── Zoom ──────────────────────────────────────
  { id: "zoom-in", name: "Zoom In", category: "zoom", description: "Narrow field of view toward subject" },
  { id: "zoom-out", name: "Zoom Out", category: "zoom", description: "Widen field of view for context" },
  { id: "crash-zoom-in", name: "Crash Zoom In", category: "zoom", description: "Rapid zoom for dramatic impact" },
  { id: "crash-zoom-out", name: "Crash Zoom Out", category: "zoom", description: "Rapid pull-back for shock reveals" },
  { id: "slow-zoom-in", name: "Slow Zoom In", category: "zoom", description: "Gradual tightening for tension" },
  { id: "slow-zoom-out", name: "Slow Zoom Out", category: "zoom", description: "Gradual widening for scale" },
  { id: "snap-zoom", name: "Snap Zoom", category: "zoom", description: "Instant jump to new focal length" },
  { id: "zoom-dolly-combo", name: "Zoom + Dolly Combo", category: "zoom", description: "Combined zoom and dolly for Vertigo effect" },

  // ─── Crane ─────────────────────────────────────
  { id: "crane-up", name: "Crane Up", category: "crane", description: "Elevate camera for epic openings" },
  { id: "crane-down", name: "Crane Down", category: "crane", description: "Descend into the scene for intimacy" },
  { id: "crane-overhead", name: "Crane Overhead", category: "crane", description: "Rise to a bird's-eye view" },
  { id: "crane-descend-reveal", name: "Crane Descend Reveal", category: "crane", description: "Drop from sky to reveal subject" },
  { id: "crane-sweep", name: "Crane Sweep", category: "crane", description: "Broad arc through the environment" },
  { id: "crane-rise-epic", name: "Crane Rise Epic", category: "crane", description: "Dramatic rise for grand introductions" },
  { id: "crane-plunge", name: "Crane Plunge", category: "crane", description: "Rapid descent into action" },

  // ─── Steadicam ─────────────────────────────────
  { id: "steadicam-follow", name: "Steadicam Follow", category: "steadicam", description: "Smooth tracking behind subject" },
  { id: "steadicam-lead", name: "Steadicam Lead", category: "steadicam", description: "Smooth tracking ahead of subject" },
  { id: "steadicam-wander", name: "Steadicam Wander", category: "steadicam", description: "Exploratory movement through space" },
  { id: "steadicam-chase", name: "Steadicam Chase", category: "steadicam", description: "Dynamic pursuit tracking" },
  { id: "steadicam-circling", name: "Steadicam Circling", category: "steadicam", description: "Orbital movement around subject" },
  { id: "steadicam-corridor", name: "Steadicam Corridor", category: "steadicam", description: "Long-take movement through corridors" },
  { id: "steadicam-intimate", name: "Steadicam Intimate", category: "steadicam", description: "Close, personal following shot" },

  // ─── Static ────────────────────────────────────
  { id: "static", name: "Static", category: "static", description: "Locked-off tripod shot" },
  { id: "locked-off", name: "Locked Off", category: "static", description: "Completely rigid, unmoving frame" },
  { id: "static-wobble", name: "Static Wobble", category: "static", description: "Subtle handheld-style micro-movement" },
  { id: "static-breathing", name: "Static Breathing", category: "static", description: "Gentle in-out micro-zoom" },
];

// ─── Category metadata ───────────────────────────────────────────────
export const PRESET_CATEGORIES: {
  id: PresetCategory;
  label: string;
  icon: string;
}[] = [
  { id: "dolly", label: "Dolly", icon: "🚂" },
  { id: "pan", label: "Pan", icon: "↔️" },
  { id: "tilt", label: "Tilt", icon: "↕️" },
  { id: "orbit", label: "Orbit", icon: "🔄" },
  { id: "zoom", label: "Zoom", icon: "🔍" },
  { id: "crane", label: "Crane", icon: "🏗️" },
  { id: "steadicam", label: "Steadicam", icon: "🎥" },
  { id: "static", label: "Static", icon: "📐" },
];
