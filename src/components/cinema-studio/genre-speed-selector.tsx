"use client";

import { cn } from "@/lib/utils";
import { useCinemaStudioStore } from "@/stores/cinema-studio-store";
import { GENRES, SPEED_VARIATIONS } from "@/constants/genres";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function GenreSelector() {
  const genre = useCinemaStudioStore((s) => s.style.genre);
  const updateStyle = useCinemaStudioStore((s) => s.updateStyle);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Genre
      </h3>
      <div className="grid grid-cols-4 gap-1.5">
        {GENRES.map((g) => (
          <button
            key={g.id}
            onClick={() => updateStyle({ genre: g.id })}
            className={cn(
              "flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              genre === g.id
                ? "bg-gold/15 text-gold ring-1 ring-gold/30"
                : "bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            )}
            aria-pressed={genre === g.id}
          >
            <span className="text-base" aria-hidden="true">
              {g.icon}
            </span>
            <span className="font-medium">{g.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SpeedSelector() {
  const speed = useCinemaStudioStore((s) => s.style.speed);
  const updateStyle = useCinemaStudioStore((s) => s.updateStyle);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Speed Variation
      </h3>
      <div className="grid grid-cols-2 gap-1.5">
        {SPEED_VARIATIONS.map((s) => (
          <Tooltip key={s.id}>
            <TooltipTrigger>
              <button
                onClick={() => updateStyle({ speed: s.id })}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-medium text-left transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                  speed === s.id
                    ? "bg-gold/15 text-gold"
                    : "bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                )}
                aria-pressed={speed === s.id}
              >
                {s.label}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-48">
              <p>{s.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

export function GenreSpeedSelector() {
  return (
    <div className="space-y-5">
      <GenreSelector />
      <SpeedSelector />
    </div>
  );
}
