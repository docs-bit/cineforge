"use client";

import { useState } from "react";
import { apiPost, apiPut, getAccessToken } from "@/lib/api";
import { useCanvasStore } from "@/stores/canvas-store";
import { Check, Cloud, Save, Trash2 } from "lucide-react";

const CANVAS_ID_KEY = "cineforge.canvas_id";

type CanvasRecord = { id: string };

export function CanvasToolbar() {
  const { nodes, edges, viewport, clearCanvas } = useCanvasStore();
  const [canvasId, setCanvasId] = useState<string | null>(() => typeof window === "undefined" ? null : window.localStorage.getItem(CANVAS_ID_KEY));
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const payload = { name: "Main workflow", nodes, edges, viewport };
    if (process.env.NEXT_PUBLIC_API_URL && getAccessToken()) {
      try {
        const record = canvasId ? await apiPut<CanvasRecord>(`/api/v1/canvases/${canvasId}`, payload) : await apiPost<CanvasRecord>("/api/v1/canvases", payload);
        if (!canvasId) { setCanvasId(record.id); window.localStorage.setItem(CANVAS_ID_KEY, record.id); }
        setMessage("Saved to workspace");
      } catch { setMessage("Unable to save to workspace"); }
    } else {
      const data = { ...payload, savedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = "canvas-workflow.json"; anchor.click(); URL.revokeObjectURL(url);
      setMessage("Workflow JSON exported");
    }
    setSaving(false);
    window.setTimeout(() => setMessage(""), 3000);
  };

  return <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-2"><div className="flex items-center gap-3"><h1 className="text-sm font-semibold text-foreground">Canvas</h1><span className="text-[10px] text-muted-foreground">{nodes.length} nodes · {edges.length} edges</span>{message && <span className={`flex items-center gap-1 text-[10px] ${message.includes("Unable") ? "text-red-300" : "text-emerald-300"}`}>{message.includes("Unable") ? <Cloud size={12} /> : <Check size={12} />}{message}</span>}</div><div className="flex items-center gap-1"><button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-50" aria-label="Save canvas as JSON"><Save className="h-3.5 w-3.5" />{saving ? "Saving…" : "Save"}</button><button onClick={() => { if (confirm("Clear entire canvas?")) clearCanvas(); }} className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label="Clear canvas"><Trash2 className="h-3.5 w-3.5" />Clear</button></div></header>;
}
