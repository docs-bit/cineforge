"use client";

import { cn } from "@/lib/utils";
import { useCinemaStudioStore } from "@/stores/cinema-studio-store";
import { CINEMA_VERSIONS, VERSION_LABELS } from "@/types/cinema-studio";
import { Lock } from "lucide-react";

const VERSION_MIN: Record<string, number> = {
  "2.0": 0,
  "2.5": 1,
  "3.0": 2,
  "3.5": 3,
};

export function VersionSelector() {
  const { version, setVersion } = useCinemaStudioStore();

  return (
    <div
      role="tablist"
      aria-label="Cinema Studio version"
      className="flex gap-1 rounded-lg bg-background p-1"
    >
      {CINEMA_VERSIONS.map((v) => {
        const isActive = version === v;
        const currentIdx = VERSION_MIN[version] ?? 2;
        const vIdx = VERSION_MIN[v] ?? 0;
        const isLocked = vIdx > currentIdx && !isActive;

        return (
          <button
            key={v}
            role="tab"
            aria-selected={isActive}
            aria-label={`Version ${v}: ${VERSION_LABELS[v]}`}
            title={isLocked ? `${VERSION_LABELS[v]} — Upgrade to unlock` : VERSION_LABELS[v]}
            disabled={isLocked}
            onClick={() => setVersion(v)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              isActive
                ? "bg-gold text-black shadow-sm"
                : isLocked
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-muted-foreground hover:bg-surface hover:text-foreground"
            )}
          >
            {isLocked && <Lock className="h-3 w-3" aria-hidden="true" />}
            <span>v{v}</span>
          </button>
        );
      })}
    </div>
  );
}
