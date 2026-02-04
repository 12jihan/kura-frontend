# Story 1.5: Password Reset

Status: ready-for-dev

---

## Story

As a user who forgot my password,
I want to reset it via email,
So that I can regain access to my account.

---

## Acceptance Criteria

### AC1: Navigation from Login Page
**Given** I am on the login page
**When** I click "Forgot password?"
**Then** I am navigated to the password reset page

### AC2: Password Reset Form Display
**Given** I am on the password reset page
**When** I view the form
**Then** I see an email input field
**And** I see a "Send Reset Link" button
**And** I see a link to return to the login page

### AC3: Successful Reset Request
**Given** I enter a valid registered email
**When** I click "Send Reset Link"
**Then** Firebase sends a password reset email
**And** I see a confirmation message "Reset link sent! Check your email."
**And** I see a link to return to the login page

### AC4: Security for Unregistered Emails
**Given** I enter an email that is not registered
**When** I click "Send Reset Link"
**Then** I still see "Reset link sent! Check your email." (for security)
**And** no error is shown to prevent email enumeration

### AC5: Email Validation
**Given** I enter an invalid email format
**When** I blur the field or submit
**Then** I see an inline validation error "Please enter a valid email"

### AC6: Loading State
**Given** the reset email request is in progress
**When** the API call is pending
**Then** the button shows a loading state
**And** the form input is disabled

---

## Tasks / Subtasks

- [ ] **Task 1: Add sendPasswordResetEmail Method to AuthService** (AC: #3, #4)
  - [ ] 1.1 Import `sendPasswordResetEmail` from `@angular/fire/auth`
  - [ ] 1.2 Add `sendPasswordResetEmail(email: string)` method to AuthService
  - [ ] 1.3 Handle Firebase errors and always return success (security - AC#4)
  - [ ] 1.4 Add unit tests for the new method

- [ ] **Task 2: Update Password Reset Component** (AC: #2, #3, #5, #6)
  - [ ] 2.1 Add ReactiveFormsModule and FormBuilder
  - [ ] 2.2 Create form with email control and validators
  - [ ] 2.3 Add `isSubmitting` and `isSubmitted` signals
  - [ ] 2.4 Create `onSubmit()` method that calls AuthService
  - [ ] 2.5 Disable form during submission (AC#6)

- [ ] **Task 3: Update Password Reset Template** (AC: #2, #3)
  - [ ] 3.1 Add form with `app-form-input` for email
  - [ ] 3.2 Add `app-button` with loading state
  - [ ] 3.3 Show success message when `isSubmitted()` is true
  - [ ] 3.4 Hide form and show success state after submission
  - [ ] 3.5 Include "Back to login" link in both states

- [ ] **Task 4: Update Password Reset Styles** (AC: #2)
  - [ ] 4.1 Add `.password-reset__form` styles
  - [ ] 4.2 Add `.password-reset__success` styles for success state
  - [ ] 4.3 Add `.password-reset__success-icon` for checkmark icon
  - [ ] 4.4 Ensure consistent styling with login/register forms

- [ ] **Task 5: Verify Navigation (AC: #1)**
  - [ ] 5.1 Confirm "Forgot password?" link in login page navigates to /password-reset
  - [ ] 5.2 Confirm route exists in app.routes.ts

- [ ] **Task 6: Write Tests** (AC: All)
  - [ ] 6.1 Test form renders with email input and submit button
  - [ ] 6.2 Test email validation shows error for invalid format
  - [ ] 6.3 Test successful submission calls AuthService.sendPasswordResetEmail
  - [ ] 6.4 Test success message displayed after submission
  - [ ] 6.5 Test loading state disables form
  - [ ] 6.6 Test back to login link is present in both states

---

## Dev Notes

### Critical Architecture Patterns

**Follow the Established Pattern from Login Component:**

The password reset form is simpler than login - only one field (email). Follow the same structure:

```typescript
// Component structure following LoginComponent pattern
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
// Use signals for reactive state
readonly isSubmitting = signal(false);
readonly isSubmitted = signal(false); // NEW: Track if form was submitted successfully
```

### Firebase Password Reset Implementation

**Add to AuthService (auth.service.ts):**
```typescript
import { sendPasswordResetEmail } from '@angular/fire/auth';

async sendPasswordResetEmail(email: string): Promise<void> {
  this.isLoading.set(true);
  this.error.set(null);

  try {
    await sendPasswordResetEmail(this.auth, email);
    // Success - Firebase sends the email
  } catch (err) {
    // IMPORTANT: For security, we don't expose whether the email exists
    // Log the error internally but don't show to user
    console.error('Password reset error:', err);
    // Don't set error or throw - always appear successful (AC#4)
  } finally {
    this.isLoading.set(false);
  }
}
```

**SECURITY REQUIREMENT (AC#4):**
The method should NEVER indicate whether an email exists in the system. Always show success message to prevent email enumeration attacks.

### Password Reset Component Implementation

**Component Logic:**
```typescript
readonly resetForm: FormGroup = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
});

readonly emailErrorMessages: Record<string, string> = {
  required: 'Email is required',
  email: 'Please enter a valid email',
};

get emailControl() {
  return this.resetForm.get('email');
}

async onSubmit(): Promise<void> {
  if (this.resetForm.invalid) {
    this.resetForm.markAllAsTouched();
    return;
  }

  this.isSubmitting.set(true);
  this.resetForm.disable();

  const { email } = this.resetForm.getRawValue();

  try {
    await this.authService.sendPasswordResetEmail(email);
    this.isSubmitted.set(true); // Show success state
  } finally {
    this.isSubmitting.set(false);
    // Don't re-enable form - keep showing success state
  }
}
```

### Template Structure

**Two-State UI:**
```html
<div class="password-reset">
  <h2 class="password-reset__title">Reset your password</h2>

  @if (!isSubmitted()) {
    <!-- FORM STATE -->
    <p class="password-reset__subtitle">
      Enter your email address and we'll send you a link to reset your password.
    </p>

    <form class="password-reset__form" [formGroup]="resetForm" (ngSubmit)="onSubmit()">
      <app-form-input
        label="Email"
        type="email"
        placeholder="you@example.com"
        inputId="reset-email"
        formControlName="email"
        [control]="$any(emailControl)"
        [errorMessages]="emailErrorMessages"
      ></app-form-input>

      <app-button
        type="submit"
        variant="primary"
        [loading]="isSubmitting()"
        [disabled]="isSubmitting()"
        [fullWidth]="true"
      >
        Send Reset Link
      </app-button>
    </form>
  } @else {
    <!-- SUCCESS STATE -->
    <div class="password-reset__success">
      <lucide-icon [img]="checkCircleIcon" class="password-reset__success-icon"></lucide-icon>
      <p class="password-reset__success-message">Reset link sent! Check your email.</p>
    </div>
  }

  <p class="password-reset__footer">
    <a class="password-reset__link" routerLink="/login">Back to login</a>
  </p>
</div>
```

### BEM Naming Convention

```scss
.password-reset { }                    // Block
.password-reset__title { }             // Element
.password-reset__subtitle { }          // Element
.password-reset__form { }              // Element
.password-reset__success { }           // Element (success state container)
.password-reset__success-icon { }      // Element
.password-reset__success-message { }   // Element
.password-reset__footer { }            // Element
.password-reset__link { }              // Element
```

### Shared Components to Use

- `FormInputComponent` - `src/app/shared/components/form-input/`
- `ButtonComponent` - `src/app/shared/components/button/`
- Use `lucide-angular` for success checkmark icon (`CheckCircle2`)

### Design Tokens Reference

```scss
// From existing password-reset.component.scss
$color-text-primary: #F4F4F5;
$color-text-secondary: #A1A1AA;
$color-text-muted: #71717A;
$color-accent-primary: #8B5CF6;
$color-accent-hover: #A78BFA;
$color-bg-secondary: #1A1A1E;
$color-success: #22C55E;  // For success icon

// Spacing
$spacing-2: 8px;
$spacing-4: 16px;
$spacing-6: 24px;

// Typography
$font-size-sm: 14px;
$font-size-2xl: 24px;
```

### Testing Standards

**Vitest patterns from previous stories:**
```typescript
describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let mockAuthService: { sendPasswordResetEmail: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockAuthService = {
      sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [PasswordResetComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    // ... setup
  });

  it('should call AuthService.sendPasswordResetEmail on valid submit', async () => {
    component.resetForm.setValue({ email: 'test@example.com' });
    await component.onSubmit();
    expect(mockAuthService.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should show success message after submission', async () => {
    component.resetForm.setValue({ email: 'test@example.com' });
    await component.onSubmit();
    expect(component.isSubmitted()).toBe(true);
  });
});
```

---

## Previous Story Intelligence

### Learnings from Story 1.4 (User Logout)

**Patterns to Follow:**
1. Use Vitest `vi.fn()` for mocking services
2. Use `provideRouter([])` for testing routing
3. Test both success and error scenarios
4. Accessibility: add `aria-*` attributes for screen readers
5. AuthService methods should use try/catch with proper error handling

**Debug Issues from Story 1.4:**
- AuthService methods should re-throw errors when appropriate (but NOT for password reset per AC#4)
- Always be consistent with text vs aria-labels

### AuthService Methods Available
- `register(email, password)` - Implemented
- `login(email, password)` - Implemented
- `logout()` - Implemented
- `sendPasswordResetEmail(email)` - **TO BE IMPLEMENTED**
- `user$` Observable - Available
- `isAuthenticated` getter - Available

### Existing Components
- `FormInputComponent` - Ready to use
- `ButtonComponent` - Ready to use with loading state
- `PasswordResetComponent` - Placeholder exists, needs implementation

### Existing Route Configuration
Password reset route exists in `app.routes.ts`:
```typescript
{
  path: 'password-reset',
  loadComponent: () =>
    import('./features/auth/password-reset/password-reset.component').then(
      (m) => m.PasswordResetComponent
    ),
}
```

---

## References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.5] - Acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication-Security] - Auth patterns
- [Source: _bmad-output/implementation-artifacts/1-3-user-login.md] - Login component patterns
- [Source: _bmad-output/implementation-artifacts/1-4-user-logout.md] - Previous story patterns

---

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
