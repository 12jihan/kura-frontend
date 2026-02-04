# Story 1.2: User Registration

Status: done

---

## Story

As a new user,
I want to create an account with my email and password,
So that I can access the Kura application.

---

## Acceptance Criteria

### AC1: Registration Form Display
**Given** I am on the registration page
**When** I view the form
**Then** I see email and password input fields
**And** I see a "Create Account" button
**And** I see a link to the login page for existing users

### AC2: Successful Registration
**Given** I enter a valid email and password (min 8 characters)
**When** I click "Create Account"
**Then** a new account is created in Firebase Authentication
**And** I am automatically logged in
**And** I am redirected to the onboarding flow

### AC3: Duplicate Email Error
**Given** I enter an email that is already registered
**When** I click "Create Account"
**Then** I see an error message "An account with this email already exists"
**And** I remain on the registration page

### AC4: Invalid Email Validation
**Given** I enter an invalid email format
**When** I blur the email field or submit the form
**Then** I see an inline validation error "Please enter a valid email"

### AC5: Password Validation
**Given** I enter a password less than 8 characters
**When** I blur the password field or submit the form
**Then** I see an inline validation error "Password must be at least 8 characters"

### AC6: Loading State
**Given** registration is in progress
**When** the API call is pending
**Then** the button shows a loading state
**And** the form inputs are disabled

---

## Tasks / Subtasks

- [x] **Task 1: Create Registration Component** (AC: #1)
  - [x] 1.1 Create `src/app/features/auth/register/register.component.ts` with standalone component
  - [x] 1.2 Create `src/app/features/auth/register/register.component.html` with form layout
  - [x] 1.3 Create `src/app/features/auth/register/register.component.scss` with BEM styling
  - [x] 1.4 Add registration route to `src/app/features/auth/auth.routes.ts`

- [x] **Task 2: Implement Registration Form** (AC: #1, #4, #5)
  - [x] 2.1 Create reactive form with email and password controls
  - [x] 2.2 Add email validator (required + email format)
  - [x] 2.3 Add password validator (required + minLength 8)
  - [x] 2.4 Display inline validation errors on blur and submit
  - [x] 2.5 Add link to login page for existing users

- [x] **Task 3: Extend AuthService for Registration** (AC: #2, #3)
  - [x] 3.1 Add `register(email, password)` method to AuthService
  - [x] 3.2 Use `createUserWithEmailAndPassword` from Firebase Auth
  - [x] 3.3 Handle Firebase auth errors and map to user-friendly messages
  - [x] 3.4 Return appropriate error codes for duplicate email

- [x] **Task 4: Connect Form to AuthService** (AC: #2, #3, #6)
  - [x] 4.1 Inject AuthService into register component
  - [x] 4.2 Call register on form submit
  - [x] 4.3 Handle success: redirect to onboarding (placeholder route)
  - [x] 4.4 Handle errors: display error message in form
  - [x] 4.5 Implement loading state (disable form, show spinner in button)

- [x] **Task 5: Create Shared Form Input Component** (AC: #1, #4, #5)
  - [x] 5.1 Create `src/app/shared/components/form-input/` component
  - [x] 5.2 Support text and password input types
  - [x] 5.3 Display label, hint text, and error messages
  - [x] 5.4 Style with BEM methodology and design tokens

- [x] **Task 6: Create Button Component** (AC: #1, #6)
  - [x] 6.1 Create `src/app/shared/components/button/` component
  - [x] 6.2 Support primary and secondary variants
  - [x] 6.3 Support loading state with spinner
  - [x] 6.4 Support disabled state
  - [x] 6.5 Style with BEM methodology and design tokens

- [x] **Task 7: Write Tests** (AC: All)
  - [x] 7.1 Test registration form renders with required fields
  - [x] 7.2 Test email validation shows error for invalid format
  - [x] 7.3 Test password validation shows error for short passwords
  - [x] 7.4 Test successful registration calls AuthService and redirects
  - [x] 7.5 Test error handling displays Firebase errors
  - [x] 7.6 Test loading state disables form

---

## Dev Notes

### Critical Architecture Patterns

**State Management Pattern (from Architecture):**
```typescript
// Private writable, public readonly signals
private readonly _isRegistering = signal(false);
readonly isRegistering = this._isRegistering.asReadonly();

readonly error = signal<string | null>(null);
```

**Component File Organization:**
- Each component MUST have separate files: `*.component.ts`, `*.component.html`, `*.component.scss`
- NO inline styles or templates
- Use standalone components (no NgModules)

**BEM Naming Convention:**
```scss
.register-form { }                // Block
.register-form__field { }         // Element
.register-form__actions { }       // Element
.register-form__link { }          // Element
.register-form--loading { }       // Modifier
```

### Firebase Auth Implementation

**Registration Method:**
```typescript
import { createUserWithEmailAndPassword, AuthError } from '@angular/fire/auth';

async register(email: string, password: string): Promise<void> {
  this.isLoading.set(true);
  this.error.set(null);

  try {
    await createUserWithEmailAndPassword(this.auth, email, password);
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

**Firebase Error Mapping:**
```typescript
private mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/invalid-email':
      return 'Please enter a valid email';
    case 'auth/weak-password':
      return 'Password must be at least 8 characters';
    case 'auth/operation-not-allowed':
      return 'Registration is currently disabled';
    default:
      return 'Registration failed. Please try again.';
  }
}
```

### Form Input Component Specification

**Required Props:**
- `label: string` - Input label text
- `type: 'text' | 'email' | 'password'` - Input type
- `control: FormControl` - Reactive form control
- `hint?: string` - Optional hint text below input
- `errorMessages: Record<string, string>` - Validation error messages

**BEM Structure:**
```scss
.form-input { }
.form-input__label { }
.form-input__field { }
.form-input__hint { }
.form-input__error { }
.form-input--error { }
.form-input--disabled { }
```

### Button Component Specification

**Required Props:**
- `type: 'button' | 'submit'` - Button type
- `variant: 'primary' | 'secondary' | 'ghost'` - Visual variant
- `loading: boolean` - Show loading spinner
- `disabled: boolean` - Disable button

**BEM Structure:**
```scss
.btn { }
.btn--primary { }
.btn--secondary { }
.btn--loading { }
.btn__spinner { }
.btn__text { }
```

### Design Tokens Reference

**From UX Specification - Use these exact values:**
```scss
// Form Input Styles
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

// Spacing
$spacing-2: 8px;
$spacing-3: 12px;
$spacing-4: 16px;
$spacing-6: 24px;

// Border Radius
$radius-sm: 4px;
$radius-md: 8px;
```

### Routing Setup

**Add to auth.routes.ts:**
```typescript
export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
```

### Accessibility Requirements

- Form inputs must have proper label associations
- Error messages must have `role="alert"`
- Focus should move to first error on submit
- Button loading state should announce to screen readers
- Form must be navigable via keyboard

### Testing Standards

- Co-locate tests: `*.spec.ts` next to source files
- Use Vitest (already configured)
- Test form validation behavior
- Test AuthService integration with mocked Firebase
- Test loading and error states

---

## References

- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication-Security] - Firebase Auth patterns
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture] - State management with signals
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Form-Patterns] - Form validation and UX
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Custom-Components] - Button and Form Input specs
- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.2] - Acceptance criteria

---

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References
- Fixed SCSS deprecation warning: Replaced `darken()` with `color.adjust()` in button.component.scss
- Fixed test infrastructure: Rewrote tests to use Angular TestBed + Vitest (project doesn't use @testing-library/angular)
- Fixed ExpressionChangedAfterItHasBeenCheckedError: Set component inputs before first detectChanges() call
- Fixed RouterLink test error: Use provideRouter([]) and spy on Router.navigate instead of mocking entire Router

### Completion Notes List
- All 7 tasks completed with all subtasks
- All 6 acceptance criteria satisfied
- 54 tests passing (14 new tests for RegisterComponent, 15 for ButtonComponent, 12 for FormInputComponent)
- Build successful with no errors
- FormInput component implements ControlValueAccessor for reactive form integration
- Button component supports primary/secondary/ghost variants with loading spinner using lucide-angular
- Registration redirects to /cards (placeholder for onboarding in Epic 2)

### File List
**Created:**
- src/app/features/auth/register/register.component.ts
- src/app/features/auth/register/register.component.html
- src/app/features/auth/register/register.component.scss
- src/app/features/auth/register/register.component.spec.ts
- src/app/shared/components/form-input/form-input.component.ts
- src/app/shared/components/form-input/form-input.component.html
- src/app/shared/components/form-input/form-input.component.scss
- src/app/shared/components/form-input/form-input.component.spec.ts
- src/app/shared/components/button/button.component.ts
- src/app/shared/components/button/button.component.html
- src/app/shared/components/button/button.component.scss
- src/app/shared/components/button/button.component.spec.ts

**Modified:**
- src/app/core/auth/auth.service.ts (added register method and mapFirebaseError)
- src/app/features/auth/auth.routes.ts (added register route)
