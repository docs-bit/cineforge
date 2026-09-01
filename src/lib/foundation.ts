export type JobStatus = "queued" | "processing" | "completed" | "failed" | "cancelled";

export type ProjectStatus = "draft" | "generating" | "ready" | "archived";

export interface WorkspaceSession {
  userId: string;
  name: string;
  email: string;
  workspaceId: string;
  workspaceName: string;
  plan: "free" | "creator" | "studio";
  credits: number;
}

export interface FoundationProject {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  tool: "Cinema Studio" | "Canvas" | "Marketing Studio";
  updatedAt: string;
  shots: number;
}

export interface CharacterIdentity {
  id: string;
  name: string;
  status: "ready" | "training" | "needs_consent";
  references: number;
  consistency: number;
  updatedAt: string;
}

export interface GenerationJob {
  id: string;
  type: "video" | "image" | "audio" | "character" | "ad";
  label: string;
  model: string;
  status: JobStatus;
  progress: number;
  credits: number;
  createdAt: string;
  projectId?: string;
}

const SESSION_KEY = "cineforge.session";
const PROJECTS_KEY = "cineforge.projects";
const CHARACTERS_KEY = "cineforge.characters";
const JOBS_KEY = "cineforge.jobs";

export const defaultSession: WorkspaceSession = {
  userId: "demo-user",
  name: "Alex Rivera",
  email: "alex@cineforge.ai",
  workspaceId: "workspace-main",
  workspaceName: "Alex's Studio",
  plan: "creator",
  credits: 2480,
};

export const seedProjects: FoundationProject[] = [
  { id: "project-signal", name: "The Last Signal", description: "A quiet city holds its breath as the first transmission arrives.", status: "generating", tool: "Cinema Studio", updatedAt: "2 min ago", shots: 4 },
  { id: "project-nocturne", name: "Nocturne / Product Film", description: "A moody product story built for a midnight launch.", status: "ready", tool: "Marketing Studio", updatedAt: "Yesterday", shots: 8 },
  { id: "project-orbit", name: "Orbit Protocol", description: "A multi-model visual pipeline for a sci-fi concept.", status: "draft", tool: "Canvas", updatedAt: "3 days ago", shots: 12 },
];

export const seedCharacters: CharacterIdentity[] = [
  { id: "character-mara", name: "Mara Chen", status: "ready", references: 24, consistency: 96, updatedAt: "Today" },
  { id: "character-jules", name: "Jules / Founder", status: "training", references: 12, consistency: 64, updatedAt: "Yesterday" },
];

export const seedJobs: GenerationJob[] = [
  { id: "job-01", type: "video", label: "The Last Signal · Shot 01", model: "CineForge Motion", status: "processing", progress: 68, credits: 24, createdAt: "Just now", projectId: "project-signal" },
  { id: "job-02", type: "ad", label: "Nocturne · 3 social variants", model: "Marketing Director", status: "completed", progress: 100, credits: 48, createdAt: "12 min ago", projectId: "project-nocturne" },
  { id: "job-03", type: "character", label: "Jules / Founder identity", model: "Soul ID", status: "queued", progress: 8, credits: 120, createdAt: "Yesterday" },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
}

export function getSession() { return read(SESSION_KEY, defaultSession); }
export function saveSession(session: WorkspaceSession) { write(SESSION_KEY, session); }
export function getProjects() { return read(PROJECTS_KEY, seedProjects); }
export function saveProjects(projects: FoundationProject[]) { write(PROJECTS_KEY, projects); }
export function getCharacters() { return read(CHARACTERS_KEY, seedCharacters); }
export function saveCharacters(characters: CharacterIdentity[]) { write(CHARACTERS_KEY, characters); }
export function getJobs() { return read(JOBS_KEY, seedJobs); }
export function saveJobs(jobs: GenerationJob[]) { write(JOBS_KEY, jobs); }

export function enqueueJob(input: Pick<GenerationJob, "type" | "label" | "model" | "credits" | "projectId">) {
  const job: GenerationJob = { ...input, id: `job-${Date.now()}`, status: "queued", progress: 0, createdAt: "Just now" };
  const jobs = [job, ...getJobs()];
  saveJobs(jobs);
  return job;
}

export function normalizeProject(value: Record<string, unknown>): FoundationProject {
  const status = value.status === "generating" || value.status === "ready" || value.status === "archived" ? value.status : "draft";
  const tool = value.settings && typeof value.settings === "object" && "tool" in value.settings && typeof value.settings.tool === "string" ? value.settings.tool : "Cinema Studio";
  return { id: String(value.id), name: String(value.name || "Untitled project"), description: String(value.description || ""), status, tool: tool === "Canvas" || tool === "Marketing Studio" ? tool : "Cinema Studio", updatedAt: value.updatedAt ? new Date(String(value.updatedAt)).toLocaleDateString() : "Just now", shots: typeof value.shots === "number" ? value.shots : 0 };
}

export function normalizeJob(value: Record<string, unknown>): GenerationJob {
  const status = value.status === "processing" || value.status === "completed" || value.status === "failed" || value.status === "cancelled" ? value.status : "queued";
  const type = value.inputType === "image" || value.inputType === "audio" || value.inputType === "character" || value.inputType === "ad" ? value.inputType : "video";
  return { id: String(value.id), type, label: `${value.modelId || "Generation"} job`, model: String(value.modelId || "Approved model"), status, progress: status === "completed" ? 100 : status === "processing" ? 50 : 0, credits: Number(value.reservedCredits || value.creditsUsed || 0), createdAt: value.createdAt ? new Date(String(value.createdAt)).toLocaleString() : "Just now", projectId: typeof value.projectId === "string" ? value.projectId : undefined };
}
