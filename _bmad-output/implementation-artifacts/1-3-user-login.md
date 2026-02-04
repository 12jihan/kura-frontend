# Story 1.3: User Login

Status: done

---

## Story

As a returning user,
I want to log in to my existing account,
So that I can access my generated content cards.

---

## Acceptance Criteria

### AC1: Login Form Display
**Given** I am on the login page
**When** I view the form
**Then** I see email and password input fields
**And** I see a "Log In" button
**And** I see a "Forgot password?" link
**And** I see a link to register for new users

### AC2: Successful Login
**Given** I enter valid credentials for an existing account
**When** I click "Log In"
**Then** I am authenticated via Firebase
**And** the auth token is stored securely
**And** I am redirected to the card feed (or onboarding if not complete)

### AC3: Invalid Credentials Error
**Given** I enter incorrect credentials
**When** I click "Log In"
**Then** I see an error message "Invalid email or password"
**And** the password field is cleared
**And** I remain on the login page

### AC4: Already Logged In Redirect
**Given** I am already logged in
**When** I navigate to the login page
**Then** I am automatically redirected to the card feed

### AC5: Session Expiration Handling
**Given** my session expires or token is invalid
**When** I make an authenticated API request
**Then** the auth interceptor detects the 401 response
**And** I am redirected to the login page
**And** a toast notification says "Session expired. Please log in again."

### AC6: Loading State
**Given** login is in progress
**When** the API call is pending
**Then** the button shows a loading state
**And** the form inputs are disabled

---

## Tasks / Subtasks

- [x] **Task 1: Implement Login Component** (AC: #1)
  - [x] 1.1 Update `src/app/features/auth/login/login.component.ts` with login logic
  - [x] 1.2 Update `src/app/features/auth/login/login.component.html` with form layout
  - [x] 1.3 Update `src/app/features/auth/login/login.component.scss` with BEM styling

- [x] **Task 2: Implement Login Form** (AC: #1, #3)
  - [x] 2.1 Create reactive form with email and password controls
  - [x] 2.2 Add email validator (required + email format)
  - [x] 2.3 Add password validator (required)
  - [x] 2.4 Display inline validation errors on blur and submit
  - [x] 2.5 Add "Forgot password?" link to password reset page
  - [x] 2.6 Add link to register page for new users

- [x] **Task 3: Extend AuthService for Login** (AC: #2, #3)
  - [x] 3.1 Add `login(email, password)` method to AuthService
  - [x] 3.2 Use `signInWithEmailAndPassword` from Firebase Auth
  - [x] 3.3 Handle Firebase auth errors and map to user-friendly messages
  - [x] 3.4 Clear password on error (component responsibility)

- [x] **Task 4: Connect Form to AuthService** (AC: #2, #3, #6)
  - [x] 4.1 Inject AuthService into login component
  - [x] 4.2 Call login on form submit
  - [x] 4.3 Handle success: redirect to card feed (/cards)
  - [x] 4.4 Handle errors: display error message, clear password field
  - [x] 4.5 Implement loading state (disable form, show spinner in button)

- [x] **Task 5: Implement Redirect for Logged-In Users** (AC: #4)
  - [x] 5.1 Create `noAuthGuard` (redirects authenticated users away from login/register)
  - [x] 5.2 Apply noAuthGuard to login and register routes
  - [x] 5.3 Redirect authenticated users to /cards

- [x] **Task 6: Implement Auth Interceptor for Session Expiration** (AC: #5)
  - [x] 6.1 Create `src/app/core/auth/auth.interceptor.ts` as functional interceptor
  - [x] 6.2 Intercept 401 responses and redirect to login
  - [x] 6.3 Inject Toast notification "Session expired. Please log in again."
  - [x] 6.4 Register interceptor in app.config.ts

- [x] **Task 7: Create Toast Service** (AC: #5)
  - [x] 7.1 Create `src/app/core/services/toast.service.ts`
  - [x] 7.2 Implement signal-based toast state management
  - [x] 7.3 Support success, error, and info toast types
  - [x] 7.4 Auto-dismiss success/info toasts after 4 seconds
  - [x] 7.5 Create `src/app/shared/components/toast/toast.component.ts`
  - [x] 7.6 Position toasts bottom-right, stack up to 3

- [x] **Task 8: Add Password Reset Route Placeholder** (AC: #1)
  - [x] 8.1 Create placeholder password-reset component
  - [x] 8.2 Add route to auth.routes.ts
  - [x] 8.3 Ensure "Forgot password?" link navigates correctly

- [x] **Task 9: Write Tests** (AC: All)
  - [x] 9.1 Test login form renders with required fields
  - [x] 9.2 Test email validation shows error for invalid format
  - [x] 9.3 Test successful login calls AuthService and redirects
  - [x] 9.4 Test error handling displays Firebase errors and clears password
  - [x] 9.5 Test loading state disables form
  - [x] 9.6 Test noAuthGuard redirects authenticated users
  - [x] 9.7 Test auth interceptor handles 401 and shows toast

---

## Dev Notes

### Critical Architecture Patterns

**Follow the Established Pattern from Story 1.2:**
The registration component established the patterns for auth forms. Follow the same structure:

```typescript
// Component structure from RegisterComponent
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
```

**State Management Pattern:**
```typescript
// Private writable, public readonly signals
readonly isSubmitting = signal(false);
readonly submitError = signal<string | null>(null);
```

**Component File Organization:**
- Each component MUST have separate files: `*.component.ts`, `*.component.html`, `*.component.scss`
- NO inline styles or templates
- Use standalone components (no NgModules)

**BEM Naming Convention:**
```scss
.login { }                // Block
.login__title { }         // Element
.login__subtitle { }      // Element
.login__form { }          // Element
.login__error { }         // Element
.login__footer { }        // Element
.login__link { }          // Element
.login--loading { }       // Modifier
```

### Firebase Auth Implementation

**Login Method (add to AuthService):**
```typescript
import { signInWithEmailAndPassword, AuthError } from '@angular/fire/auth';

async login(email: string, password: string): Promise<void> {
  this.isLoading.set(true);
  this.error.set(null);

  try {
    await signInWithEmailAndPassword(this.auth, email, password);
    // User will be automatically set via authState subscription
  } catch (err) {
    const authError = err as AuthError;
    this.error.set(this.mapFirebaseError(authError.code));
    throw err;
  } finally {
    this.isLoading.set(false);
  }
}
```

**Add Error Mappings to mapFirebaseError:**
```typescript
case 'auth/user-not-found':
case 'auth/wrong-password':
case 'auth/invalid-credential':
  return 'Invalid email or password';
case 'auth/user-disabled':
  return 'This account has been disabled';
case 'auth/too-many-requests':
  return 'Too many failed attempts. Please try again later.';
```

### No-Auth Guard Implementation

**Create noAuthGuard for redirecting logged-in users:**
```typescript
// src/app/core/auth/no-auth.guard.ts
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs';

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map((user) => {
      if (user) {
        // User is already logged in, redirect to cards
        router.navigate(['/cards']);
        return false;
      }
      return true;
    })
  );
};
```

**Update auth.routes.ts:**
```typescript
export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [noAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
    canActivate: [noAuthGuard],
  },
  {
    path: 'password-reset',
    loadComponent: () =>
      import('./password-reset/password-reset.component').then((m) => m.PasswordResetComponent),
  },
];
```

### Auth Interceptor Implementation

**Create functional interceptor (Angular 21 pattern):**
```typescript
// src/app/core/auth/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastService.error('Session expired. Please log in again.');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
```

**Register in app.config.ts:**
```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... existing providers
    provideHttpClient(withInterceptors([authInterceptor])),
  ]
};
```

### Toast Service Implementation

**Signal-based toast service:**
```typescript
// src/app/core/services/toast.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = computed(() => this._toasts().slice(-3)); // Max 3 visible

  success(message: string): void {
    this.addToast('success', message, true);
  }

  error(message: string): void {
    this.addToast('error', message, false); // Errors don't auto-dismiss
  }

  info(message: string): void {
    this.addToast('info', message, true);
  }

  dismiss(id: string): void {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  private addToast(type: Toast['type'], message: string, autoDismiss: boolean): void {
    const id = crypto.randomUUID();
    this._toasts.update(toasts => [...toasts, { id, type, message }]);

    if (autoDismiss) {
      setTimeout(() => this.dismiss(id), 4000);
    }
  }
}
```

### Toast Component Specification

**BEM Structure:**
```scss
.toast-container { }           // Fixed bottom-right container
.toast { }                     // Individual toast
.toast--success { }
.toast--error { }
.toast--info { }
.toast__icon { }
.toast__message { }
.toast__dismiss { }
```

**Accessibility:**
- Success/info toasts: `role="status"` with `aria-live="polite"`
- Error toasts: `role="alert"` with `aria-live="assertive"`
- Dismiss button: `aria-label="Dismiss notification"`

### Design Tokens Reference

**From UX Specification - Use these exact values:**
```scss
// Form Input Styles (same as registration)
$color-bg-input: #18181B;
$color-border-subtle: #2A2A2E;
$color-border-accent: #8B5CF6;
$color-text-primary: #F4F4F5;
$color-text-secondary: #A1A1AA;
$color-text-muted: #71717A;
$color-error: #EF4444;

// Button Styles
$color-accent-primary: #8B5CF6;
$color-accent-hover: #A78BFA;

// Toast Styles
$color-success: #22C55E;
$color-bg-secondary: #1A1A1E;

// Spacing
$spacing-2: 8px;
$spacing-3: 12px;
$spacing-4: 16px;
$spacing-6: 24px;

// Border Radius
$radius-sm: 4px;
$radius-md: 8px;
```

### Password Field Clearing on Error

**Important UX Requirement (AC#3):**
On login error, the password field must be cleared but email should be preserved:
```typescript
async onSubmit(): Promise<void> {
  // ... validation logic

  try {
    await this.authService.login(email, password);
    await this.router.navigate(['/cards']);
  } catch {
    this.submitError.set(this.authService.error());
    // Clear password field on error
    this.loginForm.get('password')?.setValue('');
    this.loginForm.get('password')?.markAsUntouched();
  } finally {
    this.isSubmitting.set(false);
  }
}
```

### Existing Shared Components

**Reuse from Story 1.2:**
- `FormInputComponent` - `src/app/shared/components/form-input/`
- `ButtonComponent` - `src/app/shared/components/button/`

Both components are already created and tested. Import and use them directly.

### Routing Considerations

- Login route: `/login`
- Register route: `/register`
- Password reset route: `/password-reset` (placeholder)
- Cards feed route: `/cards` (redirect target)

### Testing Standards

- Co-locate tests: `*.spec.ts` next to source files
- Use Vitest (already configured)
- Test form validation behavior
- Test AuthService integration with mocked Firebase
- Test loading and error states
- Test guard redirects
- Test interceptor 401 handling

---

## Previous Story Intelligence

### Learnings from Story 1.2 (User Registration)

**Pattern Established:**
1. Separate component files (ts/html/scss) - strictly enforced
2. Use `$any()` cast for FormControl in template: `[control]="$any(emailControl)"`
3. Error messages in template use `role="alert"` for accessibility
4. Loading state disables form and shows spinner in button
5. RouterLink used for navigation between auth pages

**Debug Issues Resolved:**
- SCSS deprecation: Use `color.adjust()` instead of `darken()`
- Tests: Use Angular TestBed + Vitest (not @testing-library/angular)
- ExpressionChangedAfterItHasBeenCheckedError: Set inputs before first `detectChanges()`
- RouterLink tests: Use `provideRouter([])` and spy on `Router.navigate`

**File Structure Pattern:**
```
src/app/features/auth/
├── login/
│   ├── login.component.ts
│   ├── login.component.html
│   ├── login.component.scss
│   └── login.component.spec.ts
├── register/
│   ├── register.component.ts
│   ├── register.component.html
│   ├── register.component.scss
│   └── register.component.spec.ts
├── password-reset/
│   ├── password-reset.component.ts
│   ├── password-reset.component.html
│   ├── password-reset.component.scss
│   └── password-reset.component.spec.ts
└── auth.routes.ts
```

### Existing AuthService Methods
- `register(email, password)` - already implemented
- `logout()` - already implemented
- `mapFirebaseError(code)` - already implemented (needs login error codes added)
- `user$` Observable - already implemented
- `isAuthenticated` getter - already implemented

---

## References

- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication-Security] - Firebase Auth patterns
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture] - State management with signals
- [Source: _bmad-output/planning-artifacts/architecture.md#API-Communication-Patterns] - Interceptor patterns
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Form-Patterns] - Form validation and UX
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Toast-Notification-Component] - Toast specs
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Feedback-Patterns] - Error feedback patterns
- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.3] - Acceptance criteria
- [Source: _bmad-output/implementation-artifacts/1-2-user-registration.md] - Previous story patterns

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Fixed `$shadow-lg` undefined variable in toast.component.scss - replaced with inline CSS shadow
- Fixed Vitest test patterns: Removed Angular `fakeAsync`/`tick` in favor of Vitest `vi.useFakeTimers()`/`vi.advanceTimersByTime()`
- Fixed TypeScript typing in no-auth.guard.spec.ts for Observable types
- Updated app.spec.ts to test new template structure (router-outlet + toast component)

### Completion Notes List

- All 9 tasks completed successfully
- All 108 tests passing (after review fixes)
- Build compiles without errors
- Followed established patterns from Story 1.2 (registration component)
- Toast component uses inline shadow value instead of undefined variable

### Senior Developer Review (AI)

**Review Date:** 2026-02-04
**Reviewer:** Claude Opus 4.5 (Adversarial Code Review)

**Issues Found & Fixed:**

| Severity | Issue | Status |
|----------|-------|--------|
| HIGH | noAuthGuard not wired to routes in app.routes.ts | ✅ FIXED |
| HIGH | Register and password-reset routes inaccessible | ✅ FIXED |
| HIGH | Story File List missing app.routes.ts | ✅ FIXED |
| MEDIUM | Files changed but not documented | ✅ FIXED |
| MEDIUM | AC#6 form inputs not disabled during loading | ✅ FIXED |
| MEDIUM | Form accessibility missing aria-describedby | ✅ FIXED |
| LOW | Inconsistent route configuration pattern | Noted |
| LOW | Password-reset doesn't use noAuthGuard | Noted (design decision) |

**Changes Made During Review:**
1. Updated `app.routes.ts` to import and apply `noAuthGuard` to login route
2. Added register and password-reset routes to `app.routes.ts`
3. Modified `login.component.ts` to disable form during submission (`loginForm.disable()`)
4. Modified `login.component.ts` to re-enable form after error (`loginForm.enable()`)
5. Added `aria-describedby` and `aria-live="assertive"` to login form error message
6. Added 2 new tests: form disabled during login, form re-enabled after error
7. Updated story File List to include `app.routes.ts`

**Review Outcome:** APPROVED with fixes applied

### File List

**Created:**
- `src/app/features/auth/login/login.component.ts`
- `src/app/features/auth/login/login.component.html`
- `src/app/features/auth/login/login.component.scss`
- `src/app/features/auth/login/login.component.spec.ts`
- `src/app/core/auth/no-auth.guard.ts`
- `src/app/core/auth/no-auth.guard.spec.ts`
- `src/app/core/auth/auth.interceptor.ts`
- `src/app/core/auth/auth.interceptor.spec.ts`
- `src/app/core/services/toast.service.ts`
- `src/app/core/services/toast.service.spec.ts`
- `src/app/shared/components/toast/toast.component.ts`
- `src/app/shared/components/toast/toast.component.html`
- `src/app/shared/components/toast/toast.component.scss`
- `src/app/shared/components/toast/toast.component.spec.ts`
- `src/app/features/auth/password-reset/password-reset.component.ts`
- `src/app/features/auth/password-reset/password-reset.component.html`
- `src/app/features/auth/password-reset/password-reset.component.scss`
- `src/app/features/auth/password-reset/password-reset.component.spec.ts`

**Modified:**
- `src/app/core/auth/auth.service.ts` - Added login() method and error mappings
- `src/app/features/auth/auth.routes.ts` - Added noAuthGuard and password-reset route (reference file)
- `src/app/app.routes.ts` - Added noAuthGuard to login, added register/password-reset routes
- `src/app/app.config.ts` - Registered authInterceptor
- `src/app/app.ts` - Added ToastComponent import
- `src/app/app.html` - Added <app-toast /> component
- `src/app/app.spec.ts` - Updated tests for new template

