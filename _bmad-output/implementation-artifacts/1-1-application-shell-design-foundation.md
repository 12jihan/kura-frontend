# Story 1.1: Application Shell & Design Foundation

Status: done

---

## Story

As a user,
I want to see a professionally designed application shell with navigation,
So that I can understand the app structure and have a polished experience.

---

## Acceptance Criteria

### AC1: Dependencies Installation
**Given** the project repository is cloned
**When** dependencies are installed with `npm install`
**Then** lucide-angular, @angular/fire, and firebase packages are available
**And** no dependency conflicts or errors occur

### AC2: Dark Theme Application
**Given** the application is running
**When** I view any page
**Then** the dark theme (#0D0D0F background) is applied consistently
**And** purple accent color (#8B5CF6) is used for interactive elements
**And** Inter font family is loaded and applied

### AC3: SCSS Architecture Setup
**Given** the SCSS architecture is set up
**When** a developer creates a new component
**Then** design tokens are available via `@use` imports
**And** BEM naming convention is documented and enforced

### AC4: Desktop Sidebar Layout
**Given** I am on a desktop viewport (1024px+)
**When** I view the authenticated area
**Then** a fixed 240px sidebar is visible on the left
**And** the main content area fills the remaining width

### AC5: Sidebar Navigation
**Given** I am viewing the sidebar
**When** I look at the navigation
**Then** I see the Kura logo at the top
**And** navigation links for "Cards" and "Scheduled" are visible
**And** the user section shows avatar placeholder and logout option at the bottom

### AC6: Route Protection
**Given** I am not authenticated
**When** I try to access protected routes
**Then** I am redirected to the login page

---

## Tasks / Subtasks

- [x] **Task 1: Install Dependencies** (AC: #1)
  - [x] 1.1 Run `npm install lucide-angular @angular/fire firebase`
  - [x] 1.2 Verify no peer dependency conflicts
  - [x] 1.3 Update package.json scripts if needed

- [x] **Task 2: Configure Firebase Providers** (AC: #1, #6)
  - [x] 2.1 Create `src/environments/environment.ts` with Firebase config placeholder
  - [x] 2.2 Create `src/environments/environment.development.ts`
  - [x] 2.3 Update `src/app/app.config.ts` with Firebase providers
  - [x] 2.4 Add HttpClient provider with interceptor preparation

- [x] **Task 3: Set Up SCSS Architecture** (AC: #2, #3)
  - [x] 3.1 Create `src/styles/` directory structure
  - [x] 3.2 Create `_variables.scss` with all design tokens
  - [x] 3.3 Create `_mixins.scss` with reusable patterns
  - [x] 3.4 Create `_reset.scss` for CSS normalization
  - [x] 3.5 Create `_typography.scss` with Inter font loading
  - [x] 3.6 Create `_utilities.scss` with helper classes
  - [x] 3.7 Update `src/styles.scss` to import all partials
  - [x] 3.8 Apply global dark theme styles to body/html

- [x] **Task 4: Update Angular CLI Schematics** (AC: #3)
  - [x] 4.1 Update `angular.json` schematics for component generation
  - [x] 4.2 Set `inlineStyle: false`, `inlineTemplate: false`

- [x] **Task 5: Create Core Auth Infrastructure** (AC: #6)
  - [x] 5.1 Create `src/app/core/` directory
  - [x] 5.2 Create `src/app/core/auth/auth.service.ts` with Firebase auth state
  - [x] 5.3 Create `src/app/core/auth/auth.guard.ts` for route protection
  - [x] 5.4 Export core providers

- [x] **Task 6: Create Layout Components** (AC: #4, #5)
  - [x] 6.1 Create `src/app/layouts/main-layout/` component
  - [x] 6.2 Create `src/app/layouts/auth-layout/` component
  - [x] 6.3 Create `src/app/shared/components/sidebar/` component
  - [x] 6.4 Implement sidebar with logo, nav links, user section
  - [x] 6.5 Style sidebar with BEM and design tokens

- [x] **Task 7: Set Up Routing Structure** (AC: #4, #6)
  - [x] 7.1 Update `src/app/app.routes.ts` with layout-based routing
  - [x] 7.2 Add auth guard to protected routes
  - [x] 7.3 Create placeholder routes for Cards, Scheduled, Login
  - [x] 7.4 Set up lazy loading structure for features

- [x] **Task 8: Create Placeholder Pages** (AC: #4, #5)
  - [x] 8.1 Create `src/app/features/auth/login/` placeholder component
  - [x] 8.2 Create `src/app/features/feed/` placeholder component
  - [x] 8.3 Create `src/app/features/scheduling/` placeholder component

- [x] **Task 9: Write Tests** (AC: All)
  - [x] 9.1 Test auth guard redirects unauthenticated users
  - [x] 9.2 Test sidebar renders navigation links
  - [x] 9.3 Test main layout displays sidebar on desktop

---

## Dev Notes

### Critical Architecture Patterns

**State Management Pattern (from Architecture):**
```typescript
// Private writable, public readonly signals
private readonly _user = signal<User | null>(null);
readonly user = this._user.asReadonly();

readonly isLoading = signal(false);
readonly error = signal<string | null>(null);
```

**Component File Organization:**
- Each component MUST have separate files: `*.component.ts`, `*.component.html`, `*.component.scss`
- NO inline styles or templates
- Use standalone components (no NgModules)

**BEM Naming Convention:**
```scss
.sidebar { }                    // Block
.sidebar__logo { }              // Element
.sidebar__nav { }               // Element
.sidebar__link { }              // Element
.sidebar__link--active { }      // Modifier
.sidebar__user { }              // Element
```

### Project Structure Notes

**Create this directory structure:**
```
src/
├── app/
│   ├── core/                    # Singleton services, guards, interceptors
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   └── auth.guard.ts
│   │   └── index.ts
│   ├── shared/                  # Reusable components
│   │   └── components/
│   │       └── sidebar/
│   │           ├── sidebar.component.ts
│   │           ├── sidebar.component.html
│   │           └── sidebar.component.scss
│   ├── features/                # Feature modules (lazy loaded)
│   │   ├── auth/
│   │   │   └── login/
│   │   ├── feed/
│   │   └── scheduling/
│   ├── layouts/
│   │   ├── main-layout/
│   │   │   ├── main-layout.component.ts
│   │   │   ├── main-layout.component.html
│   │   │   └── main-layout.component.scss
│   │   └── auth-layout/
│   └── app.routes.ts
├── styles/
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── _reset.scss
│   ├── _typography.scss
│   ├── _utilities.scss
│   └── main.scss
└── environments/
    ├── environment.ts
    └── environment.development.ts
```

### Design Tokens Reference

**CRITICAL: Use these exact values from UX specification:**

```scss
// Colors - Dark Theme
$color-bg-primary: #0D0D0F;        // Page background
$color-bg-secondary: #1A1A1E;      // Card/surface backgrounds
$color-bg-tertiary: #252529;       // Elevated surfaces
$color-bg-input: #18181B;          // Form input backgrounds

// Borders
$color-border-accent: #8B5CF6;     // Purple accent (signature)
$color-border-subtle: #2A2A2E;     // Dividers, inactive borders
$color-border-hover: #3F3F46;      // Hover state borders

// Text
$color-text-primary: #F4F4F5;      // Primary content
$color-text-secondary: #A1A1AA;    // Secondary content
$color-text-muted: #71717A;        // Placeholders, disabled

// Accent & Status
$color-accent-primary: #8B5CF6;    // Primary actions
$color-accent-hover: #A78BFA;      // Hover states
$color-success: #22C55E;           // Success
$color-error: #EF4444;             // Errors

// Spacing Scale (4px base)
$spacing-1: 4px;
$spacing-2: 8px;
$spacing-3: 12px;
$spacing-4: 16px;
$spacing-5: 20px;
$spacing-6: 24px;
$spacing-8: 32px;

// Border Radius
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-full: 9999px;

// Typography
$font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

// Sidebar
$sidebar-width: 240px;
```

### Firebase Configuration

**app.config.ts setup:**
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([])),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ]
};
```

### Auth Guard Implementation

**Functional guard pattern (Angular 21):**
```typescript
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map(user => {
      if (user) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};
```

### Sidebar Component Specification

**Required Elements:**
1. Logo at top (text "Kura" or logo image)
2. Navigation section with links:
   - Cards (icon: `layout-grid` from Lucide)
   - Scheduled (icon: `calendar-clock` from Lucide)
3. User section at bottom:
   - Avatar placeholder (circle with user icon)
   - Logout button (icon: `log-out` from Lucide)

**Lucide Icons to Import:**
```typescript
import { LucideAngularModule, LayoutGrid, CalendarClock, LogOut, User } from 'lucide-angular';
```

### Responsive Breakpoints

```scss
$breakpoint-md: 768px;   // Tablet
$breakpoint-lg: 1024px;  // Desktop

@mixin mobile-only {
  @media (max-width: #{$breakpoint-md - 1px}) { @content; }
}

@mixin tablet-up {
  @media (min-width: $breakpoint-md) { @content; }
}

@mixin desktop-up {
  @media (min-width: $breakpoint-lg) { @content; }
}
```

### Accessibility Requirements

- Sidebar: `<nav>` with `aria-label="Main navigation"`
- Active nav link: `aria-current="page"`
- Icon buttons: `aria-label` for all icon-only buttons
- Focus visible: Purple outline ring on keyboard focus
- Skip link: Add `<a href="#main" class="skip-link">Skip to main content</a>`

### Testing Standards

- Co-locate tests: `*.spec.ts` next to source files
- Use Vitest (already configured)
- Test auth guard behavior
- Test component rendering

---

## References

- [Source: _bmad-output/planning-artifacts/architecture.md#Starter-Template-Evaluation] - Required dependencies and configuration
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture] - Project structure and patterns
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Design-System-Foundation] - Design tokens and BEM methodology
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component-Strategy] - Sidebar component specification
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive-Design-Accessibility] - Accessibility requirements
- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.1] - Acceptance criteria

---

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References
- Build successful with all dependencies installed
- All 13 tests passing

### Completion Notes List
- Installed lucide-angular@0.563.0, @angular/fire@21.0.0-rc.0, firebase@12.8.0
- Used @angular/fire@21.0.0-rc.0 to resolve Angular 21 compatibility
- Created SCSS architecture with design tokens per UX specification
- Implemented sidebar with BEM naming and accessibility attributes
- Auth guard uses functional pattern with observable
- All components use standalone pattern (no NgModules)

### File List
**Created:**
- src/environments/environment.ts
- src/environments/environment.development.ts
- src/styles/_variables.scss
- src/styles/_mixins.scss
- src/styles/_reset.scss
- src/styles/_typography.scss
- src/styles/_utilities.scss
- src/app/core/auth/auth.service.ts
- src/app/core/auth/auth.guard.ts
- src/app/core/auth/auth.guard.spec.ts
- src/app/core/index.ts
- src/app/shared/components/sidebar/sidebar.component.ts
- src/app/shared/components/sidebar/sidebar.component.html
- src/app/shared/components/sidebar/sidebar.component.scss
- src/app/shared/components/sidebar/sidebar.component.spec.ts
- src/app/layouts/main-layout/main-layout.component.ts
- src/app/layouts/main-layout/main-layout.component.html
- src/app/layouts/main-layout/main-layout.component.scss
- src/app/layouts/main-layout/main-layout.component.spec.ts
- src/app/layouts/auth-layout/auth-layout.component.ts
- src/app/layouts/auth-layout/auth-layout.component.html
- src/app/layouts/auth-layout/auth-layout.component.scss
- src/app/features/auth/login/login.component.ts
- src/app/features/auth/login/login.component.html
- src/app/features/auth/login/login.component.scss
- src/app/features/auth/auth.routes.ts
- src/app/features/feed/feed.component.ts
- src/app/features/feed/feed.component.html
- src/app/features/feed/feed.component.scss
- src/app/features/feed/feed.routes.ts
- src/app/features/scheduling/scheduling.component.ts
- src/app/features/scheduling/scheduling.component.html
- src/app/features/scheduling/scheduling.component.scss
- src/app/features/scheduling/scheduling.routes.ts

**Modified:**
- src/app/app.config.ts (added Firebase and HttpClient providers)
- src/app/app.routes.ts (layout-based routing with auth guard)
- src/styles.scss (imports SCSS architecture)
- angular.json (schematics for component generation)
- package.json (new dependencies)
