---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - ../kura-backend/package.json
  - ../kura-backend/src/index.ts
  - ../kura-backend/src/db.ts
  - src/app/app.ts
  - src/app/app.routes.ts
  - package.json
date: 2026-02-02
author: 12jihan
projectContext: |
  Kura is an AI-powered social media content creation tool.
  - Backend scrapes relevant articles
  - AI generates social media posts from scraped article text
  - Users can review, edit, and publish generated posts
  - Features: article discovery, AI post generation, hashtag creation, publication tracking
---

# Product Brief: kura-frontend

## Executive Summary

Kura is an AI-powered social media content creation platform that helps multi-platform content creators overcome the daily grind of staying active and relevant. By automatically curating articles tailored to a creator's personal theme and transforming them into ready-to-use post ideas, Kura turns content creation from a chore into discovery.

The platform presents a card-based feed of AI-generated posts that creators can browse, explore in detail, and regenerate on the fly—ensuring fresh, personalized ideas are always at their fingertips.

---

## Core Vision

### Problem Statement

Content creators who maintain an active presence across LinkedIn, Twitter/X, and Instagram face a relentless challenge: producing engaging, relevant content every single day. The time spent hunting for ideas, reading articles, and crafting platform-appropriate posts drains creative energy and leads to burnout.

### Problem Impact

- **Time drain**: Hours spent searching for relevant content to share
- **Creative fatigue**: Staring at blank screens, struggling to generate fresh angles
- **Inconsistency**: Falling behind on posting schedules hurts algorithmic reach and audience growth
- **Platform juggling**: Each platform demands different tones, formats, and approaches

### Why Existing Solutions Fall Short

Current tools offer automation but lack flexibility. They treat AI as a rigid templating engine rather than a creative partner. Existing solutions don't:
- Curate content personalized to a creator's unique theme
- Stimulate new and interesting ideas
- Provide the flexibility to explore, regenerate, and refine on the fly

### Proposed Solution

Kura delivers a personalized content discovery and creation experience:
1. **Themed Curation**: AI finds and scrapes articles relevant to the creator's defined niche
2. **Card-Based Feed**: Generated post ideas appear as browsable cards—always fresh, always on-theme
3. **Deep Exploration**: Click into any card for more details, context, and variations
4. **On-the-Fly Generation**: Regenerate or refine content instantly
5. **Multi-Platform Ready**: Content tailored for LinkedIn, Twitter/X, and Instagram

### Key Differentiators

| Differentiator | Description |
|----------------|-------------|
| **Personalized Discovery** | Articles curated to your theme, not generic trending content |
| **Creative Stimulation** | AI as idea generator, not just copy machine |
| **Card-Based UX** | Content creation feels like browsing, not working |
| **Flexibility** | Regenerate, explore, and refine—never stuck with one output |
| **Multi-Platform Native** | Built for creators who juggle multiple social platforms |

---

## Target Users

### Primary Users

**Solo Creators Building a Personal Brand**

Content creators who manage their own social media presence across LinkedIn, Twitter/X, and Instagram without the budget to hire a social media team or content professionals.

#### Primary Persona: Alex — The Busy Solo Creator

**Background:**
- Building a personal brand in their niche (tech, business, wellness, finance, etc.)
- Manages multiple social media accounts single-handedly
- Has an extremely busy schedule—content creation competes with core work
- Knows consistent posting drives growth but struggles to keep up

**Current Pain Points:**
- Uses fragmented tools: Google Calendar for scheduling, separate auto-poster for publishing
- Still has to come up with every single post idea manually—the hardest part
- Hates juggling multiple tools that don't talk to each other
- The creative bottleneck leads to burnout and inconsistent posting

**What Alex Needs:**
- One tool that generates ideas, not just schedules posts
- Content that sounds like *him*, not generic AI output
- A streamlined workflow: browse, refine, schedule—done
- Time back in his day without sacrificing quality or authenticity

**Success Vision:**
Alex opens Kura each morning to find fresh, on-brand post ideas waiting for him. He picks the best ones, makes quick tweaks, schedules them across platforms, and gets on with his day. No more staring at blank screens. No more hunting for content. No more tool-juggling.

### Secondary Users

N/A — Focusing on solo creators for initial product scope.

### User Journey

#### 1. Discovery
Alex hears about Kura through creator communities, social media threads, or word of mouth from fellow creators frustrated with the content grind.

#### 2. Onboarding
| Step | Action |
|------|--------|
| 1 | Sign up and create a handle or business name |
| 2 | Optionally connect social media accounts |
| 3 | Select content type from dropdown or specify custom category |
| 4 | Add description and keywords that define their niche |
| 5 | AI instructions are auto-generated from inputs |
| 6 | Homepage displays first batch of generated post cards |

#### 3. The "Aha!" Moment
Alex sees his first batch of AI-generated cards and realizes: *"These actually sound like me."* The tone matches. The topics are relevant. He didn't have to hunt or brainstorm—Kura understood his brand.

#### 4. Daily Routine
- **Morning:** Kura presents a fresh batch of daily cards tailored to Alex's theme
- **Selection:** Alex browses cards, picks the ones that fit his goals for the day
- **Refinement:** Quick edits or regeneration if something needs tweaking
- **Scheduling:** Batches selected posts and schedules them for auto-posting
- **Monitoring:** Checks performance of previously posted content
- **On-Demand:** Generates additional cards anytime inspiration is needed

#### 5. Long-Term Value
Kura becomes Alex's creative partner—always there with ideas, never burning out, always on-brand. Posting becomes sustainable, engagement grows, and Alex finally has time for the work that matters most.

---

## Success Metrics

### User Success Metrics

Success for Kura users is defined by outcomes that restore control and reduce overwhelm:

| Metric | Success Indicator |
|--------|-------------------|
| **Workflow Consistency** | Users establish a dependable content routine they can stick to |
| **Time Reclaimed** | Users report more free time by reducing content creation effort |
| **Mental Relief** | Users no longer juggle multiple fragmented tools |
| **Quick Post Creation** | Users can generate post ideas in moments, not hours |
| **Daily Value Delivery** | Fresh AI-generated cards provide consistent inspiration |

**The "Aha!" Validation:** Users realize they haven't stressed about content creation in over a week—while posting more consistently than before.

### Business Objectives

| Timeframe | Objective |
|-----------|-----------|
| **3 Months** | Achieve hundreds to low thousands of active users |
| **12 Months** | Grow user base significantly with increased daily/weekly active users |
| **Long-term Vision** | Evolve from side project to scalable product if traction proves demand |

**Product Stage:** Early-stage side project with growth potential. Focus is on learning, validating value, and iterating based on real user behavior.

### Key Performance Indicators

KPIs are directional at this stage—targets remain flexible as the product finds its footing.

#### User-Focused KPIs
| KPI | What It Measures |
|-----|------------------|
| **Activation Rate** | % of signups who complete onboarding and view first cards |
| **Daily Active Users (DAU)** | Users engaging with Kura daily |
| **Weekly Active Users (WAU)** | Users returning at least once per week |
| **Posts Scheduled** | Number of AI-generated posts actually scheduled for publishing |

#### Engagement KPIs
| KPI | What It Measures |
|-----|------------------|
| **Card Utilization Rate** | % of generated cards that users select and use |
| **Regeneration Rate** | How often users regenerate or refine cards (healthy engagement signal) |
| **Session Duration** | Time spent in Kura per session |

#### Growth KPIs
| KPI | What It Measures |
|-----|------------------|
| **User Growth Rate** | New signups per week/month |
| **7-Day Retention** | % of users active 7 days after signup |
| **30-Day Retention** | % of users still active after 30 days |

**Guiding Principle:** At this stage, metrics inform iteration—not rigid targets. Watch for patterns that indicate value creation and double down on what works.

---

## MVP Scope

### Core Features

The MVP focuses on delivering immediate value to solo creators posting on LinkedIn:

| Feature | Description |
|---------|-------------|
| **User Onboarding** | Create handle/business name, select content type (dropdown or custom), add description and keywords |
| **AI Instruction Generation** | Automatically generate AI prompts from user's profile inputs |
| **Card-Based Homepage** | Display AI-generated LinkedIn post cards in a browsable feed |
| **Daily Card Generation** | Fresh batch of personalized cards generated every day |
| **On-Demand Generation** | Generate additional cards anytime inspiration is needed |
| **Card Editing** | Manually tweak and refine post text before publishing |
| **Regeneration** | Regenerate individual cards for new variations |
| **Card Detail View** | Click into cards for expanded context and information |
| **LinkedIn Posting** | Schedule and publish posts directly to LinkedIn |

**Platform Focus:** LinkedIn only for MVP

**Core Value Delivered:** Alex can sign up, define his brand, and immediately start browsing AI-generated post ideas that sound like him—then edit, regenerate, and post to LinkedIn without leaving Kura.

### Out of Scope for MVP

| Deferred Feature | Rationale |
|------------------|-----------|
| **Twitter/X Integration** | Expansion platform after MVP validation |
| **Instagram Integration** | Different content format; added complexity |
| **Analytics/Performance Tracking** | Nice-to-have; not essential for core problem |
| **AI Learning from Performance** | Future enhancement after data collection |
| **Team/Collaboration Features** | Solo creators are the initial focus |
| **Multiple Accounts per User** | Simplify v1; expand later |
| **Advanced Scheduling** | Optimal timing, recurring posts deferred |

### MVP Success Criteria

| Criteria | What It Validates |
|----------|-------------------|
| **AI Quality** | Generated content consistently matches user's brand and tone |
| **Technical Reliability** | LinkedIn posting works consistently without failures |
| **User Adoption** | Healthy number of active users engaging with the platform regularly |
| **Expansion Readiness** | User traction + technical reliability = green light for Twitter/X |

**Go/No-Go Decision:** Proceed to v2 (Twitter/X integration) when AI quality is proven, LinkedIn posting is reliable, and active user base demonstrates demand.

### Future Vision

#### Platform Roadmap
1. **MVP:** LinkedIn
2. **V2:** Twitter/X
3. **V3:** Instagram
4. **Future:** Additional platforms as demand dictates (Threads, TikTok, etc.)

#### Feature Evolution
| Phase | Capabilities |
|-------|--------------|
| **Post-MVP** | Twitter/X integration, basic performance insights |
| **Growth Phase** | AI learns from post performance to improve suggestions |
| **Scale Phase** | Team features, agency/brand support, multi-account management |
| **Mature Product** | Full analytics dashboard, content calendar, advanced scheduling |

#### 2-3 Year Vision
Kura evolves from a solo creator tool into a **Social Media Command Center**:

- **AI Creative Partner:** An AI that knows your brand better than you do, learning from every post's performance to continuously improve suggestions
- **Multi-Platform Hub:** Unified management across all major social platforms
- **Team Collaboration:** Agency and brand support with role-based access and workflows
- **Performance Intelligence:** Deep analytics that connect content to outcomes

**The North Star:** Kura becomes the creative partner every content creator wishes they had—always on, always learning, always on-brand.
