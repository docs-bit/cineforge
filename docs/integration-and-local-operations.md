# CineForge Integration and Local Operations Guide

## 1. What is included

CineForge now includes an HTTP-level Jest integration suite at `apps/api/test/workspace-generation.e2e-spec.ts`. It runs a Nest application with an isolated in-memory Prisma fixture, so it verifies routing, guards, service authorization, idempotency, credit reservations, cancellation refunds, terminal failure refunds, and health endpoints without requiring a live database or paid provider API.

The suite deliberately does not call external AI providers. External calls must be covered by adapter contract tests and a separately enabled canary environment because provider calls can spend money, produce billable artifacts, or process sensitive user content.

## 2. Run the integration suite

From the repository root:

```bash
cd apps/api
npm install
npm run test:e2e -- --runInBand
```

The expected result is one passing suite with eight tests. The cases cover the following behavior:

| Test area | Contract verified |
|---|---|
| Workspace list isolation | A user receives projects from their own workspace, not another workspace. |
| Cross-tenant create | A user cannot create a project in a workspace where they are not a member. |
| Cross-tenant read | A user cannot read another user’s project. |
| Idempotency | Repeating the same idempotency key returns the same job and reserves credits only once. |
| Job ownership | Another user cannot read or cancel the job. |
| Cancellation | A queued job returns reserved credits exactly once. |
| Provider failure | A terminal failure releases reserved credits exactly once. |
| Liveness | `/health/live` returns a public process health response without authentication. |

For a real database integration run, create a disposable PostgreSQL database, export the variables from the environment section below, apply migrations with `npx prisma migrate deploy`, and replace the in-memory Prisma override with the real `PrismaService` in a separate `test:e2e:postgres` configuration. Do not point destructive tests at a shared or production database.

## 3. Environment setup

Copy the API template and create a frontend environment file:

```bash
cp apps/api/.env.example apps/api/.env
cp .env.example .env.local
```

At minimum, set these local values:

```dotenv
# apps/api/.env
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres?sslmode=disable
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
NODE_ENV=development
HOST=0.0.0.0
PORT=3001
CORS_ORIGIN=http://localhost:3000
QUEUE_DRIVER=database
QUEUE_POLL_INTERVAL_MS=5000
JOB_MAX_RETRIES=3
JOB_LEASE_SECONDS=120

# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

The service-role key is server-only. Never place it in `.env.local`, a `NEXT_PUBLIC_*` variable, a browser bundle, a Canvas export, or a client-side request. If the frontend API URL is omitted, the UI intentionally uses local demo persistence. If it is present, authentication and project/job operations use the backend and API errors are surfaced instead of silently creating a fake session.

## 4. Local Docker workflow

The API container is defined in `apps/api/Dockerfile`. Start a local PostgreSQL service using any local PostgreSQL installation or a disposable container. One simple Docker command is:

```bash
docker run --name cineforge-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -d postgres:16-alpine
```

Then apply the migration and start the API container:

```bash
cd apps/api
cp .env.example .env
# Edit .env with real Supabase values before starting the API.
npx prisma migrate deploy
cd ../..
docker build -t cineforge-api:local ./apps/api
docker run --name cineforge-api \
  --env-file apps/api/.env \
  -p 3001:3001 \
  --network host \
  cineforge-api:local
```

On macOS and Windows, `--network host` has different behavior than on Linux. In that case, use a Docker network and set `DATABASE_URL` to the PostgreSQL container hostname, or run PostgreSQL on the host with a host-reachable database URL.

Verify the process and database readiness:

```bash
curl http://localhost:3001/health/live
curl http://localhost:3001/health/ready
```

Run the frontend in a second terminal:

```bash
npm install
npm run dev
```

Open `http://localhost:3000/auth`. With `NEXT_PUBLIC_API_URL` set and a valid Supabase session, the dashboard will use the API. Without it, the UI will clearly identify local demo mode.

## 5. Connecting real provider adapters

The backend’s provider boundary is `apps/api/src/modules/generation/provider-router.service.ts`. The router is intentionally strict: a model must be present in `models.catalog.ts`, approved, customer-visible, credential-ready, and not offline. A provider adapter must implement this contract:

```ts
export interface ProviderAdapter {
  readonly id: string;
  readonly configured: boolean;
  submit(request: ProviderSubmitRequest): Promise<ProviderSubmitResult>;
  cancel(providerJobId: string): Promise<void>;
}
```

A production adapter should perform the following sequence:

1. Read a server-side credential through the deployment secret manager. Do not read provider credentials from user input or Prisma rows.
2. Validate the request against the catalogue entry: input type, maximum duration, resolution, aspect ratio, concurrency entitlement, and safety policy.
3. Submit the request to the official provider SDK or HTTPS API with a provider correlation ID and an idempotency key if that provider supports one.
4. Return only the provider job ID and normalized queued/processing state. Do not store raw provider responses in logs.
5. Poll through the durable worker or consume a verified provider callback. Never rely on a browser tab remaining open.
6. On completion, copy the output into private object storage, create governed `Asset` records, and persist signed-download metadata rather than public provider URLs.
7. On provider failure, timeout, moderation rejection, or cancellation, call the generation service terminal transition so reserved credits are released exactly once.
8. Record latency, provider request ID, model version, status, retry count, and sanitized error code in observability data.

A provider adapter is not activated merely by adding an API key. Complete the release gate: test connectivity, verify the provider’s terms and data handling, run a canary with non-sensitive content, verify output storage, verify cancellation and timeout behavior, validate the credit ledger, and then change the catalogue entry from staged to approved/credential-ready/customer-visible/healthy. Keep the initial customer concurrency limit low and add a circuit breaker around repeated provider failures.

The repository currently includes provider credential placeholders in `apps/api/.env.example`, but no live adapter is registered. That is intentional. The router should reject generation until an adapter has been implemented and the catalogue entry has passed governance review.

## 6. Suggested adapter layout

A maintainable implementation can use this structure:

```text
apps/api/src/modules/providers/
  providers.module.ts
  providers.registry.ts
  openai-video.adapter.ts
  google-video.adapter.ts
  kling-video.adapter.ts
  shared/provider-http-client.ts
  shared/provider-errors.ts
```

Each adapter should be small and provider-specific. Keep normalization, retry policy, timeout handling, webhook verification, and signed-asset storage in shared infrastructure. Register adapters at application startup only when their required secret is present. A missing secret should produce `configured: false`, not a startup crash for every unrelated provider.

## 7. Required production secrets

Use a managed secret store in deployed environments. The minimum logical secret set is:

| Secret/configuration | Where it is used |
|---|---|
| `DATABASE_URL` | Prisma connection to PostgreSQL. |
| `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase identity verification and auth operations. |
| `CORS_ORIGIN` | Exact browser origin allowed to call the API. |
| Storage credentials | Private asset upload and signed URL generation. |
| Provider credentials | Only inside their matching server-side adapters. |
| Queue settings | Worker lease, polling, retry, and dead-letter behavior. |

Rotate secrets without committing replacement values. After rotation, run authentication, health, storage, and provider canary checks before reopening traffic.

## 8. Troubleshooting

If the API fails immediately with missing environment variables, confirm that `apps/api/.env` is present and that the container receives it through `--env-file`. If `/health/live` works but `/health/ready` fails, inspect the PostgreSQL host, port, credentials, SSL mode, and migration state. If authentication succeeds in Supabase but project requests return `401`, confirm the browser sends the access token and that `NEXT_PUBLIC_API_URL` points to the same API instance. If generation returns “Model is not currently available,” the model is still staged or its adapter is not configured; do not bypass that check in application code.
