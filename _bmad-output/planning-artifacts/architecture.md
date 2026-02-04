---
stepsCompleted: [step-01-init, step-02-context, step-03-starter, step-04-decisions, step-05-patterns]
inputDocuments:
  - prd.md
  - product-brief-kura-frontend-2026-02-02.md
  - ux-design-specification.md
workflowType: 'architecture'
project_name: 'kura-frontend'
user_name: '12jihan'
date: '2026-02-03'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (30 FRs):**

| Category | Count | Key Capabilities |
|----------|-------|------------------|
| Authentication | 4 | Firebase signup/login, logout, password reset |
| Onboarding | 7 | Handle, content type, description, keywords, LinkedIn connect |
| AI Generation | 5 | Instruction generation, daily batch, on-demand, regeneration |
| Card Management | 5 | Browse feed, view details, edit, dismiss, feedback capture |
| Publishing | 5 | Schedule, post, view scheduled, cancel, copy fallback |
| Error Handling | 4 | Error alerts, retry, clipboard fallback, loading states |

**Non-Functional Requirements (21 NFRs):**

| Category | Key Constraints |
|----------|-----------------|
| **Performance** | AI < 10s, page load < 3s, navigation < 1s, API < 500ms |
| **Security** | Firebase Auth, HTTPS/TLS, server-side credentials, encrypted storage |
| **Scalability** | 1,000 concurrent users, stateless API, horizontal scaling ready |
| **Accessibility** | WCAG 2.1 Level A, keyboard navigation, semantic HTML, focus management |
| **Integration** | Gemini rate limits, LinkedIn OAuth refresh, Firebase auth state |

**Scale & Complexity:**

- Primary domain: Full-Stack Web SPA
- Complexity level: Low-Medium
- Estimated architectural components: ~15-20 (frontend modules, API routes, services)

### Technical Constraints & Dependencies

| Constraint | Impact |
|------------|--------|
| **Angular 21** | Framework lock-in, signals-based state management |
| **Firebase Auth** | External dependency for authentication |
| **Gemini API** | AI generation speed bound by external service |
| **LinkedIn API** | Publishing dependent on OAuth and API availability |
| **PostgreSQL** | Relational data model for users, cards, schedules |
| **Express.js** | REST API patterns, middleware architecture |

### Cross-Cutting Concerns

| Concern | Architectural Impact |
|---------|---------------------|
| **Error Handling** | Global error interceptor, standardized error responses, fallback UI patterns |
| **Authentication** | Route guards, token refresh middleware, Firebase SDK integration |
| **Loading States** | Skeleton components, optimistic updates, request cancellation |
| **State Management** | Angular signals for local state, service-based shared state |
| **API Patterns** | Consistent REST conventions, retry logic, timeout handling |
| **Logging & Monitoring** | Request tracing, error logging, performance metrics (future) |

### UX Architectural Implications

| UX Requirement | Technical Implication |
|----------------|----------------------|
| Custom design system (SCSS/BEM) | No component library dependency, full CSS control |
| Dark theme with purple accents | CSS custom properties for theming |
| 12 custom components | Component library architecture in Angular |
| Desktop-first responsive | CSS breakpoint system, mobile bottom nav |
| Inline editing + auto-save | Debounced save, optimistic updates |
| Skeleton loading | Component-level loading states |
| WCAG 2.1 A compliance | Semantic HTML, ARIA patterns, focus management |

## Starter Template Evaluation

### Primary Technology Domain

**Full-Stack Web SPA** — Angular 21 frontend with Express/TypeScript backend

### Existing Project Foundation

The Angular project is already initialized using Angular CLI 21.1.2 with modern defaults:

**Initialization Command Used:**
```bash
ng new kura-frontend --style=scss --routing --skip-tests=false
```

### Architectural Decisions Already Established

**Language & Runtime:**
- TypeScript 5.9.2 with strict mode
- Node.js runtime (npm 11.6.2)
- ES2022 target compilation

**Component Architecture:**
- Standalone components (no NgModules)
- Signals-first reactivity model
- 2025 file naming convention

**Styling Solution:**
- SCSS with inline style language support
- Component-scoped styles
- Global styles in `src/styles.scss`

**Build Tooling:**
- @angular/build (Vite + esbuild)
- Production optimization with budgets
- Source maps for development

**Testing Framework:**
- Vitest 4.0.8 (modern, fast test runner)
- JSDOM for DOM testing

**Code Organization:**
- Feature-based structure ready
- Lazy loading support via Router
- Environment-based configuration

### Required Configuration Additions

The following must be added to complete the architecture:

**1. Dependencies to Install:**
```bash
npm install lucide-angular @angular/fire firebase
```

**2. Provider Configuration (app.config.ts):**
```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([/* auth interceptor */])),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ]
};
```

**3. Angular Schematics Update (angular.json):**
```json
{
  "schematics": {
    "@schematics/angular:component": {
      "style": "scss",
      "inlineStyle": false,
      "inlineTemplate": false,
      "skipTests": false
    }
  }
}
```

**4. SCSS Architecture (to create):**
```
src/styles/
├── _variables.scss      # Design tokens
├── _mixins.scss         # Reusable patterns
├── _reset.scss          # CSS reset
├── _typography.scss     # Font definitions
├── _utilities.scss      # Helper classes
└── main.scss            # Entry point
```

### Starter Evaluation Summary

| Option | Decision | Rationale |
|--------|----------|-----------|
| Use existing project | ✅ Selected | Already initialized with Angular 21 best practices |
| Add SSR | ❌ Skip | CSR-only per PRD (dashboard app, no SEO needs) |
| Add PWA | ❌ Skip | Not required for MVP |
| Add @angular/fire | ✅ Add | Required for Firebase Authentication |
| Add lucide-angular | ✅ Add | Required per UX specification |

**Note:** Project initialization is complete. First implementation story should focus on installing dependencies and setting up the SCSS architecture.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Database ORM: Drizzle
- Authentication validation: Firebase Admin SDK
- State management: Services + Signals
- Deployment: Docker containers on VPS

**Important Decisions (Shape Architecture):**
- API response format: Direct data + HTTP status
- Feature organization: Feature modules
- Caching: In-memory for MVP

**Deferred Decisions (Post-MVP):**
- Redis caching (when scale requires)
- CDN for static assets
- Container orchestration (Kubernetes)

### Data Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **ORM** | Drizzle | Lightweight, excellent TypeScript types, SQL-like syntax |
| **Migrations** | Drizzle Kit | Built-in migration tooling |
| **Caching** | node-cache (in-memory) | Sufficient for MVP scale, no infrastructure overhead |
| **Connection Pooling** | Built-in pg pool | Standard PostgreSQL connection management |

**Data Models:**
- Users (Firebase UID, profile, onboarding data)
- Cards (generated content, status, timestamps)
- Schedules (card reference, publish time, LinkedIn status)
- Dismissals (card reference, feedback signal)

### Authentication & Security

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Auth Provider** | Firebase Authentication | Pre-decided in PRD |
| **Token Validation** | Firebase Admin SDK | Direct verification, no custom JWT infrastructure |
| **Route Protection** | Angular Guards + Express middleware | Client and server validation |
| **API Security** | Bearer token in Authorization header | Standard pattern |
| **Secrets Management** | Environment variables | Docker secrets / .env files |

**Auth Flow:**
1. User authenticates with Firebase (client)
2. Firebase ID token sent in Authorization header
3. Express middleware validates token via Firebase Admin SDK
4. User ID extracted and attached to request

### API & Communication Patterns

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **API Style** | REST | Simple, well-understood, fits CRUD operations |
| **Response Format** | Direct data + HTTP status codes | Clean, RESTful, no envelope overhead |
| **Error Format** | `{ error: string, code: string }` | Actionable errors with codes |
| **Validation** | Zod schemas | Runtime validation with TypeScript inference |

**API Conventions:**
```
GET    /api/cards           → List user's cards
POST   /api/cards/generate  → Generate new cards
GET    /api/cards/:id       → Get card details
PATCH  /api/cards/:id       → Update card content
DELETE /api/cards/:id       → Dismiss card

POST   /api/schedule        → Schedule a card
GET    /api/schedule        → List scheduled posts
DELETE /api/schedule/:id    → Cancel scheduled post

GET    /api/profile         → Get user profile
PATCH  /api/profile         → Update profile
POST   /api/profile/onboard → Complete onboarding
```

**Error Codes:**
- `UNAUTHORIZED` — Invalid/missing token
- `FORBIDDEN` — Valid token, insufficient permissions
- `NOT_FOUND` — Resource doesn't exist
- `VALIDATION_ERROR` — Invalid request data
- `GENERATION_FAILED` — AI generation error
- `LINKEDIN_ERROR` — LinkedIn API failure
- `RATE_LIMITED` — Too many requests

### Frontend Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **State Management** | Services + Signals | Right-sized for MVP, native Angular 21 |
| **Feature Organization** | Feature modules | Lazy loading, clear boundaries |
| **HTTP Layer** | HttpClient + interceptors | Auth token injection, error handling |
| **Forms** | Reactive Forms + Signals | Type-safe, reactive validation |

**Project Structure:**
```
src/app/
├── core/                    # Singleton services, guards, interceptors
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.guard.ts
│   │   └── auth.interceptor.ts
│   ├── api/
│   │   └── api.service.ts
│   └── core.providers.ts
├── shared/                  # Reusable components, pipes, directives
│   ├── components/
│   │   ├── card/
│   │   ├── button/
│   │   ├── toast/
│   │   └── ...
│   └── shared.module.ts
├── features/                # Feature modules (lazy loaded)
│   ├── auth/
│   │   ├── login/
│   │   └── auth.routes.ts
│   ├── onboarding/
│   │   ├── steps/
│   │   └── onboarding.routes.ts
│   ├── feed/
│   │   ├── card-list/
│   │   ├── card-detail/
│   │   └── feed.routes.ts
│   └── scheduling/
│       ├── scheduled-list/
│       └── scheduling.routes.ts
├── layouts/
│   ├── main-layout/
│   └── auth-layout/
└── app.routes.ts
```

**State Services:**
- `AuthService` — Firebase auth state, current user
- `CardService` — Card CRUD, generation, local cache
- `ScheduleService` — Scheduled posts management
- `ProfileService` — User profile, onboarding state
- `ToastService` — Global notifications

### Infrastructure & Deployment

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Hosting** | VPS (Docker containers) | Full control, predictable costs |
| **Containerization** | Docker + Docker Compose | Standard, portable deployment |
| **Reverse Proxy** | Nginx | SSL termination, static file serving |
| **CI/CD** | GitHub Actions | Automated build, test, deploy |
| **SSL** | Let's Encrypt (Certbot) | Free, automated certificates |

**Container Architecture:**
```yaml
services:
  nginx:
    # Reverse proxy + static files
    ports: ["80:80", "443:443"]

  frontend:
    # Angular static build served by nginx
    # (or built into nginx container)

  backend:
    # Express API server
    ports: ["3000"]
    environment:
      - DATABASE_URL
      - FIREBASE_CREDENTIALS
      - GEMINI_API_KEY
      - LINKEDIN_CLIENT_ID

  postgres:
    # PostgreSQL database
    volumes: ["postgres_data:/var/lib/postgresql/data"]
```

**Deployment Flow:**
1. Push to main branch
2. GitHub Actions triggers
3. Run tests (Vitest)
4. Build Angular production bundle
5. Build Docker images
6. Push to container registry
7. SSH to VPS, pull images, restart containers

### Decision Impact Analysis

**Implementation Sequence:**
1. SCSS architecture + design tokens
2. Core services (Auth, API)
3. Shared components (Card, Button, Toast)
4. Feature modules (Auth → Onboarding → Feed → Scheduling)
5. Backend API routes
6. Docker configuration
7. CI/CD pipeline

**Cross-Component Dependencies:**
- Auth interceptor must be configured before any API calls
- Card component depends on design tokens being defined
- Feature modules depend on shared components
- Backend routes depend on Drizzle schema being defined

## Implementation Patterns & Consistency Rules

### Naming Conventions

**Database (Drizzle + PostgreSQL):**
- Tables: `snake_case`, plural (`users`, `cards`, `scheduled_posts`)
- Columns: `snake_case` (`user_id`, `created_at`)
- Foreign keys: `{referenced_table}_id` (`user_id`, `card_id`)
- Indexes: `idx_{table}_{columns}` (`idx_users_email`)
- Enums: `PascalCase` in TypeScript (`CardStatus`)

**API (Express REST):**
- Endpoints: `kebab-case`, plural nouns (`/api/cards`, `/api/scheduled-posts`)
- Route params: `camelCase` (`/api/cards/:cardId`)
- Query params: `camelCase` (`?pageSize=10`)
- JSON fields: `camelCase` (`{ userId, createdAt }`)

**Angular Code:**
- Components: `PascalCase` class, `kebab-case` selector (`CardComponent`, `app-card`)
- Services: `PascalCase` + `Service` suffix (`CardService`)
- Files: `kebab-case` (`card.component.ts`)
- Signals: `camelCase` (`cards`, `isLoading`)
- CSS: BEM (`block__element--modifier`)

### File Organization

**Test Placement:**
- Unit tests: Co-located (`*.spec.ts` next to source)
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/`

**Import Order:**
1. Angular core imports
2. Angular module imports
3. Third-party libraries
4. Core services (`@core/`)
5. Shared components (`@shared/`)
6. Feature imports
7. Relative imports

### API Response Patterns

**Success Responses:**
```json
// Single resource
{ "id": "123", "content": "...", "createdAt": "2026-02-03T10:00:00Z" }

// Collection
[{ "id": "1" }, { "id": "2" }]

// Paginated
{ "items": [...], "total": 50, "page": 1, "pageSize": 10 }
```

**Error Responses:**
```json
{ "error": "Card not found", "code": "NOT_FOUND" }
```

**Date Format:** ISO 8601 strings in UTC (`2026-02-03T10:00:00Z`)

### State Management Patterns

**Signal Structure:**
```typescript
// Private writable, public readonly
private readonly _items = signal<T[]>([]);
readonly items = this._items.asReadonly();

// Loading/error state per service
readonly isLoading = signal(false);
readonly error = signal<string | null>(null);
```

**Service Methods:**
- `get{Resource}s()` — List resources
- `get{Resource}ById(id)` — Single resource
- `create{Resource}(data)` — Create
- `update{Resource}(id, data)` — Update
- `delete{Resource}(id)` — Delete

### Error Handling Patterns

**HTTP Errors:**
- Interceptor catches all HTTP errors
- Transforms to consistent error format
- Services expose error signal
- Components display via `<app-error-alert>`

**User Errors:**
- Validation errors shown inline on forms
- Toast notifications for action failures
- Error alerts for blocking errors with retry option

### Loading State Patterns

**Per-Service Loading:**
- Each service manages its own `isLoading` signal
- Set `true` before request, `false` in `finalize()`
- Components bind to service loading state

**Optimistic Updates:**
- Update UI immediately on user action
- Store original state for rollback
- Sync with server in background
- Rollback + toast on failure

### Enforcement Guidelines

**All AI Agents MUST:**
1. Follow naming conventions exactly (snake_case DB, camelCase API/code)
2. Co-locate unit tests with source files
3. Use signal pattern for service state (private writable, public readonly)
4. Return ISO 8601 dates from API
5. Use standardized error response format
6. Implement optimistic updates for dismiss/edit actions

**Pattern Verification:**
- ESLint rules enforce naming and import order
- PR review checklist includes pattern compliance
- Integration tests verify API response formats

