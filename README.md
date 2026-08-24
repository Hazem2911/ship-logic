# Ship Guard

Create a polished clickable web dashboard prototype for a product called AI Quality Gate.
AI Quality Gate is an independent senior QA and code-quality layer for software changes created by developers or AI coding agents. It analyzes a repository and change, discovers hidden scenarios, runs deterministic checks, collects evidence, and produces an explainable SHIP, SHIP WITH WARNINGS, or DO NOT SHIP decision.
This is a visual prototype only. Use realistic seeded demo data. Do not implement real Git integration, Gemini calls, Android emulator control, backend APIs, authentication, or database functionality.
Product focus
Design the first experience for a developer reviewing one change:
“Add offline support to the checkout flow.”
The dashboard should communicate release risk clearly and make the user feel that the tool understands the codebase, test evidence, and architecture.
Visual direction
Create a professional engineering control center, not a generic AI dashboard.
Use:
Clean editorial technical layout
Strong hierarchy and compact information density
Warm white or very light gray background
Charcoal text
Deep teal as the primary accent
Amber for warnings
Red only for blocking failures
Blue-gray for neutral information
IBM Plex Sans or a similar distinctive technical font
IBM Plex Mono for commit hashes, test output, identifiers, and command results
Thin borders and restrained shadows
Small border radius, approximately 6px
Clear spacing and alignment
Subtle transitions when navigating between views
Avoid:
Purple gradients
Glowing AI effects
Chatbot-style interfaces
Excessive rounded cards
Fake terminal animations
Large decorative illustrations
Generic SaaS dashboard layouts
Stock images
Marketing hero sections
Excessive use of badges
Claims that the AI is always correct
The interface should look like a serious release-readiness tool used by experienced engineers.
Application shell
Create a persistent application shell with:
Product name: AI Quality Gate
Small status indicator: LOCAL AGENT CONNECTED
Project selector: Commerce Android
Main navigation:
Overview
Changes
Scenarios
Executions
Findings
Reports
Bottom navigation area:
Repository status
Current commit
Settings icon
A prominent current run indicator when a test run is active
Do not make the navigation feel like an admin template. Keep it compact and purposeful.
Screen 1: Project Overview
Show the current project and recent quality activity.
Include:
Project name: Commerce Android
Platform: Android
Build system: Gradle
Repository path or name
Current branch: feature/offline-checkout
Current commit: a84f21c
Repository status: Working tree analyzed
Latest quality decision: DO NOT SHIP
Risk summary
Recent changes table
Open blocking findings
Latest execution summary
Show one recent change:
Title: Add offline support to checkout
Type: Feature
Status: Quality review complete
Result: DO NOT SHIP
Updated: Today
Screen 2: Change Detail
This is the central screen.
Header:
Change title: Add offline support to checkout
Type: Feature
Branch: feature/offline-checkout
Base commit: 7cc901a
Head commit: a84f21c
Status: Review complete
Show a workflow progress strip:
Repository analyzed
Requirements clarified
Hidden scenarios discovered
Code reviewed
Tests executed
Quality gate evaluated
Mark all stages complete, but show the final stage in red because the result is blocking.
Include these sections:
Change summary
Explain that the change adds cached-cart behavior and offline handling to checkout.
Impacted areas
Show:
CheckoutViewModel
CartRepository
CheckoutApi
CheckoutScreen
CheckoutViewModelTest
app/release.gradle.kts
Each item should show why it was included, such as:
Directly changed
Caller of changed symbol
Related test
Build configuration dependency
Developer decisions
Show a short interview summary:
Cached cart should remain visible offline
Checkout must be disabled without network access
Cart editing offline is allowed
Checkout resumes after reconnection
Duplicate submission must be prevented
Make it clear these are confirmed decisions, not AI assumptions.
Screen 3: Scenario Board
Create a scenario board with columns:
Discovered
Planned
Running
Passed
Failed
Inconclusive
Use meaningful scenario rows rather than decorative cards.
Include scenarios such as:
Open cached cart while offline
Attempt checkout while offline
Reconnect during checkout
API timeout during submission
Double-tap checkout button
Process death during checkout
Rotate screen during checkout
Back navigation from payment
Stale cached cart
Expired authentication
Empty checkout response
Online checkout regression
Each scenario should display:
Risk level
Category
Automation status
Short rationale
Show summary numbers at the top:
17 discovered
12 executed
9 passed
2 failed
1 inconclusive
Allow clicking a scenario to open its details.
Screen 4: Scenario Detail / Execution View
When a scenario is selected, show a focused execution view.
Selected scenario:
Attempt checkout while offline
Display:
Status: FAILED
Risk: CRITICAL
Category: Offline / Functional
Preconditions
Ordered test actions
Expected outcome
Actual outcome
Device information
Elapsed time
Actions:
Launch application
Open existing cart
Disable network
Tap checkout
Observe checkout state
Expected:
Checkout is disabled and the user sees an offline explanation.
Actual:
Checkout button remains active and submission request is attempted.
Show a realistic screenshot placeholder area labeled:
Android emulator screenshot
Also show tabs or panels for:
Screenshot
UI hierarchy
Logcat
Action timeline
The action timeline should distinguish deterministic tool results from AI interpretation.
Screen 5: Findings
Create a findings list grouped by severity.
Blocking findings:
Checkout remains actionable while offline
Severity: Critical
Category: Functional regression
Evidence: Scenario OFF-003
Affected file: CheckoutScreen.kt
Reproducibility: 5/5
Confidence: High
Release build fails
Severity: Critical
Category: Build
Evidence: Gradle release build
Affected file: app/release.gradle.kts
Reproducibility: 1/1
Confidence: Certain
Warnings:
New ViewModel bypasses existing repository abstraction
Severity: Medium
Category: Architecture
Evidence: Changed symbol comparison
Confidence: High
Checkout submission lacks explicit duplicate-request protection
Severity: High
Category: Concurrency
Evidence: Double-tap scenario
Confidence: Medium
Every finding must have:
Clear title
Severity
Category
Explanation
Evidence references
Affected files
Reproduction steps
Recommendation
Confidence
Deterministic or AI-derived source indicator
Do not present findings as vague AI opinions.
Screen 6: Finding Detail
Create a detailed finding page for:
Checkout remains actionable while offline
Include:
Large severity indicator: CRITICAL
Explanation
Why this matters
Reproduction steps
Expected versus actual behavior
Evidence preview
Affected code location
Related scenarios
Recommended action
Confidence level
Source classification:
Deterministic execution result
AI interpretation
Use a code-location style panel, but do not display a large amount of fake code.
Screen 7: Quality Gate
Create a strong final decision screen.
Show:
DO NOT SHIP
Supporting summary:
2 blocking findings
1 release build failure
2 architectural warnings
9 scenarios passed
2 scenarios failed
1 scenario inconclusive
Show explicit decision rules:
Blocking functional failure: failed
Critical build check: failed
Required scenario coverage: incomplete
Architecture consistency: warning
Online checkout regression: passed
Explain:
The change is not ready to ship because checkout remains actionable offline and the release build fails. Passing scenarios do not override blocking failures.
Include buttons:
View blocking findings
Review scenarios
Export report
The result must feel explainable and evidence-based, not like an arbitrary AI score.
Architecture representation
The UI should subtly reflect this architecture:
Repository and Git analysis
Context and impact analysis
AI reasoning
Deterministic build and test execution
Android emulator evidence collection
Result analysis
Quality gate decision
Use a compact horizontal pipeline or timeline to show these stages.
Make the distinction visible:
AI reasons about requirements, hidden scenarios, architecture, and failures.
Deterministic tools execute Git, Gradle, tests, emulator actions, screenshots, and logs.
The quality gate applies explicit blocking rules.
Do not represent the product as one giant AI agent or chatbot.
Important architectural decisions
The prototype must respect these decisions:
Local-first execution
Android-first MVP
No silent production-code modification
Structured scenarios and findings
Evidence before judgment
Deterministic checks before AI interpretation
Explainable quality decisions
AI provider independence through an internal provider interface
Dashboard separated from the core quality engine
Repository source code is not stored by default in a remote database
Secrets and private repository content remain protected by the local agent
These decisions should appear naturally through labels, workflow structure, evidence panels, and status explanations. Do not create a separate “architecture lecture” page.
Interaction requirements
Make the prototype clickable:
Navigation items switch screens
Recent changes open Change Detail
Scenario rows open Scenario Detail
Failed scenarios open related findings
Findings open Finding Detail
Quality Gate buttons navigate to blockers and scenarios
Use realistic loading or transition states only where useful
Preserve the selected project and current change while navigating
Responsive behavior
Support desktop and tablet layouts first, with a usable mobile layout.
On smaller screens:
Collapse the sidebar
Stack evidence panels vertically
Keep severity and decision visible
Avoid text overflow
Make tables horizontally scrollable where necessary
Preserve readable technical details
Final prototype boundary
This prototype is a UI and workflow preview only.
Use mocked data and local frontend state. Do not add:
Real authentication
Real database integration
Real Gemini integration
Real Git commands
Real Gradle execution
Real Android emulator control
Autonomous agents
Production code modification
Billing or multi-tenant functionality
Generate a coherent, complete prototype that demonstrates how a developer moves from a code change to an evidence-backed shipping decision.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e94f0671-52d1-446a-a2ac-20b55814edfb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
