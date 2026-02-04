# Story 1.4: User Logout

Status: done

---

## Story

As a logged-in user,
I want to log out of my account,
So that I can secure my session when I'm done.

---

## Acceptance Criteria

### AC1: Logout Button Visibility
**Given** I am logged in and viewing any authenticated page
**When** I look at the sidebar
**Then** I see a logout button/icon in the user section

### AC2: Logout Functionality
**Given** I am logged in
**When** I click the logout button
**Then** my Firebase session is terminated
**And** the auth token is cleared from storage
**And** I am redirected to the login page

### AC3: Protected Route Enforcement After Logout
**Given** I have just logged out
**When** I try to access a protected route directly via URL
**Then** I am redirected to the login page

### AC4: Browser Back Button Protection
**Given** I have logged out
**When** I use the browser back button
**Then** I cannot access previously viewed authenticated content
**And** I am redirected to the login page

---

## Tasks / Subtasks

- [x] **Task 1: Update Sidebar Component with Logout Button** (AC: #1)
  - [x] 1.1 Add logout button/icon to sidebar user section in `src/app/shared/components/sidebar/sidebar.component.html`
  - [x] 1.2 Style logout button following BEM convention in `sidebar.component.scss`
  - [x] 1.3 Add Lucide icon (log-out) for the logout button
  - [x] 1.4 Include aria-label for accessibility

- [x] **Task 2: Connect Logout Button to AuthService** (AC: #2)
  - [x] 2.1 Inject AuthService into SidebarComponent
  - [x] 2.2 Create `onLogout()` method that calls `authService.logout()`
  - [x] 2.3 Navigate to `/login` after successful logout
  - [x] 2.4 Handle any potential errors during logout (edge case)

- [x] **Task 3: Verify AuthService.logout() Implementation** (AC: #2)
  - [x] 3.1 Confirm `logout()` method exists and uses Firebase `signOut()`
  - [x] 3.2 Verify auth state is properly cleared on logout
  - [x] 3.3 Ensure any stored tokens/state are cleared

- [x] **Task 4: Verify authGuard Protects Routes** (AC: #3)
  - [x] 4.1 Confirm `authGuard` exists in `src/app/core/auth/auth.guard.ts`
  - [x] 4.2 Verify authGuard is applied to protected routes (cards, scheduled)
  - [x] 4.3 Test direct URL access redirects to login when not authenticated

- [x] **Task 5: Implement Back Button Protection** (AC: #4)
  - [x] 5.1 Use `replaceUrl: true` in router navigation after logout
  - [x] 5.2 Alternatively, clear browser history entry on logout (N/A - replaceUrl used)
  - [x] 5.3 Verify authGuard triggers on back button navigation

- [x] **Task 6: Write Tests** (AC: All)
  - [x] 6.1 Test logout button renders in sidebar user section
  - [x] 6.2 Test clicking logout calls AuthService.logout()
  - [x] 6.3 Test successful logout navigates to /login
  - [x] 6.4 Test authGuard redirects unauthenticated users (verified in `auth.guard.spec.ts`)
  - [x] 6.5 Test navigation uses replaceUrl to prevent back button access

---

## Dev Notes

### Critical Architecture Patterns

**Follow Established Patterns from Previous Stories:**

The AuthService already has a `logout()` method implemented from Story 1.1. This story focuses on:
1. Adding the logout UI to the sidebar
2. Wiring up the logout button to the AuthService
3. Ensuring proper route protection after logout

### Existing AuthService Implementation

**AuthService.logout() is already implemented:**
```typescript
// src/app/core/auth/auth.service.ts
async logout(): Promise<void> {
  await signOut(this.auth);
  // Auth state automatically updates via authState subscription
}
```

### Sidebar Component Location

The sidebar component exists at:
```
src/app/shared/components/sidebar/
├── sidebar.component.ts
├── sidebar.component.html
├── sidebar.component.scss
└── sidebar.component.spec.ts
```

### Logout Button Design

**From UX Specification (Story 1.1):**
- Logout button/icon should be in the user section at the bottom of the sidebar
- Use Lucide `log-out` icon
- Include text label "Log out" or icon-only with tooltip

**BEM Naming Convention:**
```scss
.sidebar__user { }              // User section container
.sidebar__user-avatar { }       // Avatar placeholder
.sidebar__user-name { }         // User display name (optional)
.sidebar__logout { }            // Logout button
.sidebar__logout-icon { }       // Logout icon
```

### Navigation After Logout

**Use replaceUrl for Back Button Protection:**
```typescript
async onLogout(): Promise<void> {
  try {
    await this.authService.logout();
    // Use replaceUrl to prevent back button from returning to authenticated page
    await this.router.navigate(['/login'], { replaceUrl: true });
  } catch (error) {
    // Logout errors are rare but handle gracefully
    console.error('Logout error:', error);
    // Still navigate to login even if logout partially fails
    await this.router.navigate(['/login'], { replaceUrl: true });
  }
}
```

### Route Guards Verification

**authGuard should already be protecting routes:**
```typescript
// src/app/app.routes.ts
{
  path: '',
  component: MainLayoutComponent,
  canActivate: [authGuard],
  children: [
    { path: 'cards', component: CardFeedComponent },
    { path: 'scheduled', component: ScheduledComponent },
    // ... other protected routes
  ]
}
```

**authGuard implementation:**
```typescript
// src/app/core/auth/auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map((user) => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
```

### Accessibility Requirements

- Logout button must have `aria-label="Log out"` if icon-only
- Include `role="button"` if using non-button element
- Ensure keyboard focus is visible (purple outline)
- Button should be reachable via Tab key navigation

### Design Tokens Reference

```scss
// Colors
$color-text-secondary: #A1A1AA;
$color-text-muted: #71717A;
$color-accent-primary: #8B5CF6;
$color-error: #EF4444;

// Hover states
$color-text-primary: #F4F4F5;

// Spacing
$spacing-2: 8px;
$spacing-3: 12px;
$spacing-4: 16px;
```

### Testing Standards

**Vitest patterns from Story 1.3:**
```typescript
describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockAuthService: { logout: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    mockAuthService = {
      logout: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    // ... setup
  });

  it('should call AuthService.logout when logout button clicked', async () => {
    const logoutBtn = fixture.nativeElement.querySelector('.sidebar__logout');
    logoutBtn.click();

    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should navigate to /login with replaceUrl after logout', async () => {
    await component.onLogout();

    expect(router.navigate).toHaveBeenCalledWith(['/login'], { replaceUrl: true });
  });
});
```

---

## Previous Story Intelligence

### Learnings from Story 1.3 (User Login)

**Patterns to Follow:**
1. Use Vitest `vi.fn()` for mocking services
2. Use `provideRouter([])` for testing routing
3. Spy on `Router.navigate` with `vi.spyOn(router, 'navigate').mockResolvedValue(true)`
4. Test both success and error scenarios
5. Accessibility: add `aria-*` attributes for screen readers

**Debug Issues from Story 1.3:**
- Use `vi.useFakeTimers()` for timing-related tests
- Always call `fixture.detectChanges()` after setup
- Use `$any()` cast for FormControl in templates (not relevant here but good to remember)

### AuthService Methods Available
- `register(email, password)` - ✅ Implemented
- `login(email, password)` - ✅ Implemented
- `logout()` - ✅ Implemented
- `user$` Observable - ✅ Available for checking auth state
- `isAuthenticated` getter - ✅ Available

### Existing Guards
- `authGuard` - Protects authenticated routes
- `noAuthGuard` - Redirects authenticated users away from login/register

---

## References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.4] - Acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication-Security] - Auth patterns
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Sidebar-Component] - Sidebar design
- [Source: _bmad-output/implementation-artifacts/1-3-user-login.md] - Previous story patterns
- [Source: _bmad-output/implementation-artifacts/1-1-application-shell-design-foundation.md] - Sidebar implementation

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Story file path correction: Sidebar component is at `src/app/shared/components/sidebar/` not `src/app/layouts/main-layout/sidebar/`

### Completion Notes List

- **Task 1**: Sidebar logout button already existed from Story 1.1 with Lucide icon (log-out), BEM styling (.sidebar__logout), and aria-label="Log out"
- **Task 2**: Enhanced `onLogout()` method to include Router navigation with `replaceUrl: true` for back button protection. Added error handling with try/catch.
- **Task 3**: Verified AuthService.logout() uses Firebase `signOut()` and auth state clears via authState subscription
- **Task 4**: Verified authGuard exists and is applied to MainLayoutComponent protecting /cards and /scheduled routes
- **Task 5**: Implemented `replaceUrl: true` in router navigation to prevent back button from returning to authenticated pages
- **Task 6**: Added 3 new tests for navigation with replaceUrl (success case, error case, button click)
- All 111 tests passing, build compiles successfully

### Senior Developer Review (AI)

**Review Date:** 2026-02-04
**Reviewer:** Claude Opus 4.5 (Adversarial Code Review)

**Issues Found & Fixed:**

| Severity | Issue | Status |
|----------|-------|--------|
| HIGH | AuthService.logout() silently swallowed errors without re-throwing | ✅ FIXED |
| MEDIUM | Task 6.4 claimed authGuard test but didn't specify location | ✅ FIXED |
| MEDIUM | Dev Notes had wrong sidebar path (layouts vs shared/components) | ✅ FIXED |
| MEDIUM | Button text "Logout" inconsistent with aria-label "Log out" | ✅ FIXED |
| LOW | Test naming could be more specific | Noted |
| LOW | Console.error in production code | Noted |

**Changes Made During Review:**
1. Updated `auth.service.ts` to re-throw errors in logout() so calling code knows if logout failed
2. Fixed button text in `sidebar.component.html` from "Logout" to "Log out" for consistency
3. Corrected sidebar path in Dev Notes section
4. Clarified Task 6.4 to reference actual test location (auth.guard.spec.ts)

**Review Outcome:** APPROVED with fixes applied

### File List

**Modified:**
- `src/app/shared/components/sidebar/sidebar.component.ts` - Added Router injection and navigation with replaceUrl: true in onLogout()
- `src/app/shared/components/sidebar/sidebar.component.html` - Fixed button text "Logout" → "Log out"
- `src/app/shared/components/sidebar/sidebar.component.spec.ts` - Added 3 new tests for logout navigation
- `src/app/core/auth/auth.service.ts` - Added throw in logout() catch block to propagate errors
