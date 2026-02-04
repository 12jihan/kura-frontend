---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
---

# kura-frontend - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for kura-frontend, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**1. User Authentication (FR1-FR4)**
- FR1: Users can create a new account using Firebase Authentication
- FR2: Users can log in to their existing account
- FR3: Users can log out of their account
- FR4: Users can reset their password if forgotten

**2. User Profile & Onboarding (FR5-FR11)**
- FR5: Users can create a handle or business name during onboarding
- FR6: Users can select a content type from a predefined dropdown
- FR7: Users can specify a custom content category if predefined options don't fit
- FR8: Users can add a description of their brand/voice
- FR9: Users can add keywords that define their niche
- FR10: Users can optionally connect their LinkedIn account during onboarding
- FR11: Users can view and edit their profile settings after onboarding

**3. AI Content Generation (FR12-FR16)**
- FR12: System generates AI instructions automatically from user's profile inputs
- FR13: System generates a daily batch of 5 content cards for each user
- FR14: Users can generate additional cards on-demand beyond the daily batch
- FR15: Users can regenerate a specific card to get a new variation
- FR16: System generates cards that match the user's defined content theme and voice

**4. Card Management (FR17-FR21)**
- FR17: Users can browse their generated cards in a feed on the homepage
- FR18: Users can view detailed information about a specific card
- FR19: Users can edit the text content of a card before publishing
- FR20: Users can dismiss a card they don't want (removes from feed)
- FR21: System records dismissal feedback for future AI improvement

**5. Publishing & Scheduling (FR22-FR26)**
- FR22: Users can schedule a card for future posting to LinkedIn
- FR23: Users can post a card immediately to LinkedIn
- FR24: Users can view their scheduled posts
- FR25: Users can cancel a scheduled post before it publishes
- FR26: Users can copy card content to clipboard as a fallback

**6. Error Handling & Notifications (FR27-FR30)**
- FR27: System displays clear error alerts when LinkedIn posting fails
- FR28: System offers retry option when posting fails
- FR29: System provides copy-to-clipboard option when posting fails
- FR30: System displays loading states during card generation

### NonFunctional Requirements

**Performance (NFR1-NFR5)**
- NFR1: AI card generation completes in < 10 seconds
- NFR2: Page load (initial) completes in < 3 seconds
- NFR3: Page navigation completes in < 1 second
- NFR4: API responses (non-AI) complete in < 500ms
- NFR5: LinkedIn posting completes in < 5 seconds

**Security (NFR6-NFR10)**
- NFR6: Authentication uses Firebase Auth (OAuth 2.0)
- NFR7: Data in transit uses HTTPS/TLS encryption
- NFR8: API credentials are server-side only, never exposed to client
- NFR9: Session management uses secure token handling via Firebase
- NFR10: User data storage is encrypted at rest in PostgreSQL

**Scalability (NFR11-NFR13)**
- NFR11: Initial capacity supports 1,000 concurrent users
- NFR12: Database design supports horizontal scaling
- NFR13: Stateless API (no server-side session state)

**Accessibility (NFR14-NFR17)**
- NFR14: Compliance level is WCAG 2.1 Level A
- NFR15: All core actions accessible via keyboard navigation
- NFR16: Proper heading hierarchy and semantic HTML landmarks
- NFR17: Visible focus indicators for keyboard users

**Integration (NFR18-NFR21)**
- NFR18: Gemini API handles rate limits gracefully
- NFR19: LinkedIn API handles OAuth token refresh
- NFR20: Firebase Auth handles auth state changes reactively
- NFR21: API error handling provides graceful degradation with user feedback

### Additional Requirements

**From Architecture - Infrastructure & Setup:**
- Project already initialized with Angular CLI 21.1.2 (standalone components, signals-first)
- Install dependencies: `lucide-angular`, `@angular/fire`, `firebase`
- Configure Firebase providers in app.config.ts
- Set up SCSS architecture (variables, mixins, reset, typography, utilities)
- Update angular.json schematics for component generation (no inline styles/templates)
- Drizzle ORM for PostgreSQL database
- Database models: Users, Cards, Schedules, Dismissals
- Firebase Admin SDK for backend token validation
- Zod schemas for API request validation
- Docker + Docker Compose for deployment
- Nginx reverse proxy with SSL (Let's Encrypt)
- GitHub Actions CI/CD pipeline

**From Architecture - API Conventions:**
- REST API with direct data + HTTP status codes (no envelope)
- Error format: `{ error: string, code: string }`
- Standard error codes: UNAUTHORIZED, FORBIDDEN, NOT_FOUND, VALIDATION_ERROR, GENERATION_FAILED, LINKEDIN_ERROR, RATE_LIMITED
- API routes defined for cards, schedule, and profile resources

**From Architecture - Frontend Patterns:**
- Services + Signals for state management
- Feature modules with lazy loading
- HttpClient with auth interceptor
- Reactive Forms + Signals
- Private writable signals with public readonly accessors
- Optimistic updates for dismiss/edit actions

**From UX Design - Component Requirements:**
- 12 custom components: Card, Button, Icon Button, Form Input, Tag Input, Sidebar, Toast, Skeleton, Error Alert, Empty State, Progress, Schedule Picker
- BEM methodology for CSS (block__element--modifier)
- Dark theme with purple accents (#8B5CF6)
- Design tokens defined in SCSS variables
- Lucide icons integration

**From UX Design - Interaction Requirements:**
- Inline editing with auto-save (debounced 1 second)
- One-click actions: dismiss, copy, regenerate
- Two-step scheduling: select date → confirm
- Toast notifications for feedback (bottom-right, 4 second auto-dismiss)
- Skeleton loading states during content fetch
- Card hover state with purple border glow

**From UX Design - Responsive Requirements:**
- Desktop-first with mobile support
- Breakpoints: Mobile (320-767px), Tablet (768-1023px), Desktop (1024px+)
- Sidebar navigation on desktop (240px fixed)
- Bottom navigation bar on mobile
- Collapsible sidebar on tablet
- Minimum 44x44px touch targets on mobile

**From UX Design - Accessibility Requirements:**
- Skip link for main content
- ARIA landmarks: nav, main, section, article
- Icon buttons have aria-labels
- Form fields have proper label associations and aria-describedby
- Toast notifications use role="status" or role="alert"
- Focus visible with purple outline ring
- Respect prefers-reduced-motion

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | Create account with Firebase |
| FR2 | Epic 1 | Log in to existing account |
| FR3 | Epic 1 | Log out |
| FR4 | Epic 1 | Password reset |
| FR5 | Epic 2 | Create handle/business name |
| FR6 | Epic 2 | Select content type dropdown |
| FR7 | Epic 2 | Custom content category |
| FR8 | Epic 2 | Add brand description |
| FR9 | Epic 2 | Add keywords |
| FR10 | Epic 2 | Connect LinkedIn account |
| FR11 | Epic 2 | View/edit profile settings |
| FR12 | Epic 3 | AI instruction generation |
| FR13 | Epic 3 | Daily batch (5 cards) |
| FR14 | Epic 3 | On-demand generation |
| FR15 | Epic 3 | Regenerate specific card |
| FR16 | Epic 3 | Cards match user voice |
| FR17 | Epic 4 | Browse cards in feed |
| FR18 | Epic 4 | View card details |
| FR19 | Epic 4 | Edit card text |
| FR20 | Epic 4 | Dismiss card |
| FR21 | Epic 4 | Record dismissal feedback |
| FR22 | Epic 5 | Schedule future post |
| FR23 | Epic 5 | Post immediately |
| FR24 | Epic 5 | View scheduled posts |
| FR25 | Epic 5 | Cancel scheduled post |
| FR26 | Epic 5 | Copy to clipboard |
| FR27 | Epic 6 | Display error alerts |
| FR28 | Epic 6 | Retry option |
| FR29 | Epic 6 | Copy-to-clipboard on error |
| FR30 | Epic 6 | Loading states |

## Epic List

### Epic 1: Project Setup & User Authentication
Users can create accounts, log in, and securely access the application.
**FRs covered:** FR1, FR2, FR3, FR4

### Epic 2: User Onboarding Experience
Users can set up their brand identity and content preferences to personalize AI generation.
**FRs covered:** FR5, FR6, FR7, FR8, FR9, FR10, FR11

### Epic 3: AI Content Generation Engine
Users receive AI-generated content cards that match their defined voice and themes.
**FRs covered:** FR12, FR13, FR14, FR15, FR16

### Epic 4: Card Feed & Management
Users can browse, view, edit, and curate their generated content cards.
**FRs covered:** FR17, FR18, FR19, FR20, FR21

### Epic 5: LinkedIn Publishing & Scheduling
Users can publish their content to LinkedIn immediately or schedule for later.
**FRs covered:** FR22, FR23, FR24, FR25, FR26

### Epic 6: Error Handling & Resilience
Users have clear feedback during operations and can recover gracefully from errors.
**FRs covered:** FR27, FR28, FR29, FR30

---

## Epic 1: Project Setup & User Authentication

**Goal:** Users can create accounts, log in, and securely access the application.

### Story 1.1: Application Shell & Design Foundation

As a user,
I want to see a professionally designed application shell with navigation,
So that I can understand the app structure and have a polished experience.

**Acceptance Criteria:**

**Given** the project repository is cloned
**When** dependencies are installed with `npm install`
**Then** lucide-angular, @angular/fire, and firebase packages are available
**And** no dependency conflicts or errors occur

**Given** the application is running
**When** I view any page
**Then** the dark theme (#0D0D0F background) is applied consistently
**And** purple accent color (#8B5CF6) is used for interactive elements
**And** Inter font family is loaded and applied

**Given** the SCSS architecture is set up
**When** a developer creates a new component
**Then** design tokens are available via `@use` imports
**And** BEM naming convention is documented and enforced

**Given** I am on a desktop viewport (1024px+)
**When** I view the authenticated area
**Then** a fixed 240px sidebar is visible on the left
**And** the main content area fills the remaining width

**Given** I am viewing the sidebar
**When** I look at the navigation
**Then** I see the Kura logo at the top
**And** navigation links for "Cards" and "Scheduled" are visible
**And** the user section shows avatar placeholder and logout option at the bottom

**Given** I am not authenticated
**When** I try to access protected routes
**Then** I am redirected to the login page

---

### Story 1.2: User Registration

As a new user,
I want to create an account with my email and password,
So that I can access the Kura application.

**Acceptance Criteria:**

**Given** I am on the registration page
**When** I view the form
**Then** I see email and password input fields
**And** I see a "Create Account" button
**And** I see a link to the login page for existing users

**Given** I enter a valid email and password (min 8 characters)
**When** I click "Create Account"
**Then** a new account is created in Firebase Authentication
**And** I am automatically logged in
**And** I am redirected to the onboarding flow

**Given** I enter an email that is already registered
**When** I click "Create Account"
**Then** I see an error message "An account with this email already exists"
**And** I remain on the registration page

**Given** I enter an invalid email format
**When** I blur the email field or submit the form
**Then** I see an inline validation error "Please enter a valid email"

**Given** I enter a password less than 8 characters
**When** I blur the password field or submit the form
**Then** I see an inline validation error "Password must be at least 8 characters"

**Given** registration is in progress
**When** the API call is pending
**Then** the button shows a loading state
**And** the form inputs are disabled

---

### Story 1.3: User Login

As a returning user,
I want to log in to my existing account,
So that I can access my generated content cards.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I view the form
**Then** I see email and password input fields
**And** I see a "Log In" button
**And** I see a "Forgot password?" link
**And** I see a link to register for new users

**Given** I enter valid credentials for an existing account
**When** I click "Log In"
**Then** I am authenticated via Firebase
**And** the auth token is stored securely
**And** I am redirected to the card feed (or onboarding if not complete)

**Given** I enter incorrect credentials
**When** I click "Log In"
**Then** I see an error message "Invalid email or password"
**And** the password field is cleared
**And** I remain on the login page

**Given** I am already logged in
**When** I navigate to the login page
**Then** I am automatically redirected to the card feed

**Given** my session expires or token is invalid
**When** I make an authenticated API request
**Then** the auth interceptor detects the 401 response
**And** I am redirected to the login page
**And** a toast notification says "Session expired. Please log in again."

**Given** login is in progress
**When** the API call is pending
**Then** the button shows a loading state
**And** the form inputs are disabled

---

### Story 1.4: User Logout

As a logged-in user,
I want to log out of my account,
So that I can secure my session when I'm done.

**Acceptance Criteria:**

**Given** I am logged in and viewing any authenticated page
**When** I look at the sidebar
**Then** I see a logout button/icon in the user section

**Given** I am logged in
**When** I click the logout button
**Then** my Firebase session is terminated
**And** the auth token is cleared from storage
**And** I am redirected to the login page

**Given** I have just logged out
**When** I try to access a protected route directly via URL
**Then** I am redirected to the login page

**Given** I have logged out
**When** I use the browser back button
**Then** I cannot access previously viewed authenticated content
**And** I am redirected to the login page

---

### Story 1.5: Password Reset

As a user who forgot my password,
I want to reset it via email,
So that I can regain access to my account.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I click "Forgot password?"
**Then** I am navigated to the password reset page

**Given** I am on the password reset page
**When** I view the form
**Then** I see an email input field
**And** I see a "Send Reset Link" button
**And** I see a link to return to the login page

**Given** I enter a valid registered email
**When** I click "Send Reset Link"
**Then** Firebase sends a password reset email
**And** I see a confirmation message "Reset link sent! Check your email."
**And** I see a link to return to the login page

**Given** I enter an email that is not registered
**When** I click "Send Reset Link"
**Then** I still see "Reset link sent! Check your email." (for security)
**And** no error is shown to prevent email enumeration

**Given** I enter an invalid email format
**When** I blur the field or submit
**Then** I see an inline validation error "Please enter a valid email"

**Given** the reset email request is in progress
**When** the API call is pending
**Then** the button shows a loading state
**And** the form input is disabled

---

## Epic 2: User Onboarding Experience

**Goal:** Users can set up their brand identity and content preferences to personalize AI generation.

### Story 2.1: Onboarding Flow & Handle Setup

As a new user,
I want to enter my handle or business name as the first onboarding step,
So that my generated content can be personalized to my brand identity.

**Acceptance Criteria:**

**Given** I have just registered a new account
**When** I am redirected after registration
**Then** I land on the onboarding flow at step 1

**Given** I am on the onboarding flow
**When** I view the page
**Then** I see a progress indicator showing 4 steps
**And** step 1 is highlighted as active
**And** the steps are labeled: Handle, Content, Voice, Keywords

**Given** I am on step 1 (Handle)
**When** I view the form
**Then** I see a text input for my handle or business name
**And** I see a placeholder like "@YourHandle or Business Name"
**And** I see a "Next" button

**Given** I enter a valid handle (2-30 characters, alphanumeric and underscores)
**When** I click "Next"
**Then** my handle is saved to my user profile
**And** I progress to step 2

**Given** I leave the handle field empty
**When** I click "Next"
**Then** I see an inline validation error "Handle is required"
**And** I remain on step 1

**Given** I enter an invalid handle (special characters or too long)
**When** I blur the field or click "Next"
**Then** I see an inline validation error with guidance on valid format

**Given** I am a returning user who started but didn't complete onboarding
**When** I log in
**Then** I am redirected to the onboarding step where I left off
**And** previously entered data is preserved

**Given** the backend user profile table
**When** a user completes step 1
**Then** the users table stores: firebase_uid, handle, onboarding_step, created_at

---

### Story 2.2: Content Type Selection

As a user completing onboarding,
I want to select my content type from predefined options or specify a custom category,
So that the AI understands what topics I create content about.

**Acceptance Criteria:**

**Given** I completed step 1 and am on step 2 (Content Type)
**When** I view the form
**Then** I see a dropdown with predefined content types
**And** the options include: Tech & Startups, Marketing, Finance, Health & Wellness, Creative Arts, Education, Other
**And** I see "Back" and "Next" buttons

**Given** I select a predefined content type
**When** I click "Next"
**Then** my content type is saved to my profile
**And** I progress to step 3

**Given** I select "Other" from the dropdown
**When** the selection is made
**Then** a text input appears for custom category
**And** the input is labeled "Describe your content focus"

**Given** I selected "Other" and entered a custom category
**When** I click "Next"
**Then** my custom category is saved as my content type
**And** I progress to step 3

**Given** I selected "Other" but left the custom field empty
**When** I click "Next"
**Then** I see an inline validation error "Please describe your content focus"
**And** I remain on step 2

**Given** I am on step 2
**When** I click "Back"
**Then** I return to step 1
**And** my previously entered handle is preserved

**Given** the user profile
**When** step 2 is completed
**Then** content_type field is updated with selection or custom value

---

### Story 2.3: Brand Voice Description

As a user completing onboarding,
I want to describe my brand voice and style,
So that generated content matches my unique tone.

**Acceptance Criteria:**

**Given** I completed step 2 and am on step 3 (Voice)
**When** I view the form
**Then** I see a textarea for brand voice description
**And** I see helper text like "Describe how you want your content to sound (e.g., 'Practical advice for solo founders, no fluff')"
**And** I see a character count indicator
**And** I see "Back" and "Next" buttons

**Given** I enter a brand description (10-500 characters)
**When** I click "Next"
**Then** my description is saved to my profile
**And** I progress to step 4

**Given** I enter a description under 10 characters
**When** I click "Next"
**Then** I see a validation message "Please provide at least 10 characters to help the AI understand your voice"
**And** I remain on step 3

**Given** I enter a description over 500 characters
**When** I continue typing
**Then** the character count shows I've exceeded the limit
**And** the "Next" button is disabled until I reduce the length

**Given** I am on step 3
**When** I click "Back"
**Then** I return to step 2
**And** my previously selected content type is preserved

**Given** the user profile
**When** step 3 is completed
**Then** brand_description field is updated with the entered text

---

### Story 2.4: Keyword Tags Input

As a user completing onboarding,
I want to add keywords that define my niche,
So that generated content focuses on my areas of expertise.

**Acceptance Criteria:**

**Given** I completed step 3 and am on step 4 (Keywords)
**When** I view the form
**Then** I see a tag input component
**And** I see helper text like "Add keywords that define your niche (e.g., indie hacking, bootstrapping, SaaS)"
**And** I see "Back" and "Complete Setup" buttons

**Given** I am in the tag input
**When** I type a keyword and press Enter or comma
**Then** the keyword is added as a tag pill
**And** the input field is cleared for the next keyword

**Given** I have added keyword tags
**When** I view the tags
**Then** each tag shows the keyword text and an × remove button

**Given** I click the × on a tag
**When** the click is registered
**Then** the tag is immediately removed
**And** I can re-add it if needed

**Given** I have the tag input focused with tags present
**When** I press Backspace on an empty input
**Then** the last tag is removed

**Given** I try to add a duplicate keyword
**When** I press Enter
**Then** the duplicate is not added
**And** the existing tag briefly highlights to indicate it exists

**Given** I have added at least 1 keyword
**When** I click "Complete Setup"
**Then** my keywords are saved to my profile
**And** my onboarding_complete flag is set to true
**And** I am redirected to the card feed with a welcome message

**Given** I have added no keywords
**When** I click "Complete Setup"
**Then** I see a prompt "Add at least one keyword to help personalize your content"
**And** I remain on step 4

**Given** I try to add more than 10 keywords
**When** I attempt to add the 11th
**Then** I see a message "Maximum 10 keywords allowed"
**And** the keyword is not added

**Given** the user profile
**When** step 4 is completed
**Then** keywords are stored as an array in the user profile
**And** onboarding_complete is set to true

---

### Story 2.5: LinkedIn Account Connection

As a user completing onboarding,
I want to optionally connect my LinkedIn account,
So that I can publish content directly to LinkedIn later.

**Acceptance Criteria:**

**Given** I completed step 4 (keywords)
**When** the onboarding completes
**Then** I see a modal or interstitial offering LinkedIn connection
**And** I see "Connect LinkedIn" and "Skip for now" options
**And** the message explains the benefit: "Connect to publish directly to LinkedIn"

**Given** I click "Connect LinkedIn"
**When** the OAuth flow initiates
**Then** I am redirected to LinkedIn's authorization page
**And** the requested permissions include posting on my behalf

**Given** I authorize the LinkedIn connection
**When** LinkedIn redirects back to Kura
**Then** the OAuth tokens are securely stored server-side
**And** my profile shows LinkedIn as connected
**And** I see a success toast "LinkedIn connected successfully!"
**And** I am redirected to the card feed

**Given** I deny the LinkedIn authorization
**When** LinkedIn redirects back
**Then** I see a message "LinkedIn connection cancelled"
**And** I am still redirected to the card feed
**And** I can connect later from settings

**Given** I click "Skip for now"
**When** the click is registered
**Then** I am redirected to the card feed
**And** no LinkedIn tokens are stored
**And** I can connect later from settings

**Given** the LinkedIn OAuth tokens
**When** stored server-side
**Then** access_token and refresh_token are encrypted
**And** token expiration is tracked for refresh

**Given** a user with connected LinkedIn
**When** the access token expires
**Then** the system uses the refresh token to obtain a new access token
**And** the user is not required to re-authorize

---

### Story 2.6: Profile Settings Management

As an onboarded user,
I want to view and edit my profile settings anytime,
So that I can update my preferences as my brand evolves.

**Acceptance Criteria:**

**Given** I am logged in and onboarding is complete
**When** I click "Settings" in the sidebar navigation
**Then** I am taken to the profile settings page

**Given** I am on the settings page
**When** I view the page
**Then** I see all my profile fields displayed:
- Handle
- Content Type
- Brand Description
- Keywords
- LinkedIn Connection Status
**And** each field has an "Edit" option or is inline-editable

**Given** I click to edit my handle
**When** I change the value and save
**Then** my handle is updated in the database
**And** I see a success toast "Profile updated"

**Given** I edit my content type
**When** I select a new option or enter custom value
**Then** the change is saved
**And** future AI generations will use the new content type

**Given** I edit my brand description
**When** I update the text and save
**Then** the change is saved with the same validation rules as onboarding

**Given** I edit my keywords
**When** I add or remove tags and save
**Then** the changes are saved
**And** the same 1-10 keyword limits apply

**Given** my LinkedIn is connected
**When** I view the LinkedIn section
**Then** I see "Connected" status with my LinkedIn profile name
**And** I see a "Disconnect" button

**Given** I click "Disconnect" for LinkedIn
**When** I confirm the action
**Then** the OAuth tokens are deleted from the server
**And** the status changes to "Not connected"
**And** I see a "Connect LinkedIn" button

**Given** my LinkedIn is not connected
**When** I view the LinkedIn section
**Then** I see "Not connected" status
**And** I see a "Connect LinkedIn" button that initiates OAuth

**Given** I make changes to my profile
**When** I navigate away without saving
**Then** I see a confirmation prompt "You have unsaved changes. Discard?"

---

## Epic 3: AI Content Generation Engine

**Goal:** Users receive AI-generated content cards that match their defined voice and themes.

### Story 3.1: AI Instruction Generation

As the system,
I want to automatically generate AI instructions from user profile data,
So that the Gemini API can create personalized content matching the user's voice.

**Acceptance Criteria:**

**Given** a user has completed onboarding with all profile fields
**When** the system prepares to generate cards
**Then** AI instructions are compiled from the user's profile data

**Given** the user profile contains handle, content_type, brand_description, and keywords
**When** AI instructions are generated
**Then** the instructions include:
- The user's content niche (content_type)
- Their voice/tone (brand_description)
- Topic focus areas (keywords)
- Platform context (LinkedIn professional tone)

**Given** AI instructions are generated
**When** stored in the system
**Then** they are saved in the user's profile as `ai_instructions`
**And** they are updated whenever profile fields change

**Given** a user updates their profile (content type, description, or keywords)
**When** the changes are saved
**Then** the AI instructions are automatically regenerated
**And** the next card generation uses the updated instructions

**Given** the AI instructions template
**When** compiled for Gemini API
**Then** the prompt follows best practices for consistent output:
- Clear persona definition
- Specific content guidelines
- Output format instructions (LinkedIn post length, no hashtags unless specified)
- Tone and style directives

**Given** a user with minimal profile data (only required fields)
**When** AI instructions are generated
**Then** reasonable defaults are applied
**And** the instructions still produce relevant content

---

### Story 3.2: Daily Card Batch Generation

As a user,
I want to receive 5 fresh content cards each day,
So that I always have new ideas ready for posting.

**Acceptance Criteria:**

**Given** I am a user who completed onboarding
**When** I log in for the first time today
**Then** I see 5 fresh content cards in my feed
**And** each card contains LinkedIn-appropriate post content

**Given** the cards database table
**When** cards are generated
**Then** each card record includes:
- id (UUID)
- user_id (foreign key)
- content (generated text)
- status (active, dismissed, scheduled, posted)
- created_at timestamp
- platform (LinkedIn)

**Given** the backend receives a generation request
**When** calling the Gemini API
**Then** the request includes the user's AI instructions
**And** requests 5 distinct post ideas
**And** specifies LinkedIn post format (< 3000 characters, professional tone)

**Given** the Gemini API responds successfully
**When** cards are created
**Then** all 5 cards are stored in the database
**And** each card has unique content
**And** the cards are returned to the frontend

**Given** the Gemini API call is in progress
**When** the user is waiting
**Then** the generation completes within 10 seconds (NFR1)
**And** if approaching timeout, partial results are returned if available

**Given** the Gemini API returns an error
**When** handling the failure
**Then** the error is logged server-side
**And** the user sees a friendly error message
**And** a retry option is available

**Given** the Gemini API rate limit is hit
**When** the request fails with 429 status
**Then** the system implements exponential backoff
**And** retries up to 3 times
**And** if still failing, informs the user to try again later

**Given** I already have cards generated today
**When** I log in again
**Then** I see my existing cards (not regenerated)
**And** new cards are only generated if I explicitly request them

**Given** generated card content
**When** displayed to the user
**Then** the content matches my defined voice and topics
**And** reads naturally as a LinkedIn post
**And** varies in style (some questions, some statements, some stories)

---

### Story 3.3: On-Demand Card Generation

As a user who wants more content options,
I want to generate additional cards beyond my daily batch,
So that I'm never stuck without content ideas.

**Acceptance Criteria:**

**Given** I am on the card feed
**When** I want more cards
**Then** I see a "Generate More Cards" button
**And** the button is visible whether I have cards or not

**Given** I click "Generate More Cards"
**When** the generation starts
**Then** the button shows a loading state ("Generating...")
**And** the button is disabled to prevent duplicate requests

**Given** on-demand generation is requested
**When** the backend processes the request
**Then** 5 new cards are generated using my AI instructions
**And** the new cards are added to my existing cards (not replacing)

**Given** generation completes successfully
**When** new cards are returned
**Then** the new cards appear in my feed
**And** a success toast shows "5 new cards generated!"
**And** the button returns to its normal state

**Given** I have an empty feed (all cards dismissed or scheduled)
**When** I view the feed
**Then** I see an empty state with the "Generate More Cards" button prominently displayed
**And** the message says "All caught up! Generate more cards when you're ready."

**Given** on-demand generation fails
**When** an error occurs
**Then** I see an error toast "Couldn't generate cards. Please try again."
**And** the button returns to normal state for retry

**Given** I rapidly click "Generate More Cards" multiple times
**When** requests are sent
**Then** only one request is processed (debounced)
**And** duplicate requests are ignored

**Given** the API is processing my request
**When** I navigate away from the feed
**Then** the generation continues in the background
**And** cards are available when I return

---

### Story 3.4: Single Card Regeneration

As a user who doesn't like a specific card,
I want to regenerate just that card to get a new variation,
So that I can get a better option without dismissing entirely.

**Acceptance Criteria:**

**Given** I am viewing a card in my feed
**When** I look at the card actions
**Then** I see a regenerate button (refresh/sync icon)
**And** the button has a tooltip "Regenerate this card"

**Given** I click the regenerate button on a card
**When** the regeneration starts
**Then** the card shows a loading state (spinner or skeleton)
**And** other cards remain interactive
**And** the regenerate button is disabled for this card

**Given** regeneration is requested for a specific card
**When** the backend processes the request
**Then** the Gemini API generates 1 new card using my AI instructions
**And** the new content is different from the original
**And** the new content is different from my other active cards

**Given** regeneration completes successfully
**When** the new content is returned
**Then** the card content is replaced in-place
**And** the card's created_at timestamp is updated
**And** the loading state is removed
**And** a subtle success indicator appears briefly

**Given** regeneration fails
**When** an error occurs
**Then** the original card content is preserved
**And** an error toast shows "Couldn't regenerate. Please try again."
**And** the regenerate button becomes active again

**Given** I regenerate a card multiple times
**When** each regeneration completes
**Then** I get a different variation each time
**And** the system tracks regeneration count for analytics (optional)

**Given** I regenerate a card
**When** the new content appears
**Then** any unsaved edits to that card are lost
**And** the card returns to its generated state

**Given** multiple cards are being regenerated simultaneously
**When** I click regenerate on several cards
**Then** each regeneration is processed independently
**And** each card shows its own loading state
**And** results appear as each completes (not waiting for all)

---

## Epic 4: Card Feed & Management

**Goal:** Users can browse, view, edit, and curate their generated content cards.

### Story 4.1: Card Feed Display

As a user,
I want to browse my generated cards in a scrollable feed on the homepage,
So that I can quickly scan and select content ideas.

**Acceptance Criteria:**

**Given** I am logged in and onboarding is complete
**When** I navigate to the homepage (Cards in sidebar)
**Then** I see my generated cards displayed in a vertical feed
**And** the page title is "Your Cards" or similar

**Given** I am viewing the card feed
**When** I look at each card
**Then** I see the card content (post text)
**And** I see the platform indicator (LinkedIn icon)
**And** I see action buttons (regenerate, dismiss)
**And** I see the card creation time ("Generated 2 min ago")

**Given** cards are loading from the API
**When** the request is in progress
**Then** I see skeleton card placeholders
**And** the skeletons match the card layout structure
**And** the skeletons animate with a shimmer effect

**Given** cards have loaded successfully
**When** the data is returned
**Then** skeleton cards are immediately replaced with real cards
**And** no loading flicker occurs

**Given** I hover over a card (desktop)
**When** my cursor enters the card boundary
**Then** the card border changes to purple accent (#8B5CF6)
**And** a subtle glow effect appears
**And** the transition is smooth (200ms)

**Given** I have multiple cards in my feed
**When** I scroll the page
**Then** all cards are accessible via scrolling
**And** the sidebar remains fixed during scroll
**And** scroll performance is smooth

**Given** the API returns an error when fetching cards
**When** the error is caught
**Then** I see an error message "Couldn't load your cards"
**And** I see a "Try Again" button
**And** clicking retry re-fetches the cards

**Given** I am on mobile viewport
**When** viewing the card feed
**Then** cards display full-width
**And** the bottom navigation is visible
**And** cards are touch-scrollable

---

### Story 4.2: Card Detail View

As a user,
I want to view detailed information about a specific card,
So that I can see the full content and available actions clearly.

**Acceptance Criteria:**

**Given** I am viewing the card feed
**When** I click on a card
**Then** the card expands or I navigate to a detail view
**And** the full card content is displayed without truncation

**Given** I am viewing a card in detail
**When** I look at the card
**Then** I see:
- Full post content
- Platform (LinkedIn)
- Creation timestamp
- All action buttons: Edit, Schedule, Copy, Regenerate, Dismiss

**Given** I am viewing a card in detail
**When** I look at the content area
**Then** long content is fully visible (scrollable if needed)
**And** text is formatted for readability (proper line height, spacing)

**Given** I am in card detail view
**When** I want to return to the feed
**Then** I see a back arrow or close button
**And** clicking it returns me to the feed
**And** my scroll position in the feed is preserved

**Given** I am viewing card detail
**When** I look at the action buttons
**Then** "Schedule" is the primary action (purple button)
**And** other actions are secondary or icon buttons
**And** each button has a clear label or tooltip

**Given** I click the "Copy" button
**When** the action completes
**Then** the card content is copied to my clipboard
**And** I see a success toast "Copied to clipboard!"
**And** the toast auto-dismisses after 4 seconds

**Given** I access a card detail via direct URL
**When** the page loads
**Then** the specific card is fetched and displayed
**And** if the card doesn't exist or isn't mine, I see a 404 message

**Given** I am on a card that has been edited
**When** viewing the detail
**Then** I see the edited content (not the original generated content)
**And** an indicator shows "Edited" if the content was modified

---

### Story 4.3: Card Content Editing

As a user,
I want to edit the text content of a card before publishing,
So that I can personalize or refine the AI-generated content.

**Acceptance Criteria:**

**Given** I am viewing a card (in feed or detail view)
**When** I click on the card content or an edit button
**Then** the content becomes editable (inline editing mode)
**And** a text cursor appears in the content area

**Given** I am in edit mode
**When** I view the editing interface
**Then** the content is in a textarea or contenteditable field
**And** I see a character count showing current/max (e.g., "245 / 3000")
**And** the textarea auto-grows with content

**Given** I am editing card content
**When** I type changes
**Then** the character count updates in real-time
**And** no save button is visible (auto-save pattern)

**Given** I am editing and stop typing
**When** 1 second passes without additional input (debounce)
**Then** the changes are automatically saved to the backend
**And** a subtle "Saved" indicator appears briefly
**And** the indicator fades after 2 seconds

**Given** I edit content and auto-save triggers
**When** the save API call is made
**Then** the request uses optimistic update (UI updates immediately)
**And** if the save fails, the UI reverts to previous content
**And** an error toast shows "Couldn't save changes. Please try again."

**Given** I am editing and exceed the character limit (3000)
**When** I continue typing
**Then** the character count turns red
**And** a warning appears "Content exceeds LinkedIn's limit"
**And** auto-save is blocked until under limit

**Given** I click outside the edit area or press Escape
**When** editing is active
**Then** edit mode is exited
**And** any pending changes are saved (if valid)
**And** the card returns to display mode

**Given** I edit a card's content
**When** the edit is saved
**Then** the card's `updated_at` timestamp is updated
**And** an `is_edited` flag is set to true
**And** the original generated content is preserved in `original_content`

**Given** I want to revert my edits
**When** I click "Revert to original" (if available)
**Then** the content is restored to the original AI-generated text
**And** the `is_edited` flag is set to false

**Given** I am editing on mobile
**When** the keyboard opens
**Then** the card scrolls into view
**And** the editing experience is usable on touch devices

---

### Story 4.4: Card Dismissal

As a user,
I want to dismiss cards I don't want with one click,
So that I can curate my feed to only show relevant content.

**Acceptance Criteria:**

**Given** I am viewing a card in the feed or detail view
**When** I look at the card actions
**Then** I see a dismiss button (X icon)
**And** the button has a tooltip "Dismiss"

**Given** I hover over the dismiss button (desktop)
**When** my cursor is on the button
**Then** the button/icon changes to red (danger color)
**And** this indicates a destructive action

**Given** I click the dismiss button
**When** the click is registered
**Then** the card immediately begins to fade out (200ms animation)
**And** no confirmation dialog appears (one-click action)
**And** the card is removed from the feed

**Given** a card is dismissed
**When** the dismissal is processed
**Then** an optimistic update removes it from UI instantly
**And** an API call is made to update the card status to "dismissed"
**And** a record is created in the dismissals table

**Given** the dismissals database table
**When** a dismissal is recorded
**Then** the record includes:
- id (UUID)
- card_id (foreign key)
- user_id (foreign key)
- dismissed_at timestamp
- card_content_snapshot (for AI feedback analysis)

**Given** the dismiss API call fails
**When** the error is caught
**Then** the card reappears in the feed (optimistic update rollback)
**And** an error toast shows "Couldn't dismiss card. Please try again."

**Given** I dismiss a card
**When** the card is removed
**Then** remaining cards reflow smoothly to fill the gap
**And** no jarring layout shifts occur

**Given** I dismiss the last card in my feed
**When** the feed becomes empty
**Then** the empty state appears
**And** I see "All caught up!" message
**And** I see the "Generate More Cards" button

**Given** I am viewing card detail and dismiss the card
**When** the card is dismissed
**Then** I am automatically returned to the feed
**And** the dismissed card is no longer visible

**Given** dismissal data is stored
**When** analyzed for AI improvement
**Then** the system can identify patterns in dismissed content
**And** this data can inform future prompt refinements (FR21)

**Given** I accidentally dismiss a card
**When** looking for an undo option
**Then** no undo is available (cards are cheap, regenerate instead)
**And** this is a deliberate UX decision to keep the flow fast

---

## Epic 5: LinkedIn Publishing & Scheduling

**Goal:** Users can publish their content to LinkedIn immediately or schedule for later.

### Story 5.1: Schedule Post to LinkedIn

As a user,
I want to schedule a card for future posting to LinkedIn,
So that my content publishes at the optimal time without manual effort.

**Acceptance Criteria:**

**Given** I am viewing a card (in feed or detail view)
**When** I click the "Schedule" button
**Then** a schedule picker appears (inline panel or modal)
**And** I see date and time selection inputs

**Given** I am in the schedule picker
**When** I view the interface
**Then** I see a date picker defaulting to tomorrow
**And** I see a time picker defaulting to 9:00 AM
**And** I see my detected timezone displayed
**And** I see "Cancel" and "Schedule" buttons

**Given** I am selecting a date
**When** I interact with the date picker
**Then** I cannot select dates in the past
**And** I can select any future date within the next 30 days

**Given** I am selecting a time
**When** I interact with the time picker
**Then** times are shown in 30-minute increments
**And** if selecting today, past times are disabled

**Given** I have selected a valid date and time
**When** I click "Schedule"
**Then** the scheduling request is sent to the backend
**And** the button shows a loading state

**Given** the schedule is created successfully
**When** the API responds
**Then** a success toast shows "Scheduled for [date] at [time]"
**And** the card status changes to "scheduled"
**And** the card is removed from the active feed
**And** the card appears in the Scheduled view

**Given** the scheduled_posts database table
**When** a schedule is created
**Then** the record includes:
- id (UUID)
- card_id (foreign key)
- user_id (foreign key)
- scheduled_time (timestamp with timezone)
- status (pending, published, failed, cancelled)
- created_at timestamp

**Given** I try to schedule but LinkedIn is not connected
**When** I click "Schedule"
**Then** I see a message "Connect LinkedIn to schedule posts"
**And** I see a "Connect Now" button that initiates OAuth
**And** the schedule picker remains open

**Given** I click "Cancel" in the schedule picker
**When** the picker closes
**Then** no schedule is created
**And** the card remains in the feed unchanged

**Given** a scheduled post's time arrives
**When** the backend job runs
**Then** the LinkedIn API is called to publish the post
**And** the scheduled_post status is updated accordingly

---

### Story 5.2: Post Immediately to LinkedIn

As a user,
I want to post a card immediately to LinkedIn,
So that I can share timely content right away.

**Acceptance Criteria:**

**Given** I am viewing a card in detail view
**When** I look at the actions
**Then** I see a "Post Now" button (secondary to Schedule)

**Given** I click "Post Now"
**When** LinkedIn is connected
**Then** a confirmation appears: "Post this to LinkedIn now?"
**And** I see the card content preview
**And** I see "Cancel" and "Post" buttons

**Given** I confirm the immediate post
**When** I click "Post"
**Then** the button shows a loading state
**And** the LinkedIn API is called to create the post

**Given** the LinkedIn API call succeeds
**When** the post is published
**Then** I see a success toast "Posted to LinkedIn!"
**And** the card status changes to "posted"
**And** the card is removed from the active feed
**And** the response completes within 5 seconds (NFR5)

**Given** the LinkedIn API call fails
**When** the error is caught
**Then** I see an error alert (not just a toast)
**And** the alert shows "LinkedIn posting failed"
**And** I see "Try Again" and "Copy Post" buttons
**And** the card remains in the feed unchanged

**Given** I click "Post Now" but LinkedIn is not connected
**When** the action is attempted
**Then** I see a message "Connect LinkedIn to post"
**And** I see a "Connect Now" button
**And** I see a "Copy Instead" button as fallback

**Given** the LinkedIn access token has expired
**When** a post is attempted
**Then** the system automatically uses the refresh token
**And** obtains a new access token
**And** retries the post request
**And** the user is not interrupted (NFR19)

**Given** the refresh token is also expired/invalid
**When** the post fails
**Then** I see "LinkedIn connection expired. Please reconnect."
**And** I see a "Reconnect" button that initiates OAuth
**And** my post content is preserved

**Given** a post succeeds
**When** the card is marked as posted
**Then** the cards table is updated with:
- status = "posted"
- posted_at timestamp
- linkedin_post_id (returned from LinkedIn API)

---

### Story 5.3: View Scheduled Posts

As a user,
I want to view all my scheduled posts in one place,
So that I can see what content is queued for publishing.

**Acceptance Criteria:**

**Given** I am logged in
**When** I click "Scheduled" in the sidebar navigation
**Then** I navigate to the scheduled posts page
**And** the sidebar shows "Scheduled" as active

**Given** I am on the scheduled posts page
**When** I view the page
**Then** I see a list of my scheduled posts
**And** posts are sorted by scheduled time (soonest first)
**And** the page title is "Scheduled Posts"

**Given** I have scheduled posts
**When** I view each item
**Then** I see:
- Card content preview (truncated if long)
- Scheduled date and time
- Platform icon (LinkedIn)
- "Cancel" button
- Time until posting ("Posts in 2 hours")

**Given** I have no scheduled posts
**When** I view the page
**Then** I see an empty state
**And** the message says "No scheduled posts"
**And** I see a "Browse Cards" button to return to feed

**Given** scheduled posts are loading
**When** the API request is in progress
**Then** I see skeleton placeholders
**And** the skeletons match the list item layout

**Given** I click on a scheduled post item
**When** the click is registered
**Then** I can view the full card content
**And** I see options to edit, cancel, or reschedule

**Given** a scheduled post's time passes while I'm viewing the list
**When** the post is published
**Then** the item is removed from the list
**And** the list updates without requiring a refresh
**And** a toast shows "Post published to LinkedIn!"

**Given** the scheduled posts list
**When** I want to see past posts
**Then** only pending scheduled posts are shown by default
**And** published posts are in a separate "Posted" section or filtered out

---

### Story 5.4: Cancel Scheduled Post

As a user,
I want to cancel a scheduled post before it publishes,
So that I can change my mind or make edits before it goes live.

**Acceptance Criteria:**

**Given** I am viewing my scheduled posts
**When** I look at a scheduled post
**Then** I see a "Cancel" button for each post

**Given** I click "Cancel" on a scheduled post
**When** the click is registered
**Then** a confirmation modal appears
**And** the modal says "Cancel scheduled post?"
**And** I see "Keep Scheduled" and "Cancel Post" buttons

**Given** I confirm cancellation
**When** I click "Cancel Post"
**Then** the cancellation request is sent to the backend
**And** the button shows a loading state

**Given** the cancellation succeeds
**When** the API responds
**Then** the scheduled post is removed from the list
**And** the card's status returns to "active"
**And** the card reappears in my card feed
**And** a toast shows "Scheduled post cancelled"

**Given** I click "Keep Scheduled"
**When** the modal closes
**Then** no changes are made
**And** the post remains scheduled

**Given** the scheduled_posts record
**When** cancellation is processed
**Then** the status is updated to "cancelled"
**And** the cancelled_at timestamp is recorded
**And** the associated card status is set to "active"

**Given** I try to cancel but the post has already been published
**When** the cancellation request is made
**Then** the API returns an error
**And** I see "This post has already been published"
**And** the list refreshes to show current state

**Given** the cancellation API fails for other reasons
**When** the error is caught
**Then** the modal closes
**And** an error toast shows "Couldn't cancel. Please try again."
**And** the scheduled post remains in the list

**Given** a scheduled post is within 1 minute of publishing
**When** I try to cancel
**Then** cancellation is still attempted
**And** if the timing race fails, I see "Post may have already published"

---

### Story 5.5: Copy Card to Clipboard

As a user,
I want to copy card content to my clipboard,
So that I can manually paste and post if automated posting fails.

**Acceptance Criteria:**

**Given** I am viewing a card in the feed
**When** I look at the card actions
**Then** I see a copy button (clipboard icon)
**And** the button has a tooltip "Copy to clipboard"

**Given** I am viewing a card in detail view
**When** I look at the actions
**Then** I see a "Copy" button with text label

**Given** I click the copy button
**When** the action is triggered
**Then** the card's text content is copied to my clipboard
**And** a success toast shows "Copied to clipboard!"
**And** the toast auto-dismisses after 4 seconds

**Given** the copy action succeeds
**When** I paste in another application
**Then** the full card content is pasted
**And** formatting is preserved as plain text
**And** no extra metadata is included

**Given** I copy an edited card
**When** the content is copied
**Then** the edited content is copied (not original)

**Given** the browser doesn't support clipboard API
**When** copy is attempted
**Then** a fallback method is used (document.execCommand)
**And** if that fails, I see "Couldn't copy. Please select and copy manually."

**Given** a LinkedIn posting error occurs
**When** the error alert is shown
**Then** "Copy Post" is offered as a primary fallback action
**And** clicking it copies the content immediately
**And** the alert remains open for the user to navigate to LinkedIn

**Given** I copy a card
**When** the copy succeeds
**Then** no change is made to the card status
**And** the card remains in the feed
**And** I can still schedule or post through the app

**Given** I am on mobile
**When** I tap the copy button
**Then** the copy action works the same as desktop
**And** the toast is visible above the bottom navigation

---

## Epic 6: Error Handling & Resilience

**Goal:** Users have clear feedback during operations and can recover gracefully from errors.

### Story 6.1: Toast Notification System

As a user,
I want to see brief feedback notifications for my actions,
So that I know when operations succeed or encounter minor issues.

**Acceptance Criteria:**

**Given** the toast notification system is implemented
**When** an action completes successfully
**Then** a toast notification appears in the bottom-right corner
**And** the toast displays the success message
**And** the toast has a green success indicator

**Given** a success toast is displayed
**When** 4 seconds pass
**Then** the toast automatically fades out
**And** the toast is removed from the DOM

**Given** an action encounters a minor error
**When** the error is non-blocking
**Then** an error toast appears with red indicator
**And** the message describes what failed
**And** the toast persists until dismissed (does not auto-dismiss)

**Given** informational feedback is needed
**When** info toast is triggered
**Then** an info toast appears with neutral/blue indicator
**And** the toast auto-dismisses after 4 seconds

**Given** a toast is displayed
**When** I look at the toast
**Then** I see an icon indicating the type (check, X, info)
**And** I see the message text
**And** I see a dismiss button (X)

**Given** I click the dismiss button on a toast
**When** the click is registered
**Then** the toast immediately fades out
**And** the toast is removed from the stack

**Given** multiple toasts are triggered in quick succession
**When** they are displayed
**Then** toasts stack vertically (max 3 visible)
**And** oldest toast is at the top
**And** newest toast appears at the bottom
**And** if a 4th toast arrives, the oldest auto-dismisses

**Given** a toast is displayed
**When** a screen reader is active
**Then** the toast has role="status" for success/info
**And** the toast has role="alert" for errors
**And** the message is announced to assistive technology

**Given** the toast service
**When** components need to show notifications
**Then** they can inject ToastService
**And** call `toast.success(message)`, `toast.error(message)`, `toast.info(message)`

**Given** I am on mobile viewport
**When** a toast appears
**Then** the toast is positioned above the bottom navigation
**And** the toast is full-width with appropriate padding
**And** the dismiss button has adequate touch target (44px)

**Given** the user prefers reduced motion
**When** a toast appears or dismisses
**Then** the animation is instant (no fade)
**And** the functionality is unchanged

---

### Story 6.2: Error Alert Component

As a user,
I want to see clear error alerts with recovery options when operations fail,
So that I understand what went wrong and can take action to resolve it.

**Acceptance Criteria:**

**Given** a blocking error occurs (e.g., LinkedIn posting fails)
**When** the error is caught
**Then** an error alert component is displayed inline
**And** the alert appears near the action that failed

**Given** an error alert is displayed
**When** I view the alert
**Then** I see a warning icon
**And** I see a clear title (e.g., "LinkedIn posting failed")
**And** I see a helpful description of what happened
**And** I see action buttons for recovery

**Given** the error alert for LinkedIn posting failure
**When** displayed
**Then** I see "Try Again" as the primary action button
**And** I see "Copy Post" as a secondary action button
**And** the messaging is calm, not alarming (FR27)

**Given** I click "Try Again" on an error alert
**When** the retry is initiated
**Then** the button shows a loading state
**And** the original action is retried
**And** if successful, the alert is dismissed and success toast shown
**And** if failed again, the alert updates with retry count (FR28)

**Given** I click "Copy Post" on a posting error alert
**When** the action is triggered
**Then** the card content is copied to my clipboard
**And** a success toast shows "Copied to clipboard!"
**And** the alert remains visible so I can navigate to LinkedIn (FR29)

**Given** an error alert is displayed
**When** I want to dismiss it without action
**Then** I can click an X or "Dismiss" link
**And** the alert is removed
**And** the underlying card/content remains accessible

**Given** the error alert component
**When** implemented
**Then** it follows the BEM structure: `.error-alert`, `.error-alert__icon`, `.error-alert__content`, `.error-alert__title`, `.error-alert__text`, `.error-alert__actions`

**Given** the error alert
**When** rendered
**Then** it uses the design system colors:
- Background: slightly elevated surface color
- Border: subtle or warning color
- Icon: warning/error color
- Text: primary and secondary text colors

**Given** multiple types of errors
**When** alerts are needed
**Then** the component accepts props for:
- title (string)
- message (string)
- primaryAction (label + callback)
- secondaryAction (label + callback, optional)
- onDismiss (callback, optional)

**Given** an error alert is displayed
**When** using keyboard navigation
**Then** focus moves to the alert
**And** action buttons are focusable
**And** pressing Escape dismisses the alert

---

### Story 6.3: Loading State Components

As a user,
I want to see loading indicators during operations,
So that I know the system is working and can anticipate results.

**Acceptance Criteria:**

**Given** content is being fetched (cards, scheduled posts, etc.)
**When** the API request is in progress
**Then** skeleton placeholders are displayed
**And** skeletons match the layout of expected content (FR30)

**Given** the skeleton component
**When** rendered for text content
**Then** it displays rounded rectangles of varying widths
**And** widths vary to simulate natural text (100%, 80%, 60%)

**Given** the skeleton component
**When** rendered for a card
**Then** it shows a card-shaped placeholder
**And** includes skeleton lines for content
**And** includes skeleton rectangles for buttons

**Given** skeleton components are displayed
**When** animating
**Then** a shimmer effect moves across the skeleton
**And** the animation is smooth and subtle
**And** the animation respects prefers-reduced-motion

**Given** a button triggers an async action
**When** the action is in progress
**Then** the button shows a loading state
**And** a spinner replaces or accompanies the button text
**And** the button text changes to "-ing" form (e.g., "Scheduling...")
**And** the button is disabled to prevent duplicate clicks

**Given** card generation is in progress
**When** the user is waiting
**Then** skeleton cards are displayed in the feed area
**And** the number of skeletons matches expected output (5 cards)
**And** a message may say "Generating your cards..."

**Given** the loading state
**When** content loads successfully
**Then** skeletons are immediately replaced with real content
**And** no flash or flicker occurs
**And** the transition is smooth

**Given** the loading service
**When** components need to track loading state
**Then** each service maintains its own `isLoading` signal
**And** components can bind to `service.isLoading()` for UI state

**Given** multiple loading states are possible
**When** different operations are in progress
**Then** each has independent loading indicators
**And** loading states don't interfere with each other

**Given** a very fast API response (< 200ms)
**When** loading state would flash briefly
**Then** a minimum display time of 200ms prevents flicker
**And** the skeleton doesn't appear for very fast loads

**Given** the skeleton component
**When** implemented
**Then** it follows BEM: `.skeleton`, `.skeleton--text`, `.skeleton--card`, `.skeleton--avatar`
**And** variants are available for different use cases

---

### Story 6.4: Global Error Handling & Resilience

As a user,
I want the application to handle unexpected errors gracefully,
So that I'm never stuck without a path forward.

**Acceptance Criteria:**

**Given** an HTTP request fails with a 401 Unauthorized
**When** the auth interceptor catches it
**Then** the user is redirected to the login page
**And** a toast shows "Session expired. Please log in again."
**And** the attempted URL is stored for redirect after login

**Given** an HTTP request fails with a 403 Forbidden
**When** the error is caught
**Then** the user sees "You don't have permission for this action"
**And** no redirect occurs
**And** the user can continue using other features

**Given** an HTTP request fails with a 404 Not Found
**When** the error is caught
**Then** the UI shows "Not found" for that specific resource
**And** a "Go back" or "Return to feed" option is provided

**Given** an HTTP request fails with a 500 Server Error
**When** the error is caught
**Then** the user sees "Something went wrong on our end"
**And** a "Try Again" option is provided
**And** the error is logged for debugging

**Given** an HTTP request fails with network error (no connection)
**When** the error is caught
**Then** the user sees "Unable to connect. Check your internet."
**And** a "Retry" button is provided
**And** the user's unsaved work is preserved

**Given** the API returns a standard error response
**When** the error has a code (e.g., "RATE_LIMITED", "GENERATION_FAILED")
**Then** the error code is mapped to a user-friendly message
**And** appropriate recovery actions are offered

**Given** error code mapping
**When** errors are displayed
**Then** the following mappings apply:
- UNAUTHORIZED → "Please log in again"
- FORBIDDEN → "You don't have permission"
- NOT_FOUND → "Resource not found"
- VALIDATION_ERROR → Specific field errors shown inline
- GENERATION_FAILED → "Couldn't generate content. Please try again."
- LINKEDIN_ERROR → "LinkedIn connection issue"
- RATE_LIMITED → "Too many requests. Please wait a moment."

**Given** a transient error occurs (network hiccup, 503)
**When** retry logic is appropriate
**Then** the system retries up to 3 times
**And** uses exponential backoff (1s, 2s, 4s)
**And** if all retries fail, shows error to user

**Given** a critical application error occurs
**When** the error would crash the app
**Then** an error boundary catches it
**And** the user sees a friendly error page
**And** a "Reload" button is provided
**And** the error is logged for debugging

**Given** the global error handler
**When** any uncaught error occurs
**Then** it is logged with context (URL, user ID, timestamp)
**And** sensitive data is not logged
**And** the user experience degrades gracefully

**Given** an operation fails
**When** user data might be lost
**Then** the system preserves user input
**And** recovery attempts restore their work
**And** the user is never blocked without a fallback option (NFR21)

**Given** the error interceptor
**When** implemented
**Then** it is registered in the app providers
**And** all HttpClient requests pass through it
**And** errors are transformed to a consistent format
