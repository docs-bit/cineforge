"use client";

import { cn } from "@/lib/utils";
import { useCinemaStudioStore } from "@/stores/cinema-studio-store";
import { Play, Pause, SkipForward, Maximize2, Camera, AlertCircle, RotateCcw } from "lucide-react";

export function PreviewViewport() {
  const generation = useCinemaStudioStore((s) => s.generation);
  const resolution = useCinemaStudioStore((s) => s.output.resolution);
  const aspectRatio = useCinemaStudioStore((s) => s.output.aspectRatio);
  const resetGeneration = useCinemaStudioStore((s) => s.resetGeneration);

  const { status: generationStatus, progress: generationProgress, error: generationError, resultUrls: generationResultUrls } = generation;

  const isGenerating =
    generationStatus === "pending" || generationStatus === "processing";
  const isComplete = generationStatus === "completed";
  const isFailed = generationStatus === "failed";
  const hasResults = generationResultUrls.length > 0;

  const aspectClass =
    aspectRatio === "16:9"
      ? "aspect-video"
      : aspectRatio === "9:16"
        ? "aspect-[9/16] max-h-[60vh]"
        : aspectRatio === "1:1"
          ? "aspect-square"
          : aspectRatio === "3:4"
            ? "aspect-[3/4] max-h-[60vh]"
            : aspectRatio === "2:3"
              ? "aspect-[2/3] max-h-[60vh]"
              : "aspect-[3/2]";

  const firstUrl = hasResults ? generationResultUrls[0] : null;
  const isVideo = firstUrl && /\.(mp4|webm|mov)$/i.test(firstUrl);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div
        className={cn(
          "relative flex w-full max-w-3xl items-center justify-center overflow-hidden rounded-xl border border-border bg-viewport film-grain vignette",
          aspectClass
        )}
        role="img"
        aria-label={`Preview viewport — ${resolution} ${aspectRatio}`}
      >
        {/* Idle state — viewfinder */}
        {generationStatus === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-gold/40" aria-hidden="true" />
            <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-gold/40" aria-hidden="true" />
            <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-gold/40" aria-hidden="true" />
            <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-gold/40" aria-hidden="true" />
            <div className="relative">
              <Camera className="h-12 w-12 text-gold/30" aria-hidden="true" />
              <div className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 bg-gold/20" aria-hidden="true" />
              <div className="absolute left-1/2 top-1/2 h-8 w-px -translate-x-1/2 -translate-y-1/2 bg-gold/20" aria-hidden="true" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground/60">
                Configure settings & generate a scene
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground/30">
                {resolution} &bull; {aspectRatio}
              </p>
            </div>
          </div>
        )}

        {/* Generation progress */}
        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface/80 backdrop-blur-sm">
            <div className="relative h-16 w-16">
              <svg
                className="h-full w-full animate-spin"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-surface"
                />
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-gold"
                  strokeDasharray="176"
                  strokeDashoffset={176 - (176 * generationProgress) / 100}
                  strokeLinecap="round"
                  style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-mono text-gold tabular-nums">
                {Math.round(generationProgress)}%
              </span>
            </div>
            <p className="text-sm text-foreground/80">
              {generationStatus === "pending"
                ? "Queuing generation..."
                : "Generating scene..."}
            </p>
          </div>
        )}

        {/* Completed state — show result */}
        {isComplete && hasResults && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface">
            {isVideo ? (
              <video
                src={firstUrl!}
                controls
                autoPlay
                loop
                className="max-h-full max-w-full object-contain"
                aria-label="Generated video"
              />
            ) : (
              <img
                src={firstUrl!}
                alt="Generated image"
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
        )}

        {/* Completed state — no results */}
        {isComplete && !hasResults && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface gap-3">
            <p className="text-sm text-gold">Generation complete</p>
            <p className="text-xs text-muted-foreground">
              No media returned — check backend output configuration
            </p>
          </div>
        )}

        {/* Failed state */}
        {isFailed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface gap-3">
            <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
            <p className="text-sm text-destructive font-medium">Generation failed</p>
            <p className="text-xs text-muted-foreground text-center max-w-xs px-4">
              {generationError || "Unknown error occurred"}
            </p>
            <button
              onClick={resetGeneration}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label="Try again"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Try again
            </button>
          </div>
        )}

        {/* REC indicator */}
        {(isGenerating || isComplete) && (
          <div
            className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px]"
            role="status"
            aria-live="polite"
          >
            {isGenerating && (
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
            )}
            <span className={isGenerating ? "text-red-400" : "text-green-400"}>
              {isGenerating ? "REC" : "DONE"}
            </span>
          </div>
        )}
      </div>

      {/* Playback controls (visible when complete with results) */}
      {isComplete && hasResults && (
        <div className="mt-3 flex items-center gap-2" role="group" aria-label="Playback controls">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-black transition-colors hover:bg-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="Play"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="Pause"
          >
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="Skip forward"
          >
            <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <div className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
