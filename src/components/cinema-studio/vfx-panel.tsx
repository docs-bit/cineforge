"use client";

import { cn } from "@/lib/utils";
import { useCinemaStudioStore } from "@/stores/cinema-studio-store";
import { VFX_EFFECTS, VFX_CATEGORIES } from "@/constants/vfx-effects";
import { useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";

export function VFXPanel() {
  const { selectedEffects, toggleEffect } = useCinemaStudioStore();
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>("particles");
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = VFX_EFFECTS.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = VFX_CATEGORIES.map((cat) => ({
    ...cat,
    effects: filtered.filter((e) => e.category === cat.id),
  })).filter((g) => g.effects.length > 0);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          VFX Effects
        </h3>
        {selectedEffects.length > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-gold tabular-nums">
            {selectedEffects.length} active
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search effects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md bg-surface pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
          aria-label="Search VFX effects"
        />
      </div>

      {/* Active effects quick-clear */}
      {selectedEffects.length > 0 && (
        <button
          onClick={() => {
            if (confirmClear) {
              selectedEffects.forEach((id) => toggleEffect(id));
              setConfirmClear(false);
            } else {
              setConfirmClear(true);
            }
          }}
          onBlur={() => setConfirmClear(false)}
          className="flex items-center gap-1 text-[10px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          style={{
            color: confirmClear
              ? "var(--color-destructive)"
              : "var(--color-muted-foreground)",
          }}
          aria-label={
            confirmClear
              ? "Confirm clear all selected effects"
              : "Clear all selected effects"
          }
        >
          <X className="h-3 w-3" aria-hidden="true" />
          {confirmClear ? "Click again to confirm" : "Clear all"}
        </button>
      )}

      {/* Grouped effects */}
      <div className="max-h-56 space-y-0.5 overflow-y-auto pr-1">
        {grouped.map((group) => {
          const activeInGroup = group.effects.filter((e) =>
            selectedEffects.includes(e.id)
          ).length;

          return (
            <div key={group.id}>
              <button
                onClick={() =>
                  setOpenCategory(openCategory === group.id ? null : group.id)
                }
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                  "hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                  openCategory === group.id
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                aria-expanded={openCategory === group.id}
              >
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true">{group.icon}</span>
                  {group.label}
                  {activeInGroup > 0 && (
                    <span className="rounded-full bg-gold/20 px-1.5 py-0.5 text-[9px] text-gold">
                      {activeInGroup}
                    </span>
                  )}
                </span>
                {openCategory === group.id ? (
                  <ChevronUp className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-3 w-3" aria-hidden="true" />
                )}
              </button>
              {openCategory === group.id && (
                <div className="ml-2 flex flex-wrap gap-1 pb-1.5">
                  {group.effects.map((effect) => {
                    const isActive = selectedEffects.includes(effect.id);
                    return (
                      <button
                        key={effect.id}
                        onClick={() => toggleEffect(effect.id)}
                        className={cn(
                          "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                          isActive
                            ? "bg-gold/15 text-gold ring-1 ring-gold/30"
                            : "bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                        )}
                        aria-pressed={isActive}
                        title={effect.description}
                      >
                        {effect.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
