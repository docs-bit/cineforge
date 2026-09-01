# CineForge Platform Foundation

## Scope

This foundation slice covers authentication entry, workspace-scoped projects, generation jobs, credits, reusable Soul ID characters, Canvas workflows, and Marketing Studio campaign jobs. The frontend currently uses a local session and local persistence fallback so the workflows remain demonstrable without provider credentials. The NestJS API and Prisma schema define the production persistence boundary.

## Core entities

| Entity | Purpose | Important controls |
|---|---|---|
| `User` | Supabase-backed identity and plan/credit summary | Identity is owned by the auth provider; only the application profile and balance are stored here. |
| `Workspace` | Tenant boundary for projects, assets, characters, and workflows | All customer resources should resolve through workspace membership before access. |
| `Project` | Container for a creative production | Holds status, settings, thumbnail, and links to scenes/jobs/assets/workflows. |
| `Asset` | Private media reference | Stores a storage key and metadata; raw provider credentials never belong here. |
| `Character` | Soul ID identity | Tracks reference count, training state, consent status, and provenance notes. |
| `Canvas` | Node graph definition | Stores nodes, edges, and viewport as versionable JSON. |
| `Workflow` | Reusable graph or marketing pipeline | Stores a typed definition and belongs to a project/workspace. |
| `WorkflowRun` | Execution record for a saved workflow | Uses explicit `queued`, `running`, `completed`, and `failed`-style states. |
| `GenerationJob` | Durable-style media generation request | Uses idempotency, provider correlation, retry count, reservation, status, and expiry fields. |
| `CreditLedgerEntry` | Immutable financial usage record | Every reservation and release records amount and balance-after. |
| `Subscription` | Plan entitlement | Stores plan, cycle, and provider subscription reference, not secrets. |
| `AuditLog` | Security and operational trail | Captures resource/action metadata without raw keys or sensitive payloads. |

## Job state contract

`queued` means the request has passed validation and credits have been reserved. `processing` means an approved adapter has submitted the request and recorded the provider correlation ID. `completed` records result URLs and captures the reserved usage. `failed` exposes a customer-safe error and is eligible for a release/refund policy. `cancelled` releases the reserved credits after an authenticated ownership check.

The `POST /api/v1/generate` endpoint accepts an `Idempotency-Key` header or request field. A repeated request for the same authenticated user and key returns the original job instead of creating a duplicate reservation. The `GET /api/v1/generate/:jobId` and `DELETE /api/v1/generate/:jobId` routes enforce the authenticated user boundary.

## API surface

| Route | Responsibility |
|---|---|
| `POST /api/v1/auth/register` | Create an account through the configured auth provider. |
| `POST /api/v1/auth/login` | Start an authenticated session. |
| `POST /api/v1/auth/refresh` | Refresh a session without exposing provider secrets. |
| `POST /api/v1/auth/logout` | Revoke the authenticated session. |
| `GET/POST /api/v1/projects` | List and create workspace projects. |
| `GET/PUT/DELETE /api/v1/projects/:id` | Read, update, or delete owned projects. |
| `GET/POST /api/v1/canvases` | List or create graph workspaces. |
| `GET/PUT /api/v1/canvases/:id` | Read or persist an owned Canvas definition. |
| `POST /api/v1/characters` | Create a Soul ID identity record. |
| `POST /api/v1/characters/:id/train` | Enqueue training after consent and provenance checks. |
| `POST /api/v1/generate` | Reserve credits and create an idempotent generation job. |
| `GET/DELETE /api/v1/generate/:jobId` | Read or cancel an owned generation job. |
| `GET /api/v1/models` | Return only approved model catalogue entries. |
| `GET /api/v1/billing/credits` | Return the authenticated credit balance. |

## Security boundaries

Raw provider API keys are not represented in the schema. A production adapter should receive only a vault reference resolved server-side, and the customer-facing model catalogue should expose only entries with an approved adapter, tested credential, price rule, limits, safety policy, and entitlement. Identity workflows must retain consent and provenance evidence, and all media should resolve to private storage keys rather than public provider URLs until the user explicitly exports a result.

## Current implementation status

The dashboard, authentication entry screen, Soul ID page, Marketing Studio page, generation queue, shared typed foundation layer, schema expansion, and idempotent API service are implemented. Provider adapters, durable queue infrastructure, real storage, Supabase credentials, migrations, and billing webhooks remain deployment work rather than being faked in the browser.
