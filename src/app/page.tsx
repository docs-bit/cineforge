"use client";

import {
  AudioLines,
  Check,
  ChevronDown,
  CircleHelp,
  Download,
  Folder,
  Grid2X2,
  Image as ImageIcon,
  Layers3,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Play,
  Plus,
  Redo2,
  Search,
  Scissors,
  Settings2,
  Share2,
  Sparkles,
  Undo2,
  Upload,
  Video,
  WandSparkles,
  X,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";

const railItems = [
  { label: "Projects", icon: Folder },
  { label: "Storyboard", icon: Grid2X2 },
  { label: "Elements", icon: Layers3 },
  { label: "Audio", icon: AudioLines },
];

const shots = [
  { id: "01", title: "The arrival", time: "00:05", gradient: "from-lime-300/75 via-emerald-900/30 to-[#08110d]", position: "center" },
  { id: "02", title: "A familiar face", time: "00:07", gradient: "from-amber-300/75 via-orange-950/40 to-[#160d08]", position: "right" },
  { id: "03", title: "The signal", time: "00:06", gradient: "from-cyan-200/60 via-teal-950/50 to-[#061218]", position: "center" },
  { id: "04", title: "After the rain", time: "00:08", gradient: "from-violet-300/55 via-indigo-950/50 to-[#0b0918]", position: "left" },
];

const cameraPresets = ["Dolly in", "Orbit right", "Slow push", "Static lock"];
const stylePresets = ["Cinematic noir", "Golden hour", "Neo Tokyo", "Dream haze"];
const modelOptions = ["CineForge Motion", "Veo 3.1", "Kling 3.0"];

export default function Home() {
  const [selectedShot, setSelectedShot] = useState("01");
  const [activeRail, setActiveRail] = useState("Storyboard");
  const [activeInspectorTab, setActiveInspectorTab] = useState("Prompt");
  const [selectedCamera, setSelectedCamera] = useState("Dolly in");
  const [selectedStyle, setSelectedStyle] = useState("Cinematic noir");
  const [model, setModel] = useState("CineForge Motion");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [prompt, setPrompt] = useState("A lone woman steps into the empty station as a pulse of green light travels across the ceiling.");
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState("");

  const generateShot = () => {
    setGenerating(true);
    setStatus("Drafting shot 01 · estimating motion and light");
    window.setTimeout(() => {
      setGenerating(false);
      setStatus("Draft ready · synced to storyboard");
    }, 1800);
  };

  return (
    <main className="min-h-screen bg-[#07100b] text-[#f5f7ef] selection:bg-[#b9f33d]/30">
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-40 flex w-[72px] shrink-0 flex-col items-center border-r border-white/[0.08] bg-[#080d0a]/95 py-4 backdrop-blur-xl lg:relative">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b9f33d] text-[12px] font-black tracking-[-0.08em] text-[#101707] shadow-[0_0_28px_rgba(185,243,61,0.2)]" aria-label="CineForge home">CF</button>
          <div className="mt-9 flex flex-col items-center gap-3">
            {railItems.map((item) => {
              const Icon = item.icon;
              const active = activeRail === item.label;
              return <button key={item.label} onClick={() => { setActiveRail(item.label); setStatus(`${item.label} panel selected`); }} className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition ${active ? "bg-[#b9f33d]/15 text-[#caff65]" : "text-white/35 hover:bg-white/[0.06] hover:text-white/80"}`} aria-label={item.label}><Icon size={17} strokeWidth={active ? 2 : 1.6} />{active && <span className="absolute -right-[9px] h-4 w-[2px] rounded-full bg-[#b9f33d] shadow-[0_0_9px_#b9f33d]" />}<span className="pointer-events-none absolute left-12 z-50 hidden whitespace-nowrap rounded-md border border-white/10 bg-[#101811] px-2 py-1 text-[10px] text-white/70 shadow-xl group-hover:block">{item.label}</span></button>;
            })}
          </div>
          <div className="mt-auto flex flex-col items-center gap-3"><button className="flex h-10 w-10 items-center justify-center rounded-xl text-white/35 hover:bg-white/[0.06] hover:text-white/80" aria-label="Help"><CircleHelp size={18} /></button><button className="flex h-10 w-10 items-center justify-center rounded-xl text-white/35 hover:bg-white/[0.06] hover:text-white/80" aria-label="Settings"><Settings2 size={17} /></button><div className="my-1 h-px w-7 bg-white/[0.1]" /><div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-[#a3cc72] to-[#315334] text-[10px] font-bold text-[#07100b]">AR</div></div>
        </aside>

        <section className="ml-[72px] flex min-w-0 flex-1 flex-col lg:ml-0">
          <header className="flex h-[62px] shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#09110c]/90 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex min-w-0 items-center gap-3"><button className="rounded-lg p-2 text-white/45 hover:bg-white/5 hover:text-white lg:hidden" aria-label="Open menu"><Menu size={18} /></button><div className="hidden h-5 w-px bg-white/10 sm:block" /><div className="min-w-0"><div className="flex items-center gap-2 text-[10px] text-white/35"><span>Workspace</span><span>/</span><span className="text-white/70">The Last Signal</span></div><div className="mt-0.5 flex items-center gap-2"><h1 className="truncate text-[13px] font-semibold tracking-[-0.01em]">Cinema Studio</h1><span className="rounded-full border border-[#b9f33d]/25 bg-[#b9f33d]/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-[#caff65]">Beta</span></div></div></div>
            <div className="flex items-center gap-1.5 sm:gap-3"><button className="hidden items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 py-2 text-[10px] text-white/45 hover:bg-white/[0.06] md:flex"><Search size={13} /> Search <kbd className="rounded border border-white/10 px-1 text-[8px] text-white/25">⌘K</kbd></button><button className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white" aria-label="Undo"><Undo2 size={15} /></button><button className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white" aria-label="Redo"><Redo2 size={15} /></button><div className="mx-1 hidden h-5 w-px bg-white/10 sm:block" /><button className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 text-[10px] text-white/65 hover:bg-white/5"><Share2 size={13} /> <span className="hidden sm:inline">Share</span></button><button className="flex items-center gap-1.5 rounded-lg bg-[#b9f33d] px-3 py-2 text-[10px] font-semibold text-[#101707] shadow-[0_0_20px_rgba(185,243,61,0.12)] hover:bg-[#cbff65]"><Download size={13} /> <span className="hidden sm:inline">Export</span></button></div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="relative flex min-h-[570px] flex-1 flex-col overflow-hidden border-b border-white/[0.08] bg-[#0a130d] xl:min-h-[calc(100vh-280px)]">
              <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#7be242]/10 blur-[110px]" /><div className="pointer-events-none absolute right-16 top-1/3 h-96 w-96 rounded-full bg-[#1e8d65]/10 blur-[130px]" />
              <div className="relative z-10 flex items-center justify-between px-4 py-3 text-[10px] sm:px-6"><div className="flex items-center gap-2 text-white/50"><Video size={14} className="text-[#b9f33d]" /><span>Scene 01</span><span className="text-white/20">·</span><span>Shot {selectedShot}</span><span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[8px] text-white/45">Autosaved</span></div><div className="flex items-center gap-2"><button className="rounded-md p-1.5 text-white/35 hover:bg-white/5 hover:text-white" aria-label="More options"><MoreHorizontal size={15} /></button><button onClick={() => setAssistantOpen(!assistantOpen)} className="rounded-md p-1.5 text-white/35 hover:bg-white/5 hover:text-white" aria-label="Toggle inspector">{assistantOpen ? <X size={15} /> : <Settings2 size={15} />}</button></div></div>

              <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-3 sm:px-8"><div className="relative aspect-video w-full max-w-[980px] overflow-hidden rounded-[22px] border border-white/[0.12] bg-[#050906] shadow-[0_22px_80px_rgba(0,0,0,0.45)] film-grain"><div className="absolute inset-0 bg-cover bg-center opacity-85 transition duration-500" style={{ backgroundImage: "url('/cinematic-still.jpg')" }} /><div className="absolute inset-0 bg-[radial-gradient(circle_at_64%_42%,rgba(137,228,86,.24),transparent_26%),linear-gradient(115deg,rgba(4,16,8,.85),transparent_45%,rgba(3,10,7,.25))]" /><div className="absolute inset-0 bg-gradient-to-t from-[#061009] via-transparent to-black/25" /><div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-2.5 py-1.5 text-[8px] uppercase tracking-[0.14em] text-white/60 backdrop-blur-md"><span className="h-1.5 w-1.5 rounded-full bg-[#b9f33d] shadow-[0_0_8px_#b9f33d]" /> Preview · draft 04</div><div className="absolute inset-0 flex items-center justify-center"><button className="flex h-14 w-14 items-center justify-center rounded-full border border-white/35 bg-black/25 text-white backdrop-blur transition hover:scale-105 hover:border-[#b9f33d] hover:bg-[#b9f33d] hover:text-[#101707]" aria-label="Play preview"><Play size={19} fill="currentColor" className="ml-0.5" /></button></div><div className="absolute bottom-5 left-5 right-5 flex items-end justify-between"><div><p className="font-serif text-[20px] text-white/90 sm:text-[27px]">The Last Signal</p><p className="mt-1 max-w-sm text-[10px] leading-relaxed text-white/50">A quiet city holds its breath as the first transmission arrives.</p></div><div className="hidden items-center gap-3 text-[9px] text-white/45 sm:flex"><span>00:18 / 00:42</span><span className="rounded bg-black/35 px-2 py-1">{aspectRatio}</span></div></div></div></div>

              <div className="relative z-20 mx-4 mb-4 rounded-2xl border border-white/[0.13] bg-[#18271b]/90 p-3 shadow-[0_20px_55px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:mx-auto sm:mb-6 sm:w-[min(880px,calc(100%-64px))] sm:p-4"><div className="flex gap-3"><div className="mt-0.5 hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#b9f33d]/15 text-[#caff65] sm:flex"><WandSparkles size={14} /></div><div className="min-w-0 flex-1"><label htmlFor="scene-prompt" className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#b9f33d]">Scene prompt</label><textarea id="scene-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={2} className="mt-1.5 w-full resize-none bg-transparent text-[12px] leading-relaxed text-white/80 outline-none placeholder:text-white/25" placeholder="Describe the next moment..." /></div><button onClick={generateShot} disabled={generating} className="self-end rounded-xl bg-[#b9f33d] px-3.5 py-2.5 text-[10px] font-semibold text-[#101707] shadow-[0_0_20px_rgba(185,243,61,0.15)] transition hover:bg-[#cbff65] disabled:cursor-wait disabled:opacity-60"><span className="flex items-center gap-1.5"><Sparkles size={13} />{generating ? "Creating" : "Generate"}</span></button></div><div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-white/[0.08] pt-3"><button className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1.5 text-[9px] text-white/50 hover:border-white/20 hover:text-white/80"><ImageIcon size={12} /> Add reference</button><button className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1.5 text-[9px] text-white/50 hover:border-white/20 hover:text-white/80"><Upload size={12} /> Upload</button><span className="mx-1 hidden h-4 w-px bg-white/10 sm:block" /><span className="text-[9px] text-white/30">{model}</span><span className="text-white/20">·</span><span className="text-[9px] text-white/30">{selectedCamera}</span>{status && <span className="ml-auto flex items-center gap-1.5 text-[9px] text-[#caff65]"><Check size={11} /> {status}</span>}</div></div>
            </div>

            <div className="relative flex min-h-[320px] shrink-0 flex-col border-b border-white/[0.08] bg-[#09120c] xl:min-h-[290px]"><div className="flex h-11 items-center justify-between border-b border-white/[0.08] px-4 sm:px-6"><div className="flex items-center gap-3"><p className="text-[10px] font-semibold text-white/70">Storyboard</p><span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[8px] text-white/35">4 shots</span><button className="ml-1 flex items-center gap-1 text-[9px] text-[#b9f33d] hover:text-[#d5ff81]"><Plus size={12} /> Add shot</button></div><div className="flex items-center gap-2"><button className="hidden items-center gap-1.5 rounded-md border border-white/10 px-2 py-1.5 text-[9px] text-white/45 hover:bg-white/5 sm:flex"><Scissors size={12} /> Split</button><button className="rounded-md p-1.5 text-white/35 hover:bg-white/5 hover:text-white" aria-label="Zoom timeline"><ZoomIn size={14} /></button><span className="hidden text-[9px] text-white/30 sm:inline">100%</span></div></div><div className="flex min-h-0 flex-1 gap-3 overflow-x-auto px-4 py-4 sm:px-6">{shots.map((shot) => <button key={shot.id} onClick={() => setSelectedShot(shot.id)} className={`group relative flex h-[184px] min-w-[215px] flex-col overflow-hidden rounded-xl border text-left transition sm:min-w-[255px] ${selectedShot === shot.id ? "border-[#b9f33d]/70 bg-[#b9f33d]/[0.08] shadow-[0_0_22px_rgba(185,243,61,0.08)]" : "border-white/[0.1] bg-white/[0.025] hover:border-white/25"}`}><div className={`relative h-[118px] overflow-hidden bg-gradient-to-br ${shot.gradient}`}><div className="absolute inset-0 bg-cover opacity-55 mix-blend-screen" style={{ backgroundImage: "url('/cinematic-still.jpg')", backgroundPosition: shot.position }} /><div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" /><span className="absolute left-3 top-3 text-[9px] font-semibold tracking-[0.14em] text-white/70">{shot.id}</span><span className="absolute bottom-2 right-2 rounded bg-black/45 px-1.5 py-0.5 text-[8px] text-white/60">{shot.time}</span>{selectedShot === shot.id && <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#b9f33d] text-[#101707]"><Check size={12} strokeWidth={3} /></span>}</div><div className="flex flex-1 items-center justify-between px-3"><div><p className="text-[10px] font-medium text-white/80">{shot.title}</p><p className="mt-1 text-[8px] text-white/35">{shot.id === "01" ? "Wide establishing shot" : shot.id === "02" ? "Slow dolly in" : shot.id === "03" ? "Orbit right + tilt up" : "Rain on glass"}</p></div><MoreHorizontal size={14} className="text-white/30" /></div></button>)}<button className="flex h-[184px] min-w-[150px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.13] text-[9px] text-white/30 transition hover:border-[#b9f33d]/40 hover:bg-[#b9f33d]/[0.04] hover:text-[#b9f33d]"><Plus size={17} /> Add shot</button></div><div className="flex items-center gap-3 border-t border-white/[0.07] px-4 py-2 text-[9px] text-white/30 sm:px-6"><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#b9f33d]" /> Scene 01</span><span>00:00</span><span className="text-white/15">—</span><span>00:42</span><span className="ml-auto flex items-center gap-1.5"><Music2 size={12} /> Score / ambient</span></div></div>
          </div>
        </section>

        {assistantOpen && <aside className="fixed inset-y-0 right-0 z-30 flex w-[min(350px,calc(100vw-72px))] flex-col border-l border-white/[0.09] bg-[#0c1710]/[0.98] shadow-[-20px_0_80px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:relative lg:inset-auto lg:z-10 lg:w-[350px] lg:shadow-none"><div className="flex h-[62px] shrink-0 items-center justify-between border-b border-white/[0.08] px-5"><div><p className="text-[9px] uppercase tracking-[0.16em] text-[#b9f33d]">AI assistant</p><h2 className="mt-1 text-[13px] font-semibold text-white/85">Direct the moment</h2></div><button onClick={() => setAssistantOpen(false)} className="rounded-lg p-1.5 text-white/35 hover:bg-white/5 hover:text-white lg:hidden" aria-label="Close assistant"><X size={15} /></button></div><div className="flex border-b border-white/[0.08] px-4 pt-3">{["Prompt", "Style", "Elements"].map((tab) => <button key={tab} onClick={() => setActiveInspectorTab(tab)} className={`relative px-3 pb-3 text-[10px] transition ${activeInspectorTab === tab ? "text-[#caff65]" : "text-white/35 hover:text-white/70"}`}>{tab}{activeInspectorTab === tab && <span className="absolute bottom-0 left-3 right-3 h-px bg-[#b9f33d]" />}</button>)}</div><div className="min-h-0 flex-1 overflow-y-auto px-5 py-5"><div className="rounded-2xl border border-white/[0.09] bg-white/[0.035] p-4"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold text-white/75">{activeInspectorTab === "Prompt" ? "Prompt direction" : activeInspectorTab === "Style" ? "Visual language" : "Scene elements"}</p><MessageCircle size={14} className="text-[#b9f33d]" /></div><p className="mt-2 text-[10px] leading-relaxed text-white/38">{activeInspectorTab === "Prompt" ? "Describe what should happen in the next frame. CineForge will preserve character, light, and spatial continuity." : activeInspectorTab === "Style" ? "Choose a visual treatment and pair it with the camera movement to set the mood." : "Reuse characters, locations, props, and reference frames across the sequence."}</p>{activeInspectorTab === "Prompt" && <div className="mt-4 space-y-2"><label className="text-[9px] uppercase tracking-[0.13em] text-white/35">Model</label><button onClick={() => setModel(modelOptions[(modelOptions.indexOf(model) + 1) % modelOptions.length])} className="flex w-full items-center justify-between rounded-lg border border-white/[0.1] bg-black/10 px-3 py-2.5 text-[10px] text-white/65 hover:border-[#b9f33d]/35"><span>{model}</span><ChevronDown size={14} className="text-white/35" /></button></div>}</div>

              <div className="mt-5"><div className="flex items-center justify-between"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35">Camera movement</p><button className="text-[9px] text-white/30 hover:text-white/65">Reset</button></div><div className="mt-2 grid grid-cols-2 gap-2">{cameraPresets.map((preset) => <button key={preset} onClick={() => setSelectedCamera(preset)} className={`rounded-lg border px-2.5 py-2.5 text-left text-[10px] transition ${selectedCamera === preset ? "border-[#b9f33d]/45 bg-[#b9f33d]/10 text-[#caff65]" : "border-white/[0.08] bg-white/[0.02] text-white/45 hover:border-white/20 hover:text-white/75"}`}><span className="block h-1 w-4 rounded-full bg-current opacity-60" /><span className="mt-2 block">{preset}</span></button>)}</div></div>

              <div className="mt-6"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35">Look & tone</p><div className="mt-2 flex flex-wrap gap-1.5">{stylePresets.map((preset) => <button key={preset} onClick={() => setSelectedStyle(preset)} className={`rounded-full border px-2.5 py-1.5 text-[9px] transition ${selectedStyle === preset ? "border-[#b9f33d]/45 bg-[#b9f33d]/10 text-[#caff65]" : "border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70"}`}>{preset}</button>)}</div></div>

              <div className="mt-6"><div className="flex items-center justify-between"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35">Output</p><span className="text-[9px] text-[#b9f33d]">Social-ready</span></div><div className="mt-2 grid grid-cols-3 gap-2">{["16:9", "9:16", "1:1"].map((ratio) => <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`rounded-lg border py-2.5 text-[10px] transition ${aspectRatio === ratio ? "border-[#b9f33d]/45 bg-[#b9f33d]/10 text-[#caff65]" : "border-white/[0.08] text-white/40 hover:border-white/20"}`}>{ratio}</button>)}</div></div>

              <div className="mt-6 rounded-xl border border-dashed border-white/[0.13] p-3"><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-white/40"><ImageIcon size={14} /></div><div><p className="text-[10px] text-white/65">Reference frames</p><p className="mt-0.5 text-[8px] text-white/30">Keep faces and scenes consistent</p></div><button className="ml-auto rounded-md p-1.5 text-white/35 hover:bg-white/5 hover:text-white"><Plus size={14} /></button></div><div className="mt-3 flex gap-2"><div className="relative h-12 w-16 overflow-hidden rounded-md border border-[#b9f33d]/35 bg-gradient-to-br from-green-300/50 to-slate-900"><div className="absolute inset-0 bg-cover opacity-70" style={{ backgroundImage: "url('/cinematic-still.jpg')" }} /></div><div className="flex h-12 w-16 items-center justify-center rounded-md border border-dashed border-white/15 text-white/25"><Plus size={14} /></div></div></div>
            </div><div className="border-t border-white/[0.08] p-5"><div className="flex items-center justify-between text-[9px] text-white/35"><span>Estimated cost</span><span className="text-white/70">24 credits</span></div><button onClick={generateShot} disabled={generating} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b9f33d] py-3 text-[10px] font-semibold text-[#101707] shadow-[0_0_25px_rgba(185,243,61,0.13)] transition hover:bg-[#cbff65] disabled:cursor-wait disabled:opacity-60"><Sparkles size={13} /> {generating ? "Creating draft..." : "Create shot"}</button></div></aside>}
      </div>
    </main>
  );
}
