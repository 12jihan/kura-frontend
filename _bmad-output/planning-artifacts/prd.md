---
stepsCompleted: [step-01-init, step-02-discovery, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish]
inputDocuments:
  - product-brief-kura-frontend-2026-02-02.md
workflowType: 'prd'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
projectType: greenfield
classification:
  projectType: web_app_saas
  domain: general_martech
  complexity: low-medium
  projectContext: greenfield
techStack:
  frontend: Angular 21
  backend: Express + TypeScript + PostgreSQL
  ai: Gemini API
  auth: Firebase Authentication
  platforms: [LinkedIn, Twitter/X, Instagram]
---

# Product Requirements Document - kura-frontend

**Author:** 12jihan
**Date:** 2026-02-02

---

## Success Criteria

### User Success

| Criteria | Specific Target |
|----------|-----------------|
| **Quick Post Creation** | Browse and select a card in under 5 minutes |
| **Daily Value** | 5 fresh, on-brand cards every day |
| **Workflow Relief** | One tool replaces calendar + auto-poster + brainstorming |
| **"Aha!" Moment** | First batch of cards that sound like the user |

### Business Success

| Criteria | Target |
|----------|--------|
| **3-Month Goal** | Hundreds to low thousands of active users |
| **12-Month Goal** | Significant growth in active users |
| **MVP Validation** | Reliably generating 5 quality cards under 10 seconds |
| **Expansion Trigger** | Hit benchmarks → add Twitter/X |

### Technical Success

| Criteria | Target |
|----------|-----------------|
| **AI Generation Speed** | < 10 seconds per card |
| **Daily Generation Volume** | 5 cards per user per day |
| **LinkedIn Posting Reliability** | Posts succeed consistently (target: 99%+) |
| **System Availability** | Standard web app uptime (99%+) |

### Measurable Outcomes

| Outcome | How We Measure |
|---------|----------------|
| **User Activation** | % completing onboarding and viewing first cards |
| **Engagement** | DAU/WAU, cards utilized vs. generated |
| **Retention** | 7-day and 30-day return rates |
| **Quality Signal** | Regeneration rate (some = engaged, too much = quality issue) |

---

## Product Scope

### MVP - Minimum Viable Product

| Feature | Included |
|---------|----------|
| User onboarding | Handle, content type, description, keywords |
| AI instruction generation | Auto-generated from profile |
| Daily card generation | 5 cards/day |
| Card browsing | Homepage feed |
| Card editing | Manual text tweaks |
| Regeneration | Generate new variations |
| LinkedIn posting | Schedule and publish |

**Platform:** LinkedIn only

### Growth Features (Post-MVP)

- Twitter/X integration
- Instagram integration
- Basic performance insights
- Increased daily card volume

### Vision (Future)

- AI learns from post performance
- Team/agency features
- Multi-account management
- Full analytics dashboard
- Content calendar

---

## User Journeys

### Journey 1: Alex's First Day (Happy Path)

**Opening Scene:**
Alex has been drowning in the content grind for months. Every morning starts with the same dread: "What am I going to post today?" He's tried scheduling tools, but they don't help with the hardest part—coming up with ideas. He hears about Kura from a creator friend who says, "It actually writes posts that sound like me."

**Rising Action:**
Skeptical but desperate, Alex signs up. He creates his handle "AlexBuilds," selects "Tech & Startups" as his content type, and adds a few keywords: "indie hacking, bootstrapping, SaaS." He writes a quick description of his brand voice: "Practical advice for solo founders, no fluff."

Within seconds, the AI generates instructions from his profile. Then—magic. Five cards appear on his homepage. Alex clicks into the first one.

**Climax:**
Alex reads the generated post and stops scrolling. *"Wait... this actually sounds like something I'd write."* The tone is right. The topic is relevant. He didn't have to hunt through articles or stare at a blank screen. He makes a small tweak—changes one word—and hits "Schedule for LinkedIn."

**Resolution:**
For the first time in months, Alex's content for tomorrow is done before his first coffee is finished. He closes the laptop and gets back to building his product. Kura isn't just a tool—it's the creative partner he couldn't afford to hire.

---

### Journey 2: Alex Dismisses Off-Brand Content (Edge Case)

**Opening Scene:**
It's Tuesday morning. Alex opens Kura expecting his fresh batch of cards. Four of them look great, but one feels off—it's too formal, almost corporate-sounding. Not his vibe.

**Rising Action:**
Alex clicks the dismiss button on the card. A quick animation confirms it's gone, and the system registers that this style didn't resonate. He doesn't have to explain why—just a simple "not for me."

**Climax:**
Alex moves on to the other four cards, picks two, schedules them. The dismissed card is already forgotten.

**Resolution:**
Over time, Alex notices fewer off-brand suggestions. The dismiss pattern is teaching the system what doesn't work. The friction was minimal—one button, no explanations required.

---

### Journey 3: Alex Hits a LinkedIn Error (Edge Case)

**Opening Scene:**
Alex has crafted the perfect post. He's edited it, added a personal touch, and hits "Post to LinkedIn." But something's wrong—an error alert appears.

**Rising Action:**
The alert reads: *"LinkedIn posting failed. You can try again later or copy the post to paste manually."* Alex is annoyed but not stuck. He hits "Copy Post"—the text is now in his clipboard.

**Climax:**
Alex opens LinkedIn in a new tab, pastes the post, and publishes it directly. It takes 30 extra seconds, but his content is live.

**Resolution:**
Later that day, Alex tries posting another card through Kura—this time it works. The hiccup was temporary, and he was never blocked from getting his content out.

---

### Journey 4: Alex Runs Out of Cards (Edge Case)

**Opening Scene:**
It's a productive day. Alex has already used all 5 of his daily cards—scheduled three, dismissed one, and saved one for later. But inspiration strikes: he wants to post something else.

**Rising Action:**
Alex looks at his empty homepage. A button says "Generate More Cards." He clicks it.

**Climax:**
Within 10 seconds, fresh cards appear. The well never runs dry.

**Resolution:**
Alex selects one more card, schedules it, and moves on. The daily limit was a guideline, not a wall.

---

### Journey Requirements Summary

| Journey | Capabilities Revealed |
|---------|----------------------|
| **First Day (Happy Path)** | Onboarding flow, AI instruction generation, card generation, card editing, LinkedIn scheduling |
| **Dismiss Off-Brand** | Dismiss button, feedback capture, card removal from feed |
| **LinkedIn Error** | Error handling, alert display, copy-to-clipboard, retry option |
| **Out of Cards** | On-demand generation, "Generate More" button |

---

## Web App Specific Requirements

### Project-Type Overview

Kura is a **Single Page Application (SPA)** built with Angular 21, targeting modern browsers. The application prioritizes user experience and performance over legacy compatibility, with basic accessibility standards and optional real-time features for enhanced UX.

### Technical Architecture Considerations

| Aspect | Decision |
|--------|----------|
| **Architecture** | SPA (Single Page Application) |
| **Framework** | Angular 21 with signals |
| **Rendering** | Client-side rendering (CSR) |
| **State Management** | Angular signals / RxJS |
| **API Communication** | REST (Express backend) |

### Browser Support Matrix

| Browser | Version | Support Level |
|---------|---------|---------------|
| **Chrome** | Latest 2 versions | Full |
| **Firefox** | Latest 2 versions | Full |
| **Safari** | Latest 2 versions | Full |
| **Edge** | Latest 2 versions | Full |
| **Mobile Chrome** | Latest | Full |
| **Mobile Safari** | Latest | Full |
| **IE11** | — | Not supported |
| **Legacy browsers** | — | Not supported |

### Responsive Design

| Breakpoint | Target |
|------------|--------|
| **Mobile** | 320px - 767px |
| **Tablet** | 768px - 1023px |
| **Desktop** | 1024px+ |

**Approach:** Mobile-friendly but desktop-first for MVP (creators primarily work on desktop)

### Performance Targets

| Metric | Target |
|--------|--------|
| **First Contentful Paint** | < 1.5s |
| **Largest Contentful Paint** | < 2.5s |
| **Time to Interactive** | < 3.5s |
| **Card Generation Response** | < 10s (AI constraint) |

### SEO Strategy

**Not applicable for MVP** — The main application is a logged-in dashboard experience. No public-facing content requiring SEO optimization.

*Future consideration:* Marketing/landing page (separate from main app) may need SSR/SSG for SEO.

### Accessibility Level

| Standard | Target |
|----------|--------|
| **Level** | Basic / WCAG 2.1 A |
| **Semantic HTML** | Required |
| **Keyboard Navigation** | Required |
| **Focus Management** | Required |
| **Screen Reader** | Best effort |
| **Color Contrast** | Best effort |

**Approach:** Build with semantic HTML and keyboard navigation from the start. Full WCAG AA compliance deferred to post-MVP.

### Real-Time Features (Nice-to-Have)

| Feature | Priority | Implementation |
|---------|----------|----------------|
| **Live card generation updates** | Nice-to-have | WebSocket or polling |
| **Post status notifications** | Nice-to-have | Push notifications / polling |
| **Real-time sync** | Deferred | Not MVP |

**MVP Approach:** Start with polling for simplicity. Evaluate WebSocket/SSE if user experience demands it.

### Implementation Considerations

- **Lazy Loading:** Route-based lazy loading for performance
- **PWA:** Not required for MVP, but architecture should allow future addition
- **Offline Support:** Not required for MVP
- **Caching:** Standard HTTP caching, CDN for static assets

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP
- Solves one clear problem (content creation grind)
- For one clear user (solo creators like Alex)
- On one platform (LinkedIn)
- With one core flow (generate → edit → post)

**Resource Requirements:** Solo developer with AI/full-stack experience

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Alex's First Day (onboarding → first cards → first post)
- Dismiss Off-Brand Content
- LinkedIn Error Recovery
- Generate More Cards

**Must-Have Capabilities:**

| Category | Features |
|----------|----------|
| **Authentication** | Firebase Auth signup/login, Logout |
| **Onboarding** | Handle creation, content type, description, keywords |
| **AI Engine** | Instruction generation, card generation (< 10s) |
| **Card Management** | Browse feed, view details, edit text, dismiss, regenerate |
| **Generation** | Daily batch (5 cards), on-demand generation |
| **Publishing** | LinkedIn scheduling, posting, copy-to-clipboard fallback |
| **Error Handling** | Alerts, retry options, graceful degradation |

### Post-MVP Features

**Phase 2 (Growth):**
- Twitter/X integration
- Instagram integration
- Basic performance insights
- Increased daily card volume
- Post history view

**Phase 3 (Expansion):**
- AI learns from post performance
- Team/agency features
- Multi-account management
- Full analytics dashboard
- Content calendar
- Advanced scheduling (optimal times)

### Risk Mitigation Strategy

| Risk Type | Risk | Mitigation |
|-----------|------|------------|
| **Technical** | Gemini generates off-brand content | Dismiss feedback loop, prompt refinement, regeneration option |
| **Technical** | LinkedIn API unreliable | Copy-to-clipboard fallback, clear error messaging |
| **Market** | Users don't find AI content valuable | Tight MVP to validate quickly, easy to pivot |
| **Resource** | Solo dev bandwidth | Lean scope, no scope creep, phased approach |

---

## Functional Requirements

### 1. User Authentication

- **FR1:** Users can create a new account using Firebase Authentication
- **FR2:** Users can log in to their existing account
- **FR3:** Users can log out of their account
- **FR4:** Users can reset their password if forgotten

### 2. User Profile & Onboarding

- **FR5:** Users can create a handle or business name during onboarding
- **FR6:** Users can select a content type from a predefined dropdown
- **FR7:** Users can specify a custom content category if predefined options don't fit
- **FR8:** Users can add a description of their brand/voice
- **FR9:** Users can add keywords that define their niche
- **FR10:** Users can optionally connect their LinkedIn account during onboarding
- **FR11:** Users can view and edit their profile settings after onboarding

### 3. AI Content Generation

- **FR12:** System generates AI instructions automatically from user's profile inputs
- **FR13:** System generates a daily batch of 5 content cards for each user
- **FR14:** Users can generate additional cards on-demand beyond the daily batch
- **FR15:** Users can regenerate a specific card to get a new variation
- **FR16:** System generates cards that match the user's defined content theme and voice

### 4. Card Management

- **FR17:** Users can browse their generated cards in a feed on the homepage
- **FR18:** Users can view detailed information about a specific card
- **FR19:** Users can edit the text content of a card before publishing
- **FR20:** Users can dismiss a card they don't want (removes from feed)
- **FR21:** System records dismissal feedback for future AI improvement

### 5. Publishing & Scheduling

- **FR22:** Users can schedule a card for future posting to LinkedIn
- **FR23:** Users can post a card immediately to LinkedIn
- **FR24:** Users can view their scheduled posts
- **FR25:** Users can cancel a scheduled post before it publishes
- **FR26:** Users can copy card content to clipboard as a fallback

### 6. Error Handling & Notifications

- **FR27:** System displays clear error alerts when LinkedIn posting fails
- **FR28:** System offers retry option when posting fails
- **FR29:** System provides copy-to-clipboard option when posting fails
- **FR30:** System displays loading states during card generation

---

## Non-Functional Requirements

### Performance

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| **NFR1:** AI card generation | < 10 seconds | Core UX promise |
| **NFR2:** Page load (initial) | < 3 seconds | Standard web performance |
| **NFR3:** Page navigation | < 1 second | SPA responsiveness |
| **NFR4:** API responses (non-AI) | < 500ms | Smooth interactions |
| **NFR5:** LinkedIn posting | < 5 seconds | User confidence |

### Security

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| **NFR6:** Authentication | Firebase Auth (OAuth 2.0) | Industry-standard auth |
| **NFR7:** Data in transit | HTTPS/TLS encryption | Standard web security |
| **NFR8:** API credentials | Server-side only, never exposed to client | Protect Gemini/LinkedIn keys |
| **NFR9:** Session management | Secure token handling via Firebase | Prevent session hijacking |
| **NFR10:** User data storage | Encrypted at rest in PostgreSQL | Protect user content |

### Scalability

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| **NFR11:** Initial capacity | Support 1,000 concurrent users | MVP growth target |
| **NFR12:** Database design | Schema supports horizontal scaling | Future-proofing |
| **NFR13:** Stateless API | No server-side session state | Easy to scale horizontally |

### Accessibility

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| **NFR14:** Compliance level | WCAG 2.1 Level A | Basic accessibility |
| **NFR15:** Keyboard navigation | All core actions accessible via keyboard | Accessibility baseline |
| **NFR16:** Semantic HTML | Proper heading hierarchy, landmarks | Screen reader compatibility |
| **NFR17:** Focus management | Visible focus indicators | Keyboard users |

### Integration

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| **NFR18:** Gemini API | Handle rate limits gracefully | Avoid service disruption |
| **NFR19:** LinkedIn API | Handle OAuth token refresh | Maintain posting capability |
| **NFR20:** Firebase Auth | Handle auth state changes reactively | Smooth login/logout |
| **NFR21:** API error handling | Graceful degradation with user feedback | Never block user |
