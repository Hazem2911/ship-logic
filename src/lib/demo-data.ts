// Seeded demo data for the AI Quality Gate prototype.
// Static, local-only. No network, git, gradle or emulator access.

export type Severity = "critical" | "high" | "medium" | "low";
export type Source = "deterministic" | "ai";
export type ScenarioStatus =
  | "discovered"
  | "planned"
  | "running"
  | "passed"
  | "failed"
  | "inconclusive";

export const project = {
  name: "Commerce Android",
  platform: "Android",
  buildSystem: "Gradle 8.7 (Kotlin DSL)",
  repository: "~/dev/commerce-android",
  remote: "git@internal:commerce/commerce-android.git",
  branch: "feature/offline-checkout",
  commit: "a84f21c",
  baseCommit: "7cc901a",
  repoStatus: "Working tree analyzed",
  agent: "LOCAL AGENT CONNECTED",
  agentDetail: "Agent v0.9.4 · localhost · repository contents stay on this machine",
  lastDecision: "DO NOT SHIP",
  analyzedAt: "Today, 14:52",
};

export const change = {
  id: "offline-checkout",
  title: "Add offline support to checkout",
  type: "Feature",
  status: "Review complete",
  result: "DO NOT SHIP" as const,
  updated: "Today, 14:52",
  author: "h.saleh",
  summary:
    "Introduces a cached-cart layer so a previously loaded cart stays visible without network access, and adds offline handling to the checkout flow. Cart contents are persisted locally on load, the checkout screen reads connectivity state, and submission is retried once connectivity returns.",
  summaryDetail:
    "The change touches presentation, repository and API layers, plus the release build configuration. Impact analysis followed changed symbols outward one hop through callers and related tests.",
  stats: { files: 9, added: 412, removed: 63, commits: 4 },
};

export const workflow = [
  { name: "Repository analyzed", detail: "Git diff, symbol graph", state: "complete" },
  { name: "Requirements clarified", detail: "5 developer decisions", state: "complete" },
  { name: "Hidden scenarios discovered", detail: "17 scenarios", state: "complete" },
  { name: "Code reviewed", detail: "Architecture + diff review", state: "complete" },
  { name: "Tests executed", detail: "12 executions, 1 build", state: "complete" },
  { name: "Quality gate evaluated", detail: "2 blocking rules failed", state: "blocked" },
] as const;

export const pipeline = [
  { stage: "Repository & Git analysis", kind: "deterministic", detail: "diff, blame, symbol graph" },
  { stage: "Context & impact analysis", kind: "deterministic", detail: "callers, tests, build config" },
  { stage: "AI reasoning", kind: "ai", detail: "requirements, hidden scenarios, architecture" },
  { stage: "Build & test execution", kind: "deterministic", detail: "Gradle, JVM unit tests" },
  { stage: "Emulator evidence", kind: "deterministic", detail: "actions, screenshots, logcat" },
  { stage: "Result analysis", kind: "ai", detail: "failure interpretation, findings" },
  { stage: "Quality gate decision", kind: "rules", detail: "explicit blocking rules" },
] as const;

export const impactedAreas = [
  {
    name: "CheckoutViewModel.kt",
    path: "app/src/main/java/.../checkout/CheckoutViewModel.kt",
    reason: "Directly changed",
    detail: "Offline state machine and retry added",
  },
  {
    name: "CartRepository.kt",
    path: "app/src/main/java/.../cart/CartRepository.kt",
    reason: "Directly changed",
    detail: "Local cache write-through added",
  },
  {
    name: "CheckoutApi.kt",
    path: "app/src/main/java/.../network/CheckoutApi.kt",
    reason: "Caller of changed symbol",
    detail: "submitOrder() invoked from new code path",
  },
  {
    name: "CheckoutScreen.kt",
    path: "app/src/main/java/.../checkout/CheckoutScreen.kt",
    reason: "Directly changed",
    detail: "Connectivity banner, button enablement",
  },
  {
    name: "CheckoutViewModelTest.kt",
    path: "app/src/test/java/.../checkout/CheckoutViewModelTest.kt",
    reason: "Related test",
    detail: "Covers changed symbols in this diff",
  },
  {
    name: "app/release.gradle.kts",
    path: "app/release.gradle.kts",
    reason: "Build configuration dependency",
    detail: "New room-cache dependency not declared for release",
  },
];

export const decisions = [
  { text: "Cached cart should remain visible offline", by: "Confirmed by developer", at: "14:31" },
  { text: "Checkout must be disabled without network access", by: "Confirmed by developer", at: "14:32" },
  { text: "Cart editing offline is allowed", by: "Confirmed by developer", at: "14:33" },
  { text: "Checkout resumes after reconnection", by: "Confirmed by developer", at: "14:34" },
  { text: "Duplicate submission must be prevented", by: "Confirmed by developer", at: "14:35" },
];

export const scenarioStats = {
  discovered: 17,
  executed: 12,
  passed: 9,
  failed: 2,
  inconclusive: 1,
};

export type Scenario = {
  id: string;
  code: string;
  title: string;
  status: ScenarioStatus;
  risk: Severity;
  category: string;
  automation: "Automated (emulator)" | "Automated (unit)" | "Manual review" | "Not automated";
  rationale: string;
  preconditions?: string[];
  actions?: string[];
  expected?: string;
  actual?: string;
  device?: string;
  elapsed?: string;
  findingId?: string;
};

export const scenarios: Scenario[] = [
  {
    id: "off-001",
    code: "OFF-001",
    title: "Open cached cart while offline",
    status: "passed",
    risk: "high",
    category: "Offline / Functional",
    automation: "Automated (emulator)",
    rationale: "Confirmed decision: cached cart must remain visible without network.",
    preconditions: ["Cart previously loaded online", "Airplane mode enabled"],
    actions: ["Launch application", "Disable network", "Open cart"],
    expected: "Cached cart renders with a stale-data notice.",
    actual: "Cached cart rendered with stale-data notice after 240 ms.",
    device: "Pixel 6 API 34 · emulator-5554",
    elapsed: "18.4s",
  },
  {
    id: "off-003",
    code: "OFF-003",
    title: "Attempt checkout while offline",
    status: "failed",
    risk: "critical",
    category: "Offline / Functional",
    automation: "Automated (emulator)",
    rationale: "Directly contradicts the confirmed decision that checkout is disabled offline.",
    preconditions: [
      "Signed-in user with a cached cart of 3 items",
      "Cart previously loaded while online",
      "Device network disabled before checkout entry",
    ],
    actions: [
      "Launch application",
      "Open existing cart",
      "Disable network",
      "Tap checkout",
      "Observe checkout state",
    ],
    expected: "Checkout is disabled and the user sees an offline explanation.",
    actual: "Checkout button remains active and submission request is attempted.",
    device: "Pixel 6 API 34 · emulator-5554 · Android 14",
    elapsed: "22.7s",
    findingId: "f-001",
  },
  {
    id: "off-004",
    code: "OFF-004",
    title: "Reconnect during checkout",
    status: "passed",
    risk: "high",
    category: "Offline / Recovery",
    automation: "Automated (emulator)",
    rationale: "Confirmed decision: checkout resumes after reconnection.",
    expected: "Checkout resumes and submits once connectivity returns.",
    actual: "Resumed after 1.2s and submitted once.",
    device: "Pixel 6 API 34 · emulator-5554",
    elapsed: "31.0s",
  },
  {
    id: "net-002",
    code: "NET-002",
    title: "API timeout during submission",
    status: "failed",
    risk: "high",
    category: "Network / Resilience",
    automation: "Automated (unit)",
    rationale: "New retry path can submit twice when the first request times out late.",
    expected: "One order submitted, timeout surfaced to the user.",
    actual: "Two submissions observed in 2 of 5 runs.",
    device: "JVM unit test · CheckoutViewModelTest",
    elapsed: "3.1s",
    findingId: "f-004",
  },
  {
    id: "con-001",
    code: "CON-001",
    title: "Double-tap checkout button",
    status: "passed",
    risk: "high",
    category: "Concurrency",
    automation: "Automated (emulator)",
    rationale: "Confirmed decision: duplicate submission must be prevented.",
    expected: "Only one submission is dispatched.",
    actual: "One submission; debounce observed at UI layer only.",
    device: "Pixel 6 API 34 · emulator-5554",
    elapsed: "14.2s",
  },
  {
    id: "lif-001",
    code: "LIF-001",
    title: "Process death during checkout",
    status: "inconclusive",
    risk: "high",
    category: "Lifecycle",
    automation: "Automated (emulator)",
    rationale: "Emulator restored state before the assertion window; evidence incomplete.",
    expected: "Checkout state restored or safely reset after process death.",
    actual: "Run ended before assertion; screenshot missing.",
    device: "Pixel 6 API 34 · emulator-5554",
    elapsed: "40.0s",
  },
  {
    id: "lif-002",
    code: "LIF-002",
    title: "Rotate screen during checkout",
    status: "passed",
    risk: "medium",
    category: "Lifecycle",
    automation: "Automated (emulator)",
    rationale: "New state holder must survive configuration change.",
    elapsed: "12.9s",
    device: "Pixel 6 API 34 · emulator-5554",
  },
  {
    id: "nav-001",
    code: "NAV-001",
    title: "Back navigation from payment",
    status: "passed",
    risk: "medium",
    category: "Navigation",
    automation: "Automated (emulator)",
    rationale: "Offline banner must not leak into the payment back stack.",
    elapsed: "10.4s",
    device: "Pixel 6 API 34 · emulator-5554",
  },
  {
    id: "off-007",
    code: "OFF-007",
    title: "Stale cached cart",
    status: "passed",
    risk: "medium",
    category: "Data freshness",
    automation: "Automated (unit)",
    rationale: "Cached cart older than TTL must be revalidated before submission.",
    elapsed: "1.8s",
    device: "JVM unit test",
  },
  {
    id: "aut-002",
    code: "AUT-002",
    title: "Expired authentication",
    status: "planned",
    risk: "high",
    category: "Auth",
    automation: "Not automated",
    rationale: "Offline retry may resubmit with an expired token; needs an emulator run.",
  },
  {
    id: "api-005",
    code: "API-005",
    title: "Empty checkout response",
    status: "discovered",
    risk: "medium",
    category: "API contract",
    automation: "Not automated",
    rationale: "New parser assumes a non-empty order payload.",
  },
  {
    id: "reg-001",
    code: "REG-001",
    title: "Online checkout regression",
    status: "passed",
    risk: "critical",
    category: "Regression",
    automation: "Automated (emulator)",
    rationale: "Baseline online path must remain intact after the offline refactor.",
    expected: "Online checkout completes and order id is returned.",
    actual: "Completed in 4.6s; order id ORD-99231 returned.",
    device: "Pixel 6 API 34 · emulator-5554",
    elapsed: "26.1s",
  },
  {
    id: "off-009",
    code: "OFF-009",
    title: "Offline cart edit then reconnect",
    status: "running",
    risk: "medium",
    category: "Offline / Functional",
    automation: "Automated (emulator)",
    rationale: "Cart editing offline is allowed; merge behaviour on reconnect is unverified.",
  },
  {
    id: "off-010",
    code: "OFF-010",
    title: "Cache eviction under low storage",
    status: "discovered",
    risk: "low",
    category: "Storage",
    automation: "Not automated",
    rationale: "Local cache has no size bound in this change.",
  },
  {
    id: "obs-001",
    code: "OBS-001",
    title: "Offline events missing from analytics",
    status: "discovered",
    risk: "low",
    category: "Observability",
    automation: "Not automated",
    rationale: "No telemetry emitted for offline checkout blocks.",
  },
  {
    id: "a11-001",
    code: "A11-001",
    title: "Offline banner screen-reader label",
    status: "planned",
    risk: "low",
    category: "Accessibility",
    automation: "Manual review",
    rationale: "New banner has no content description.",
  },
  {
    id: "bld-001",
    code: "BLD-001",
    title: "Release build with cache dependency",
    status: "failed",
    risk: "critical",
    category: "Build",
    automation: "Automated (unit)",
    rationale: "Release variant does not resolve the new local cache dependency.",
    expected: "assembleRelease completes.",
    actual: "Unresolved reference: CartCacheDao in release source set.",
    device: "Gradle 8.7 · JDK 17",
    elapsed: "1m 48s",
    findingId: "f-002",
  },
];

export const scenarioColumns: { key: ScenarioStatus; label: string }[] = [
  { key: "discovered", label: "Discovered" },
  { key: "planned", label: "Planned" },
  { key: "running", label: "Running" },
  { key: "passed", label: "Passed" },
  { key: "failed", label: "Failed" },
  { key: "inconclusive", label: "Inconclusive" },
];

export const timeline = [
  { at: "00:00.0", source: "deterministic" as Source, label: "adb shell am start -n com.commerce/.MainActivity", result: "exit 0" },
  { at: "00:03.4", source: "deterministic" as Source, label: "UI node dump captured", result: "412 nodes" },
  { at: "00:05.1", source: "deterministic" as Source, label: "Tap node [resource-id=cart_tab]", result: "matched 1 node" },
  { at: "00:08.9", source: "deterministic" as Source, label: "adb shell svc data disable / wifi disable", result: "exit 0" },
  { at: "00:10.2", source: "ai" as Source, label: "Interpretation: cart shows cached items, offline banner absent", result: "confidence high" },
  { at: "00:12.6", source: "deterministic" as Source, label: "Tap node [resource-id=checkout_cta] enabled=true", result: "matched 1 node" },
  { at: "00:13.0", source: "deterministic" as Source, label: "Logcat capture window opened", result: "1.9k lines" },
  { at: "00:15.7", source: "deterministic" as Source, label: "POST /v2/orders attempted", result: "UnknownHostException" },
  { at: "00:18.3", source: "ai" as Source, label: "Interpretation: checkout not gated on connectivity; expectation violated", result: "confidence high" },
  { at: "00:22.7", source: "deterministic" as Source, label: "Screenshot + hierarchy stored locally", result: "2 artifacts" },
];

export const logcat = `15:04:21.118 D CheckoutVM   state=Idle connectivity=UNKNOWN
15:04:21.402 D CartRepo     cache hit key=cart:u_10482 items=3 age=41s
15:04:22.006 I CheckoutUI   render cta.enabled=true banner=none
15:04:23.771 D CheckoutVM   submit() invoked source=user_tap
15:04:23.774 W OkHttp       no active network, attempting request anyway
15:04:24.019 E CheckoutApi  java.net.UnknownHostException: api.commerce.internal
15:04:24.021 E CheckoutVM   submit failed -> state=Error(generic)
15:04:24.088 I CheckoutUI   render cta.enabled=true banner=none`;

export const hierarchy = `Column #root
  TopAppBar text="Checkout"
  LazyColumn #order_summary
    Row items=3 total="EGP 1,240.00"
  Text #stale_notice visible=false
  Button #checkout_cta
    enabled=true
    contentDescription=null
    text="Place order"
  Text #error_text text="Something went wrong"`;

export type Finding = {
  id: string;
  title: string;
  severity: Severity;
  category: string;
  blocking: boolean;
  source: Source;
  confidence: "Certain" | "High" | "Medium";
  reproducibility: string;
  file: string;
  location: string;
  evidence: string[];
  explanation: string;
  why: string;
  steps: string[];
  expected: string;
  actual: string;
  recommendation: string;
  relatedScenarios: string[];
};

export const findings: Finding[] = [
  {
    id: "f-001",
    title: "Checkout remains actionable while offline",
    severity: "critical",
    category: "Functional regression",
    blocking: true,
    source: "deterministic",
    confidence: "High",
    reproducibility: "5/5",
    file: "CheckoutScreen.kt",
    location: "app/src/main/java/com/commerce/checkout/CheckoutScreen.kt:148 — Button(#checkout_cta)",
    evidence: ["Scenario OFF-003", "Emulator screenshot", "Logcat capture", "UI hierarchy dump"],
    explanation:
      "The checkout call-to-action is enabled from cart validity alone. Connectivity state is collected in CheckoutViewModel but never reaches button enablement, so the user can dispatch a submission with no network. The request fails at the transport layer and surfaces a generic error instead of an offline explanation.",
    why:
      "Confirmed decision 2 states checkout must be disabled without network access. Allowing the tap sends users into a failed payment path with no actionable message, and the failed submission is indistinguishable from a payment decline in current telemetry.",
    steps: [
      "Sign in and load a cart with 3 items while online",
      "Disable data and Wi-Fi on the device",
      "Open the cart from the bottom navigation",
      "Tap Place order",
      "Observe the button state and the message shown",
    ],
    expected: "Checkout is disabled and the user sees an offline explanation.",
    actual: "Checkout button remains active and submission request is attempted.",
    recommendation:
      "Derive button enablement from the same connectivity flow the ViewModel already exposes, and render the offline notice state that exists in CheckoutUiState. Add a UI test asserting cta.enabled == false while offline.",
    relatedScenarios: ["off-003", "off-001", "off-004"],
  },
  {
    id: "f-002",
    title: "Release build fails",
    severity: "critical",
    category: "Build",
    blocking: true,
    source: "deterministic",
    confidence: "Certain",
    reproducibility: "1/1",
    file: "app/release.gradle.kts",
    location: "app/release.gradle.kts:22 — dependencies { }",
    evidence: ["Gradle release build", "Task log assembleRelease"],
    explanation:
      "The new local cache uses CartCacheDao, which is declared only for the debug source set. :app:compileReleaseKotlin fails with an unresolved reference, so the change cannot produce a shippable artifact.",
    why: "A change that cannot be assembled in the release variant cannot be shipped regardless of test results.",
    steps: ["Run ./gradlew :app:assembleRelease on the current head commit"],
    expected: "assembleRelease completes successfully.",
    actual: "Unresolved reference: CartCacheDao — 4 errors, build failed in 1m 48s.",
    recommendation:
      "Move the cache dependency declaration to the shared dependency block, or add the release variant explicitly, then re-run the release assemble check.",
    relatedScenarios: ["bld-001"],
  },
  {
    id: "f-003",
    title: "New ViewModel bypasses existing repository abstraction",
    severity: "medium",
    category: "Architecture",
    blocking: false,
    source: "ai",
    confidence: "High",
    reproducibility: "n/a — static analysis",
    file: "CheckoutViewModel.kt",
    location: "app/src/main/java/com/commerce/checkout/CheckoutViewModel.kt:64 — direct CheckoutApi usage",
    evidence: ["Changed symbol comparison", "Module dependency graph"],
    explanation:
      "CheckoutViewModel calls CheckoutApi directly for the offline retry path, while every other feature reaches the network through a repository. The cache and network read paths now diverge.",
    why:
      "Two write paths to the same order endpoint make duplicate-submission protection and caching rules hard to enforce in one place, which is how the concurrency warning below became possible.",
    steps: ["Compare CheckoutViewModel call sites against CartRepository in the changed symbol graph"],
    expected: "Feature code depends on a repository, not on an API interface.",
    actual: "One direct API dependency added in the presentation layer.",
    recommendation:
      "Move submitOrder() behind CheckoutRepository and keep retry/caching policy in the data layer.",
    relatedScenarios: ["net-002"],
  },
  {
    id: "f-004",
    title: "Checkout submission lacks explicit duplicate-request protection",
    severity: "high",
    category: "Concurrency",
    blocking: false,
    source: "ai",
    confidence: "Medium",
    reproducibility: "2/5",
    file: "CheckoutViewModel.kt",
    location: "app/src/main/java/com/commerce/checkout/CheckoutViewModel.kt:91 — submit()",
    evidence: ["Double-tap scenario", "Scenario NET-002", "Unit test output"],
    explanation:
      "Duplicate protection relies on UI debounce. When a request times out late and the retry path fires, two submissions can reach the endpoint with no idempotency key.",
    why:
      "Confirmed decision 5 requires duplicate submission to be prevented. UI-level debounce does not cover reconnect-triggered retries.",
    steps: [
      "Run NET-002 with a 30s socket timeout and delayed response",
      "Trigger reconnect while the first request is still in flight",
      "Count POST /v2/orders calls",
    ],
    expected: "Exactly one submission per user intent.",
    actual: "Two submissions observed in 2 of 5 runs.",
    recommendation:
      "Add a request-scoped idempotency key and an in-flight guard in the data layer, then re-run NET-002 five times.",
    relatedScenarios: ["net-002", "con-001"],
  },
];

export const executions = [
  {
    id: "run-118",
    label: "Emulator suite · offline checkout",
    kind: "Emulator",
    target: "Pixel 6 API 34 · emulator-5554",
    started: "Today, 14:38",
    duration: "6m 12s",
    result: "1 failed",
    counts: "7 passed · 1 failed · 1 inconclusive",
  },
  {
    id: "run-117",
    label: "JVM unit tests · :app:testDebugUnitTest",
    kind: "Gradle",
    target: "Gradle 8.7 · JDK 17",
    started: "Today, 14:31",
    duration: "1m 04s",
    result: "1 failed",
    counts: "2 passed · 1 failed",
  },
  {
    id: "run-116",
    label: "Release assemble check · :app:assembleRelease",
    kind: "Gradle",
    target: "Gradle 8.7 · JDK 17",
    started: "Today, 14:22",
    duration: "1m 48s",
    result: "failed",
    counts: "compileReleaseKotlin failed",
  },
  {
    id: "run-115",
    label: "Repository & impact analysis",
    kind: "Git",
    target: "Local agent",
    started: "Today, 14:18",
    duration: "8s",
    result: "passed",
    counts: "9 files · 6 impacted areas",
  },
];

export const gateRules = [
  { rule: "Blocking functional failure", state: "failed", detail: "OFF-003 violates confirmed decision 2" },
  { rule: "Critical build check", state: "failed", detail: ":app:assembleRelease failed" },
  { rule: "Required scenario coverage", state: "incomplete", detail: "5 of 17 scenarios not executed" },
  { rule: "Architecture consistency", state: "warning", detail: "1 abstraction bypass" },
  { rule: "Online checkout regression", state: "passed", detail: "REG-001 passed" },
] as const;

export const currentRun = {
  active: true,
  label: "OFF-009 · offline cart edit then reconnect",
  progress: 62,
  detail: "Emulator run · step 5 of 8",
};

export function scenarioById(id: string) {
  return scenarios.find((s) => s.id === id);
}

export function findingById(id: string) {
  return findings.find((f) => f.id === id);
}
