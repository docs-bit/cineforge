"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, CheckCircle2, Clock3, Film, FolderPlus, ImagePlus, Layers3, MoreHorizontal, Plus, Sparkles, UserRound, Video, Workflow, X, Zap } from "lucide-react";
import { apiGet, apiPost, getAccessToken } from "@/lib/api";
import { enqueueJob, FoundationProject, GenerationJob, getJobs, getProjects, getSession, normalizeJob, normalizeProject, saveProjects, WorkspaceSession } from "@/lib/foundation";

const quickActions = [
  { title: "Cinema Studio", description: "Direct cinematic shots with camera control.", href: "/studio/cinema", icon: Film, tone: "lime" },
  { title: "Canvas", description: "Build a multi-model visual workflow.", href: "/canvas", icon: Workflow, tone: "violet" },
  { title: "Soul ID", description: "Create reusable character identities.", href: "/soul-id", icon: UserRound, tone: "cyan" },
  { title: "Marketing Studio", description: "Turn a product into social-ready ads.", href: "/studio/marketing", icon: Sparkles, tone: "orange" },
];

const toneClasses: Record<string, string> = { lime: "bg-gold/15 text-gold", violet: "bg-violet-400/15 text-violet-300", cyan: "bg-cyan-400/15 text-cyan-300", orange: "bg-orange-400/15 text-orange-300" };

function StatusPill({ status }: { status: FoundationProject["status"] }) {
  const labels = { draft: "Draft", generating: "Generating", ready: "Ready", archived: "Archived" };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] ${status === "generating" ? "bg-gold/10 text-gold" : status === "ready" ? "bg-emerald-400/10 text-emerald-300" : "bg-white/[0.06] text-white/45"}`}><span className={`h-1.5 w-1.5 rounded-full ${status === "generating" ? "bg-gold" : status === "ready" ? "bg-emerald-400" : "bg-white/30"}`} />{labels[status]}</span>;
}

function JobStatus({ status }: { status: GenerationJob["status"] }) {
  const labels = { queued: "Queued", processing: "Processing", completed: "Completed", failed: "Failed", cancelled: "Cancelled" };
  return <span className={`text-[10px] ${status === "completed" ? "text-emerald-300" : status === "failed" ? "text-red-300" : "text-gold"}`}>{labels[status]}</span>;
}

export default function DashboardPage() {
  const [session] = useState<WorkspaceSession>(() => getSession());
  const [projects, setProjects] = useState<FoundationProject[]>(() => getProjects());
  const [jobs, setJobs] = useState<GenerationJob[]>(() => getJobs());
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectTool, setProjectTool] = useState<FoundationProject["tool"]>("Cinema Studio");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_URL || !getAccessToken()) return;
    let active = true;
    const loadRemoteState = async () => {
      try {
        const [remoteProjects, remoteJobs] = await Promise.all([apiGet<Record<string, unknown>[]>("/api/v1/projects"), apiGet<Record<string, unknown>[]>("/api/v1/generate")]);
        if (active) {
          setProjects(remoteProjects.map(normalizeProject));
          setJobs(remoteJobs.map(normalizeJob));
        }
      } catch {
        if (active) setNotice("Remote workspace unavailable. Showing local draft data.");
      }
    };
    loadRemoteState();
    return () => { active = false; };
  }, []);

  const createProject = async () => {
    const name = projectName.trim();
    if (!name) return;
    const project: FoundationProject = { id: `project-${Date.now()}`, name, description: "New creative workspace", status: "draft", tool: projectTool, updatedAt: "Just now", shots: 0 };
    const next = [project, ...projects];
    if (process.env.NEXT_PUBLIC_API_URL && getAccessToken()) {
      try {
        await apiPost("/api/v1/projects", { name, description: project.description, settings: { tool: projectTool } });
      } catch {
        setNotice("Project was saved locally; the API could not be reached.");
      }
    }
    setProjects(next); saveProjects(next); setProjectName(""); setShowProjectForm(false); setNotice(`${name} created in your workspace`);
  };

  const startDemoJob = async () => {
    if (process.env.NEXT_PUBLIC_API_URL && getAccessToken()) {
      try {
        const job = await apiPost<Record<string, unknown>>("/api/v1/generate", { modelId: "cineforge-motion", inputType: "video", inputData: { prompt: "A cinematic draft shot" }, parameters: { duration: 5 }, projectId: projects[0]?.id }, undefined, `dashboard-${Date.now()}`);
        const normalized = normalizeJob(job);
        setJobs([normalized, ...jobs]); setNotice("Generation job queued server-side · credits reserved"); return;
      } catch {
        setNotice("The server rejected this generation because no approved provider is active."); return;
      }
    }
    const job = enqueueJob({ type: "video", label: "New Cinema Studio draft", model: "CineForge Motion", credits: 24, projectId: projects[0]?.id });
    setJobs([job, ...jobs]); setNotice("Local generation job queued · demo mode");
  };

  return <div className="h-full overflow-y-auto bg-background"><div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[0.18em] text-gold">{session.workspaceName}</p><h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Good evening, {session.name.split(" ")[0]}.</h1><p className="mt-2 max-w-xl text-sm text-muted-foreground">Your AI production workspace is ready. Pick up a project or start with a focused workflow.</p></div><div className="flex items-center gap-2"><Link href="/auth" className="rounded-md border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-surface-hover hover:text-foreground">Switch account</Link><button onClick={() => setShowProjectForm(true)} className="inline-flex items-center gap-2 rounded-md bg-gold px-3.5 py-2 text-xs font-semibold text-black hover:bg-gold-hover"><Plus size={14} /> New project</button></div></div>

    {notice && <div className="mt-5 flex items-center justify-between rounded-lg border border-gold/20 bg-gold/10 px-3 py-2.5 text-xs text-gold"><span className="flex items-center gap-2"><CheckCircle2 size={14} /> {notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss notice"><X size={14} /></button></div>}

    {showProjectForm && <div className="mt-6 rounded-xl border border-gold/25 bg-card p-5 shadow-2xl"><div className="flex items-center justify-between"><div><h2 className="font-heading text-lg text-foreground">Create a project</h2><p className="mt-1 text-xs text-muted-foreground">Projects keep your assets, workflows, and generation history together.</p></div><button onClick={() => setShowProjectForm(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-hover hover:text-foreground" aria-label="Close"><X size={15} /></button></div><div className="mt-5 grid gap-4 sm:grid-cols-[1fr_220px_auto] sm:items-end"><label className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Project name</span><input value={projectName} onChange={(event) => setProjectName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && createProject()} autoFocus placeholder="e.g. Summer campaign" className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold" /></label><label className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Starting workflow</span><select value={projectTool} onChange={(event) => setProjectTool(event.target.value as FoundationProject["tool"])} className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold"><option>Cinema Studio</option><option>Canvas</option><option>Marketing Studio</option></select></label><button onClick={createProject} className="rounded-md bg-gold px-4 py-2.5 text-xs font-semibold text-black hover:bg-gold-hover">Create project</button></div></div>}

    <section className="mt-8"><div className="flex items-end justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Creative tools</p><h2 className="mt-1 font-heading text-xl text-foreground">Choose your starting point</h2></div><Link href="/dashboard?view=projects" className="text-xs text-muted-foreground hover:text-foreground">View all projects <ArrowUpRight className="ml-1 inline" size={13} /></Link></div><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{quickActions.map((action) => { const Icon = action.icon; return <Link href={action.href} key={action.title} className="group rounded-xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-gold/40 hover:bg-surface-hover"><div className="flex items-start justify-between"><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneClasses[action.tone]}`}><Icon size={17} /></span><ArrowUpRight size={15} className="text-muted-foreground/50 transition group-hover:text-gold" /></div><h3 className="mt-4 text-sm font-semibold text-foreground">{action.title}</h3><p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{action.description}</p></Link>; })}</div></section>

    <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]"><section className="rounded-xl border border-border bg-card"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="text-sm font-semibold text-foreground">Recent projects</h2><p className="mt-1 text-xs text-muted-foreground">Your production work across every CineForge tool.</p></div><button onClick={() => setShowProjectForm(true)} className="rounded-md p-2 text-muted-foreground hover:bg-surface-hover hover:text-foreground" aria-label="Create project"><FolderPlus size={16} /></button></div><div className="divide-y divide-border">{projects.map((project) => <Link href={project.tool === "Canvas" ? "/canvas" : project.tool === "Marketing Studio" ? "/studio/marketing" : "/studio/cinema"} key={project.id} className="flex items-center gap-3 px-5 py-4 transition hover:bg-surface-hover"><div className="flex h-11 w-16 items-center justify-center rounded-md border border-border bg-gradient-to-br from-gold/25 via-emerald-950/60 to-background text-gold"><Film size={17} /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-foreground">{project.name}</p><p className="mt-1 truncate text-[10px] text-muted-foreground">{project.tool} · {project.shots} shots · {project.updatedAt}</p></div><StatusPill status={project.status} /><MoreHorizontal size={16} className="text-muted-foreground/50" /></Link>)}{projects.length === 0 && <div className="px-5 py-8 text-center text-xs text-muted-foreground">No projects yet. Create your first project above.</div>}</div></section>

      <section className="rounded-xl border border-border bg-card"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="text-sm font-semibold text-foreground">Generation queue</h2><p className="mt-1 text-xs text-muted-foreground">Jobs reserve credits before submission.</p></div><Link href="/jobs" className="text-xs text-gold hover:text-gold-hover">View queue</Link></div><div className="space-y-4 p-5">{jobs.slice(0, 3).map((job) => <div key={job.id}><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-gold">{job.type === "character" ? <UserRound size={15} /> : job.type === "ad" ? <Sparkles size={15} /> : <Video size={15} />}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-foreground">{job.label}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{job.model} · {job.credits} credits</p></div><JobStatus status={job.status} /></div>{job.status === "processing" && <div className="mt-2 h-1 rounded-full bg-muted"><div className="h-1 rounded-full bg-gold" style={{ width: `${job.progress}%` }} /></div>}</div>)}<button onClick={startDemoJob} className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-2.5 text-[11px] text-muted-foreground hover:border-gold/40 hover:text-gold"><Zap size={13} /> Queue a test generation</button></div></section></div>

    <section className="mt-8 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Credits available</p><Zap size={15} className="text-gold" /></div><p className="mt-3 tabular-nums text-2xl font-semibold text-foreground">{session.credits.toLocaleString()}</p><p className="mt-1 text-[10px] text-emerald-300">Creator plan · resets in 12 days</p></div><div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Active workflows</p><Activity size={15} className="text-cyan-300" /></div><p className="mt-3 tabular-nums text-2xl font-semibold text-foreground">7</p><p className="mt-1 text-[10px] text-muted-foreground">Across 3 projects</p></div><div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Assets in library</p><ImagePlus size={15} className="text-violet-300" /></div><p className="mt-3 tabular-nums text-2xl font-semibold text-foreground">148</p><p className="mt-1 text-[10px] text-muted-foreground">12 added this week</p></div></section>

    <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-card/50 px-5 py-4 text-center sm:flex-row sm:text-left"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-gold"><Layers3 size={16} /></div><div><p className="text-xs font-medium text-foreground">Need a hand getting started?</p><p className="mt-0.5 text-[10px] text-muted-foreground">Use a template to scaffold your next production workflow.</p></div></div><Link href="/canvas" className="rounded-md border border-border px-3 py-2 text-[10px] text-muted-foreground hover:bg-surface-hover hover:text-foreground">Browse templates</Link></div>
    <footer className="mt-8 flex items-center justify-between border-t border-border py-5 text-[10px] text-muted-foreground"><span>© 2026 CineForge AI</span><span className="flex items-center gap-1.5"><Clock3 size={12} /> All systems operational</span></footer>
  </div></div>;
}
