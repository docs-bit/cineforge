# Contributing to CineForge AI

Thank you for your interest in contributing to CineForge AI! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/) 9+
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/) or a [Supabase](https://supabase.com/) account

### Setting Up the Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone
   git clone https://github.com/YOUR-USERNAME/cineforge.git
   cd cineforge
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd apps/api
   cp .env.example .env   # Fill in your credentials
   npm install
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1: Backend
   cd apps/api
   npm run start:dev

   # Terminal 2: Frontend
   npm run dev
   ```

## 🔀 Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat/` | New feature | `feat/add-canvas-export` |
| `fix/` | Bug fix | `fix/canvas-drag-drop` |
| `refactor/` | Code refactor | `refactor/split-store` |
| `docs/` | Documentation | `docs/update-readme` |
| `test/` | Tests | `test/api-endpoints` |
| `chore/` | Maintenance | `chore/update-deps` |

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation only
- `style` — Formatting (no logic change)
- `refactor` — Code refactor (no feature/fix)
- `perf` — Performance improvement
- `test` — Add/update tests
- `build` — Build system/dependencies
- `ci` — CI/config changes
- `chore` — Maintenance/misc

**Examples:**
```bash
feat: add canvas export to JSON
fix: resolve canvas drag-and-drop on mobile
refactor: split cinema store into typed sub-objects
docs: add API endpoint documentation
```

### Pull Requests

1. **Create a feature branch** from `master`
2. **Make your changes** with clear, focused commits
3. **Run checks** before submitting:
   ```bash
   # Frontend
   npx tsc --noEmit        # TypeScript check
   npm run build           # Build check
   npm run lint            # Lint check

   # Backend
   cd apps/api
   npx tsc --noEmit        # TypeScript check
   npm run build           # Build check
   npm test                # Unit tests
   ```
4. **Push your branch** and create a PR
5. **Fill out the PR template** with:
   - What changed
   - Why it changed
   - How to test it
   - Screenshots (if UI changes)

## 📝 Code Style

### TypeScript

- **Strict mode** enabled — no `any` types
- **Explicit return types** on exported functions
- **Interfaces over types** for object shapes
- **Named exports** preferred over default exports

### React

- **Functional components** only (no class components)
- **Hooks** for state and side effects
- **Zustand** for global state (not Context)
- **Props interfaces** defined in the same file as the component

### CSS

- **Tailwind CSS** for styling (no inline styles)
- **No `transition: all`** — use explicit properties (`transition-colors`, `transition-opacity`)
- **`focus-visible:outline-*`** on all interactive elements
- **`autocomplete="off"`** on non-auth inputs/selects

### File Organization

```
src/
├── components/
│   └── feature/
│       ├── feature-component.tsx    # Component
│       ├── feature-types.ts         # Types (if complex)
│       └── __tests__/               # Co-located tests
├── stores/
│   └── feature-store.ts             # Zustand store
└── lib/
    └── feature-utils.ts             # Utility functions
```

## 🧪 Testing

### Frontend

```bash
npm run test          # Unit tests (Jest + React Testing Library)
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Backend

```bash
cd apps/api
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

### Writing Tests

- **Co-locate tests** with the code they test
- **Use `describe` blocks** to group related tests
- **Use `it` (or `test`)** with descriptive names
- **Mock external dependencies** (API calls, databases)
- **Test user interactions**, not implementation details

**Example:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PromptInput } from './prompt-input';

describe('PromptInput', () => {
  it('disables generate button when prompt is empty', () => {
    render(<PromptInput />);
    const button = screen.getByRole('button', { name: /generate/i });
    expect(button).toBeDisabled();
  });

  it('enables generate button when prompt is entered', () => {
    render(<PromptInput />);
    const textarea = screen.getByPlaceholderText(/describe your scene/i);
    fireEvent.change(textarea, { target: { value: 'A sunset over the ocean' } });
    const button = screen.getByRole('button', { name: /generate/i });
    expect(button).toBeEnabled();
  });
});
```

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node.js version: [e.g., 20.10]
```

## ✨ Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. Ex. "I'm always frustrated when..."

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 📚 Documentation

### Adding Documentation

- **Update README.md** if adding new features or changing setup
- **Add JSDoc comments** to exported functions and types
- **Update API docs** if adding/modifying endpoints
- **Add examples** for complex functionality

### Documentation Style

- Use **Markdown** for all documentation
- Include **code examples** where helpful
- Keep it **concise** and **actionable**
- Use **proper formatting** (headers, lists, code blocks)

## 🎨 Design Guidelines

### UI Components

- Use **shadcn/ui** components when available
- Follow the **design system** (colors, typography, spacing)
- Ensure **accessibility** (ARIA labels, keyboard navigation)
- Test on **multiple screen sizes**

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `gold` | `#C9A84C` | Primary accent, active states |
| `gold-dim` | `#8B7335` | Muted gold |
| `surface` | `#0F0F1A` | Background |
| `surface-dim` | `#16162A` | Elevated surfaces |
| `surface-bright` | `#1E1E3A` | Hover states |

## ❓ Questions?

- **Open a Discussion** on GitHub for general questions
- **Open an Issue** for bugs or feature requests
- **Check existing issues** before creating new ones

---

Thank you for contributing to CineForge AI! 🎬
