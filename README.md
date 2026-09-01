# 🎬 CineForge AI

**AI-powered cinema production studio** — generate cinematic video from text prompts with professional camera controls, VFX, color grading, and a visual node-based workflow.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)
![React Flow](https://img.shields.io/badge/React%20Flow-11-FF0072)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## ✨ Features

### 🎥 Cinema Studio
Professional video generation controls in a single-page studio interface:
- **Prompt Editor** — natural language prompt with real-time character count
- **Camera Settings** — sensor profile, focal length, aperture, depth of field with 55+ presets (ARRI Alexa, RED V-Raptor, Sony Venice, Blackmagic URSA, etc.)
- **Motion Control** — keyframe-based camera movements (pan, tilt, dolly, crane, tracking)
- **Genre & Speed** — genre selection (action, drama, horror, sci-fi, documentary, animation, etc.) with playback speed control
- **VFX Panel** — toggleable visual effects (lens flare, bokeh, film grain, chromatic aberration, vignette, motion blur, etc.)
- **Color Grading** — professional color wheels (lift, gamma, gain, offset) with LUT presets (Kodak 2383, Fujifilm 3513, bleach bypass, teal & orange, etc.)
- **Version Control** — create and compare generation versions side-by-side
- **Preview Viewport** — live viewfinder overlay with generation results (video/image playback), progress tracking, and error display
- **API Integration** — generation calls POST to the NestJS backend with 30s timeout, polling, and abort support

### 🔗 Canvas Workflow
Visual node-based pipeline editor (React Flow):
- **7 Node Types** — Prompt, Generation, Image, Video, Audio, Logic, Output
- **Drag & Drop** — drag nodes from the toolbox onto the canvas at cursor position
- **Smart Connections** — Prompt→Generation nodes automatically copy prompt text between connected nodes
- **Type-Specific Properties** — each node type has its own property editor (model dropdown, resolution selector, status indicator, etc.)
- **Custom Edges** — gold-styled bezier connections with labels
- **Save/Export** — save canvas as JSON download
- **Keyboard Accessible** — full keyboard navigation in the toolbox (Enter/Space to add nodes)

### 🏗️ Backend API (NestJS)
RESTful API with Supabase authentication:
- **Auth** — JWT validation via Supabase, user profile proxy endpoints
- **Projects** — CRUD with workspace ownership validation
- **Generation** — job creation with credit deduction, status polling, result storage
- **Models** — AI model registry (Sora, Veo, Kling, Flux, etc.) with credit costs
- **Characters** — CRUD with reference image upload and training job stubs
- **Canvas** — CRUD for saving/loading visual workflows
- **Billing** — subscription plans, credit packages, usage history
- **Admin** — user management, audit logs, system statistics

### 🗄️ Database (Prisma + PostgreSQL)
8 relational tables with UUID primary keys:
`users` · `workspaces` · `projects` · `canvases` · `characters` · `generation_jobs` · `subscriptions` · `audit_logs`

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│  Next.js 16 (App Router) + React 19             │
│                                                  │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ Cinema Studio │  │   Canvas Workflow        │ │
│  │ (9 components)│  │   (React Flow + 7 nodes) │ │
│  └──────┬───────┘  └──────────┬───────────────┘ │
│         │                     │                   │
│    Zustand Store         Zustand Store            │
│    (cinema-studio)       (canvas)                 │
│         │                     │                   │
│         └──────────┬──────────┘                   │
│                    │                              │
│              API Client (lib/api.ts)              │
└────────────────────────┬─────────────────────────┘
                         │ HTTP
┌────────────────────────┴─────────────────────────┐
│                  Backend API                      │
│  NestJS 11 + Fastify                             │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │  Modules: auth · projects · generation ·    │ │
│  │  models · characters · canvas · billing ·   │ │
│  │  admin                                        │ │
│  └──────────────────┬──────────────────────────┘ │
│                     │                             │
│              Prisma Client (6.x)                  │
│                     │                             │
│              PostgreSQL (Supabase)                │
└──────────────────────────────────────────────────┘
```

**Key design decisions:**
- **Thin API layer** — NestJS handles business logic only; auth, DB, storage delegated to Supabase
- **Typed sub-object stores** — Cinema Studio state grouped into `camera`, `style`, `output`, `generation` slices
- **React Flow for Canvas** — off-the-shelf node graph with custom node types and edges
- **Fastify adapter** — NestJS uses Fastify instead of Express for performance

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/) 9+
- [PostgreSQL](https://www.postgresql.org/) (or a [Supabase](https://supabase.com/) project)
- [Supabase](https://supabase.com/) account (for auth + database)

### 1. Clone the repository

```bash
git clone https://github.com/docs-bit/cineforge.git
cd cineforge
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd apps/api
cp .env.example .env   # then fill in your Supabase credentials
npm install
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates all 8 tables)
npx prisma migrate dev
```

### 5. Start the backend

```bash
cd apps/api
npm run start:dev
# API runs on http://localhost:3001
```

### 6. Start the frontend

```bash
# From the project root
npm run dev
# Frontend runs on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
cineforge/
├── src/                              # Frontend (Next.js 16)
│   ├── app/
│   │   ├── (app)/                    # Route group (shared layout)
│   │   │   ├── canvas/page.tsx       # Canvas workflow editor
│   │   │   ├── dashboard/page.tsx    # Dashboard home
│   │   │   └── studio/
│   │   │       └── cinema/page.tsx   # Cinema Studio page
│   │   ├── globals.css               # Tailwind v4 + theme tokens
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing/redirect
│   ├── components/
│   │   ├── canvas/                   # Canvas workflow components
│   │   │   ├── canvas-editor.tsx     # React Flow wrapper with DnD
│   │   │   ├── canvas-layout.tsx     # 3-panel layout
│   │   │   ├── edges/                # Custom gold-styled edges
│   │   │   ├── nodes/                # 7 node type components + registry
│   │   │   └── panels/               # Toolbox, properties, toolbar
│   │   ├── cinema-studio/            # Cinema Studio components
│   │   │   ├── camera-settings.tsx   # Focal length, aperture, sensor
│   │   │   ├── color-grading-panel.tsx # Color wheels + LUT presets
│   │   │   ├── controls-panel.tsx    # Main controls container
│   │   │   ├── genre-speed-selector.tsx
│   │   │   ├── motion-control.tsx    # Camera movement keyframes
│   │   │   ├── preview-viewport.tsx  # Viewfinder + result display
│   │   │   ├── prompt-input.tsx      # Prompt editor + generate button
│   │   │   ├── version-selector.tsx  # Version history
│   │   │   └── vfx-panel.tsx         # Toggleable VFX effects
│   │   ├── layout/                   # App shell (sidebar, header)
│   │   └── ui/                       # shadcn/ui components (11)
│   ├── constants/                    # Camera presets, genres, VFX effects
│   ├── hooks/                        # Custom React hooks
│   ├── lib/                          # Utilities, API client
│   ├── stores/                       # Zustand state management
│   │   ├── canvas-store.ts           # Canvas nodes, edges, viewport
│   │   └── cinema-studio-store.ts    # Typed sub-objects (camera/style/output/generation)
│   └── types/                        # TypeScript type definitions
│       ├── canvas.ts                 # CanvasNode, CanvasEdge, NodeType
│       └── cinema-studio.ts          # ColorGrading, Motion, CameraPreset
│
├── apps/
│   └── api/                          # Backend (NestJS 11)
│       ├── prisma/
│       │   └── schema.prisma         # 8-table database schema
│       └── src/
│           ├── app.module.ts         # Root module
│           ├── main.ts               # Bootstrap (Fastify, CORS, validation)
│           ├── common/               # Guards, filters, decorators, interceptors
│           ├── config/               # Environment configuration
│           ├── prisma/               # PrismaService (global)
│           └── modules/              # 8 feature modules
│               ├── auth/             # Supabase JWT proxy
│               ├── projects/         # CRUD with ownership
│               ├── generation/       # Job creation + credit deduction
│               ├── models/           # AI model registry
│               ├── characters/       # CRUD + training stubs
│               ├── canvas/           # Canvas save/load
│               ├── billing/          # Plans + credits
│               └── admin/            # User management + audit
│
├── package.json                      # Frontend deps
├── tsconfig.json                     # TypeScript config (excludes apps/api)
├── components.json                   # shadcn/ui config
├── next.config.ts                    # Next.js config
├── postcss.config.mjs                # Tailwind CSS v4
└── eslint.config.mjs                 # ESLint flat config
```

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api/v1`.

| Module      | Method   | Endpoint                          | Description                      |
|-------------|----------|-----------------------------------|----------------------------------|
| **Auth**    | POST     | `/auth/signup`                    | Create account via Supabase      |
|             | POST     | `/auth/login`                     | Sign in via Supabase             |
|             | GET      | `/auth/me`                        | Get current user profile         |
|             | PATCH    | `/auth/me`                        | Update profile                   |
| **Projects**| GET      | `/projects`                       | List user's projects             |
|             | POST     | `/projects`                       | Create project                   |
|             | GET      | `/projects/:id`                   | Get project by ID                |
|             | PATCH    | `/projects/:id`                   | Update project                   |
|             | DELETE   | `/projects/:id`                   | Delete project (owner only)      |
| **Generate**| POST     | `/generate`                       | Create generation job            |
|             | GET      | `/generate/:id`                   | Poll job status                  |
|             | POST     | `/generate/:id/cancel`            | Cancel job                       |
| **Models**  | GET      | `/models`                         | List available AI models         |
|             | GET      | `/models/:id`                     | Get model details + credit cost  |
| **Characters**| GET    | `/characters`                     | List workspace characters        |
|             | POST     | `/characters`                     | Create character                 |
|             | PATCH    | `/characters/:id`                 | Update character                 |
|             | DELETE   | `/characters/:id`                 | Delete character                 |
|             | POST     | `/characters/:id/train`           | Start training job               |
| **Canvas**  | GET      | `/canvases`                       | List user's canvases             |
|             | POST     | `/canvases`                       | Save canvas                      |
|             | GET      | `/canvases/:id`                   | Load canvas                      |
|             | DELETE   | `/canvases/:id`                   | Delete canvas                    |
| **Billing** | GET      | `/billing/plans`                  | List subscription plans          |
|             | POST     | `/billing/subscribe`              | Subscribe to plan                |
|             | GET      | `/billing/credits`                | Get credit balance               |
|             | POST     | `/billing/credits/purchase`       | Purchase credits                 |
|             | GET      | `/billing/history`                | Usage history                    |
| **Admin**   | GET      | `/admin/users`                    | List all users                   |
|             | PATCH    | `/admin/users/:id`                | Update user (admin only)         |
|             | GET      | `/admin/stats`                    | System statistics                |
|             | GET      | `/admin/audit-logs`               | Audit log query                  |

---

## 🗃️ Database Schema

### Entity Relationships

```
User ──┬── Workspace ──┬── Project ──┬── Canvas
       │               │             └── GenerationJob
       ├── Character   └── Character
       ├── GenerationJob
       ├── Subscription
       └── AuditLog
```

### Tables

| Table             | Description                                      |
|-------------------|--------------------------------------------------|
| `users`           | User accounts with plan type and credit balance  |
| `workspaces`      | Team workspaces with branding and custom domains |
| `projects`        | Media projects linked to workspaces              |
| `canvases`        | Saved visual workflows (nodes + edges as JSON)   |
| `characters`      | AI characters with reference images and models   |
| `generation_jobs` | Generation requests with status and results      |
| `subscriptions`   | Stripe subscription tracking                     |
| `audit_logs`      | Workspace action audit trail                     |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org) | 16.3 | React framework (App Router) |
| [React](https://react.dev) | 19.2 | UI library |
| [TypeScript](https://typescriptlang.org) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first CSS |
| [shadcn/ui](https://ui.shadcn.com) | v5+ | Component library (base-ui) |
| [Zustand](https://zustand-demo.pmnd.rs) | 5.x | State management |
| [React Flow](https://reactflow.dev) | 11.x | Node-based canvas editor |
| [Framer Motion](https://framer.com/motion) | 13.x | Animations |
| [Lucide](https://lucide.dev) | 1.38 | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| [NestJS](https://nestjs.com) | 11.x | Node.js framework |
| [Fastify](https://fastify.io) | — | HTTP adapter (faster than Express) |
| [Prisma](https://prisma.io) | 6.x | Database ORM |
| [Supabase](https://supabase.com) | 2.x | Auth + PostgreSQL hosting |
| [class-validator](https://github.com/TypeStack/class-validator) | 0.14 | Request validation |
| [class-transformer](https://github.com/TypeStack/class-transformer) | 0.5 | DTO transformation |

### Database
- **PostgreSQL** (via Supabase)
- **Prisma** migrations for schema management
- UUID primary keys on all tables

---

## 🎨 Design System

### Theme
- **Dark mode** with film-grain texture background (`bg-surface: #0F0F1A`)
- **Gold accent** (`#C9A84C`) for active states, highlights, and connections
- **Sidebar** with frosted glass effect (`backdrop-blur-xl`)
- **Cards** with subtle borders and glow effects on hover

### Tailwind v4 Custom Tokens
```css
@theme inline {
  --color-gold: #C9A84C;
  --color-gold-dim: #8B7335;
  --color-surface: #0F0F1A;
  --color-surface-dim: #16162A;
  --color-surface-bright: #1E1E3A;
}
```

### Web Interface Guidelines Compliance
- ✅ No `transition: all` — explicit `transition-colors`, `transition-opacity`
- ✅ `autocomplete="off"` on all non-auth inputs and selects
- ✅ `focus-visible:outline-*` on every interactive element
- ✅ Confirmation dialogs on destructive actions (clear canvas)
- ✅ Keyboard-accessible toolbox (Enter/Space support)
- ✅ `aria-label` on all interactive elements

---

## 📋 Available Scripts

### Frontend
```bash
npm run dev       # Start Next.js dev server (port 3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

### Backend
```bash
cd apps/api
npm run start:dev       # Start NestJS in watch mode (port 3001)
npm run build           # Production build
npm run start:prod      # Start production server
npm run test            # Run unit tests
npm run test:e2e        # Run end-to-end tests
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio (DB browser)
```

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Cinema Studio with camera, VFX, color grading controls
- [x] Canvas node-based workflow editor with 7 node types
- [x] NestJS backend with 8 API modules and Prisma schema
- [x] Supabase JWT authentication
- [x] API integration (frontend → backend)
- [x] Canvas drag-and-drop and node data flow
- [x] Generation result display (video/image playback)
- [x] Type-specific canvas properties panel
- [x] Store refactor into typed sub-objects

### 🔜 Next
- [ ] Wire generation to real AI model APIs (Sora, Veo, Kling)
- [ ] Canvas pipeline execution engine (run connected nodes)
- [ ] Real-time generation progress via WebSocket/SSE
- [ ] Project persistence (save/load from backend)
- [ ] Character training integration
- [ ] Stripe billing integration
- [ ] Workspace collaboration
- [ ] Image generation (Stable Diffusion / DALL-E)
- [ ] Audio generation (ElevenLabs / Suno)
- [ ] Export/render pipeline

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/docs-bit">docs-bit</a>
</p>
