"use client";

import { useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCinemaStudioStore } from "@/stores/cinema-studio-store";
import { Sparkles, ImagePlus, Loader2 } from "lucide-react";

export function PromptInput() {
  const {
    prompt,
    setPrompt,
    startGeneration,
    generationStatus,
    resolution,
    aspectRatio,
    frameRate,
  } = useCinemaStudioStore();

  const isGenerating =
    generationStatus === "pending" || generationStatus === "processing";

  const canGenerate = prompt.trim().length > 0 && !isGenerating;

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return;
    startGeneration();
  }, [canGenerate, startGeneration]);

  // Web Interface Guidelines: keyboard handler for generate
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleGenerate]);

  return (
    <div className="border-t border-border bg-surface p-4">
      {/* Settings summary */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground/50">
        <span className="rounded bg-surface-hover px-1.5 py-0.5">
          {resolution}
        </span>
        <span className="rounded bg-surface-hover px-1.5 py-0.5">
          {aspectRatio}
        </span>
        <span className="rounded bg-surface-hover px-1.5 py-0.5">
          {frameRate}fps
        </span>
        <span className="ml-auto text-muted-foreground/30">
          ⌘+Enter to generate
        </span>
      </div>

      <div className="flex gap-2">
        {/* Reference image upload */}
        <button
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-gold/30 hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          aria-label="Upload reference image"
        >
          <ImagePlus className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Textarea */}
        <div className="relative flex-1">
          <label htmlFor="scene-prompt" className="sr-only">
            Describe your scene
          </label>
          <textarea
            id="scene-prompt"
            placeholder="Describe your scene in detail…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            className={cn(
              "w-full resize-none rounded-lg bg-background px-4 py-2.5 text-sm text-foreground",
              "placeholder:text-muted-foreground/40",
              "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            aria-describedby="prompt-hint"
          />
          {prompt.length > 0 && (
            <span
              className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/30 tabular-nums"
              aria-hidden="true"
            >
              {prompt.length}
            </span>
          )}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className={cn(
            "flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
            canGenerate
              ? "bg-gold text-black hover:bg-gold-hover gold-glow"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
          aria-label={
            isGenerating ? "Generating scene…" : "Generate scene"
          }
          aria-busy={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">
            {isGenerating ? "Generating…" : "Generate"}
          </span>
        </button>
      </div>

      <p id="prompt-hint" className="sr-only">
        Press Command+Enter or Control+Enter to generate
      </p>
    </div>
  );
}
