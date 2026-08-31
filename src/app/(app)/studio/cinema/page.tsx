"use client";

import { ArrowLeft, Save, Download } from "lucide-react";
import Link from "next/link";
import { VersionSelector } from "@/components/cinema-studio/version-selector";
import { ControlsPanel } from "@/components/cinema-studio/controls-panel";
import { PreviewViewport } from "@/components/cinema-studio/preview-viewport";
import { PromptInput } from "@/components/cinema-studio/prompt-input";

export default function CinemaStudioPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <h1 className="heading-display text-lg text-foreground">
            Cinema Studio
          </h1>
          <VersionSelector />
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="Save project"
          >
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            className="flex items-center gap-1.5 rounded-md bg-gold px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="Export project"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Controls Panel */}
        <aside
          className="w-80 shrink-0 border-r border-border bg-surface lg:w-72 xl:w-80"
          aria-label="Cinema Studio controls"
        >
          <ControlsPanel />
        </aside>

        {/* Center: Viewport + Prompt */}
        <main
          id="main-content"
          className="flex flex-1 flex-col min-w-0"
        >
          <PreviewViewport />
          <PromptInput />
        </main>
      </div>
    </div>
  );
}
