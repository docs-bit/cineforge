import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module';
import { SupabaseAuthGuard } from '../src/common/guards/supabase-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';
import { GenerationService } from '../src/modules/generation/generation.service';
import { MODEL_CATALOGUE } from '../src/modules/models/models.catalog';

const now = () => new Date();

class FakePrisma {
  users = new Map<string, { id: string; creditsBalance: number; isAdmin: boolean; isActive: boolean }>([
    ['user-a', { id: 'user-a', creditsBalance: 200, isAdmin: false, isActive: true }],
    ['user-b', { id: 'user-b', creditsBalance: 200, isAdmin: false, isActive: true }],
  ]);
  members = new Map<string, { id: string; userId: string; workspaceId: string; role: string }>([
    ['workspace-a:user-a', { id: 'member-a', userId: 'user-a', workspaceId: 'workspace-a', role: 'owner' }],
    ['workspace-b:user-b', { id: 'member-b', userId: 'user-b', workspaceId: 'workspace-b', role: 'owner' }],
  ]);
  projects = new Map<string, any>([
    ['project-a', { id: 'project-a', name: 'Private A', workspaceId: 'workspace-a', createdById: 'user-a', createdAt: now(), updatedAt: now() }],
    ['project-b', { id: 'project-b', name: 'Private B', workspaceId: 'workspace-b', createdById: 'user-b', createdAt: now(), updatedAt: now() }],
  ]);
  jobs = new Map<string, any>();
  ledger: any[] = [];

  workspaceMember = {
    findMany: async ({ where }: any) => [...this.members.values()].filter((m) => m.userId === where.userId && (!where.workspaceId || m.workspaceId === where.workspaceId)),
    findFirst: async ({ where }: any) => [...this.members.values()].find((m) => m.userId === where.userId) || null,
    findUnique: async ({ where }: any) => this.members.get(`${where.workspaceId_userId.workspaceId}:${where.workspaceId_userId.userId}`) || null,
  };

  user = {
    findUnique: async ({ where }: any) => this.users.get(where.id) || null,
    update: async ({ where, data }: any) => {
      const user = this.users.get(where.id);
      if (!user) throw new Error('user not found');
      if (data.creditsBalance?.decrement) user.creditsBalance -= data.creditsBalance.decrement;
      if (data.creditsBalance?.increment) user.creditsBalance += data.creditsBalance.increment;
      return user;
    },
    upsert: async ({ where, create, update }: any) => {
      const current = this.users.get(where.id);
      if (current) return current;
      const created = { id: where.id, creditsBalance: 100, isAdmin: false, isActive: true, ...create, ...update };
      this.users.set(where.id, created);
      return created;
    },
  };

  project = {
    findMany: async ({ where }: any) => {
      const allowedWorkspaceIds = where?.OR?.[1]?.workspaceId?.in || [];
      return [...this.projects.values()].filter((project) => project.createdById === where?.OR?.[0]?.createdById || allowedWorkspaceIds.includes(project.workspaceId));
    },
    findUnique: async ({ where }: any) => this.projects.get(where.id) || null,
    create: async ({ data }: any) => {
      const project = { id: `project-${this.projects.size + 1}`, createdAt: now(), updatedAt: now(), ...data };
      this.projects.set(project.id, project);
      return project;
    },
    update: async ({ where, data }: any) => {
      const project = { ...this.projects.get(where.id), ...data, updatedAt: now() };
      this.projects.set(where.id, project);
      return project;
    },
    delete: async ({ where }: any) => this.projects.delete(where.id),
  };

  generationJob = {
    findFirst: async ({ where }: any) => [...this.jobs.values()].find((job) => job.userId === where.userId && (!where.idempotencyKey || job.idempotencyKey === where.idempotencyKey) && (!where.id || job.id === where.id)) || null,
    findMany: async ({ where }: any) => [...this.jobs.values()].filter((job) => job.userId === where.userId),
    findUnique: async ({ where }: any) => this.jobs.get(where.id) || null,
    create: async ({ data }: any) => {
      const job = { id: `job-${this.jobs.size + 1}`, createdAt: now(), retryCount: 0, resultUrls: [], ...data };
      this.jobs.set(job.id, job);
      return job;
    },
    update: async ({ where, data }: any) => {
      const job = { ...this.jobs.get(where.id), ...data };
      this.jobs.set(where.id, job);
      return job;
    },
    updateMany: async ({ where, data }: any) => {
      const job = this.jobs.get(where.id);
      if (!job || (where.status && job.status !== where.status) || (where.status?.in && !where.status.in.includes(job.status)) || (where.retryCount?.lt !== undefined && !(job.retryCount < where.retryCount.lt))) return { count: 0 };
      const next = { ...job, ...data };
      if (data.retryCount?.increment) next.retryCount = job.retryCount + data.retryCount.increment;
      this.jobs.set(job.id, next);
      return { count: 1 };
    },
  };

  creditLedgerEntry = { create: async ({ data }: any) => { this.ledger.push(data); return data; } };
  $transaction = async <T>(callback: (tx: this) => Promise<T>) => callback(this);
}

describe('workspace authorization and generation jobs', () => {
  let app: INestApplication & NestFastifyApplication;
  let prisma: FakePrisma;

  const request = async (method: string, url: string, body?: unknown, token = 'token-a', headers: Record<string, string> = {}) => {
    const fastify = app.getHttpAdapter().getInstance();
    return fastify.inject({ method, url, headers: { authorization: `Bearer ${token}`, ...headers }, payload: body });
  };

  beforeAll(async () => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/cineforge_test';
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
    process.env.CORS_ORIGIN = 'http://localhost:3000';
    prisma = new FakePrisma();
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService).useValue(prisma)
      .overrideGuard(SupabaseAuthGuard).useValue({ canActivate: (context: any) => {
        const request = context.switchToHttp().getRequest();
        request.user = { id: request.headers.authorization?.includes('token-b') ? 'user-b' : 'user-a' };
        return true;
      } })
      .compile();
    app = moduleRef.createNestApplication(new FastifyAdapter()) as INestApplication & NestFastifyApplication;
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    const staged = MODEL_CATALOGUE.find((model) => model.id === 'sora-2');
    if (staged) Object.assign(staged, { approved: true, credentialReady: true, customerVisible: true, health: 'healthy' });
  });

  afterAll(async () => { if (app) await app.close(); });

  it('lists only projects from the authenticated user workspace', async () => {
    const response = await request('GET', '/api/v1/projects');
    expect(response.statusCode).toBe(200);
    const projects = response.json();
    expect(projects.map((project: any) => project.id)).toContain('project-a');
    expect(projects.map((project: any) => project.id)).not.toContain('project-b');
  });

  it('rejects creating a project in another workspace', async () => {
    const response = await request('POST', '/api/v1/projects', { name: 'Cross tenant', workspaceId: 'workspace-b' });
    expect(response.statusCode).toBe(403);
  });

  it('rejects reading another user project', async () => {
    const response = await request('GET', '/api/v1/projects/project-b');
    expect(response.statusCode).toBe(403);
  });

  it('reserves credits exactly once for an idempotent generation request', async () => {
    const first = await request('POST', '/api/v1/generate', { modelId: 'sora-2', inputType: 'video', inputData: { prompt: 'A test shot' }, parameters: { duration: 5 } }, 'token-a', { 'idempotency-key': 'test-job-001' });
    const second = await request('POST', '/api/v1/generate', { modelId: 'sora-2', inputType: 'video', inputData: { prompt: 'A test shot' }, parameters: { duration: 5 } }, 'token-a', { 'idempotency-key': 'test-job-001' });
    expect(first.statusCode).toBe(201);
    expect(second.statusCode).toBe(201);
    expect(first.json().id).toBe(second.json().id);
    expect(prisma.users.get('user-a')?.creditsBalance).toBe(148);
    expect(prisma.ledger.filter((entry) => entry.type === 'reserve')).toHaveLength(1);
  });

  it('prevents a different user from reading or cancelling a generation job', async () => {
    const created = await request('POST', '/api/v1/generate', { modelId: 'sora-2', inputType: 'video', inputData: { prompt: 'Private shot' }, parameters: { duration: 5 } }, 'token-a', { 'idempotency-key': 'test-job-002' });
    const jobId = created.json().id;
    expect((await request('GET', `/api/v1/generate/${jobId}`, undefined, 'token-b')).statusCode).toBe(404);
    expect((await request('DELETE', `/api/v1/generate/${jobId}`, undefined, 'token-b')).statusCode).toBe(404);
  });

  it('refunds reserved credits exactly once when a user cancels a queued job', async () => {
    const before = prisma.users.get('user-a')?.creditsBalance || 0;
    const created = await request('POST', '/api/v1/generate', { modelId: 'sora-2', inputType: 'video', inputData: { prompt: 'Cancel me' }, parameters: { duration: 5 } }, 'token-a', { 'idempotency-key': 'test-job-003' });
    const jobId = created.json().id;
    const cancelled = await request('DELETE', `/api/v1/generate/${jobId}`, undefined, 'token-a');
    expect(cancelled.statusCode).toBe(200);
    expect(cancelled.json().status).toBe('cancelled');
    expect(prisma.users.get('user-a')?.creditsBalance).toBe(before);
    expect(prisma.ledger.filter((entry) => entry.generationJobId === jobId && entry.type === 'release')).toHaveLength(1);
  });

  it('releases credits on terminal provider failure and does not refund twice', async () => {
    const created = await request('POST', '/api/v1/generate', { modelId: 'sora-2', inputType: 'video', inputData: { prompt: 'Fail me' }, parameters: { duration: 5 } }, 'token-a', { 'idempotency-key': 'test-job-004' });
    const jobId = created.json().id;
    const service = app.get(GenerationService);
    const before = prisma.users.get('user-a')?.creditsBalance || 0;
    await service.markFailed(jobId, 'provider timeout');
    await service.markFailed(jobId, 'provider timeout again');
    expect(prisma.users.get('user-a')?.creditsBalance).toBe(before + 52);
    expect(prisma.ledger.filter((entry) => entry.generationJobId === jobId && entry.type === 'release')).toHaveLength(1);
  });

  it('returns healthy liveness without requiring authentication', async () => {
    const response = await app.getHttpAdapter().getInstance().inject({ method: 'GET', url: '/health/live' });
    expect(response.statusCode).toBe(200);
    expect(response.json().status).toBe('ok');
  });
});
