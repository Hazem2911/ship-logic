import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Panel,
  PanelHeader,
  PageHeader,
  Field,
  Tag,
  Mono,
  SeverityTag,
  StatusTag,
  SourceTag,
  buttonStyles,
} from "@/components/kit";
import { cn } from "@/lib/utils";
import { scenarioById, timeline, logcat, hierarchy, findingById } from "@/lib/demo-data";

export const Route = createFileRoute("/scenarios/$scenarioId")({
  head: () => ({
    meta: [
      { title: "Scenario execution — attempt checkout while offline" },
      {
        name: "description",
        content:
          "Execution evidence for a failed offline checkout scenario: actions, expected versus actual outcome, screenshot, UI hierarchy, logcat and action timeline.",
      },
      { property: "og:title", content: "Scenario execution — attempt checkout while offline" },
      {
        property: "og:description",
        content: "Deterministic emulator evidence separated from AI interpretation.",
      },
    ],
  }),
  loader: ({ params }) => {
    const scenario = scenarioById(params.scenarioId);
    if (!scenario) throw notFound();
    return { scenarioId: scenario.id };
  },
  component: ScenarioDetail,
});

const tabs = ["Screenshot", "UI hierarchy", "Logcat", "Action timeline"] as const;

function ScenarioDetail() {
  const { scenarioId } = Route.useLoaderData();
  const scenario = scenarioById(scenarioId)!;
  const [tab, setTab] = useState<(typeof tabs)[number]>("Screenshot");
  const finding = scenario.findingId ? findingById(scenario.findingId) : undefined;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow={`Scenario ${scenario.code} · Add offline support to checkout`}
          title={scenario.title}
          description={scenario.rationale}
          right={
            <>
              <Link to="/scenarios" className={buttonStyles.outline}>
                Back to board
              </Link>
              {finding ? (
                <Link
                  to="/findings/$findingId"
                  params={{ findingId: finding.id }}
                  className={buttonStyles.danger}
                >
                  Related finding
                </Link>
              ) : null}
            </>
          }
        />

        <Panel>
          <div className="grid grid-cols-2 divide-border sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Status" value={<StatusTag status={scenario.status} />} />
            </div>
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Risk" value={<SeverityTag severity={scenario.risk} />} />
            </div>
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Category" value={scenario.category} />
            </div>
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Automation" value={scenario.automation} />
            </div>
            <div className="p-4">
              <Field label="Device" value={scenario.device ?? "Not executed"} mono />
            </div>
            <div className="p-4">
              <Field label="Elapsed" value={scenario.elapsed ?? "—"} mono />
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <Panel>
              <PanelHeader title="Preconditions" />
              <ul className="space-y-1.5 px-4 py-3 text-[12.5px]">
                {(scenario.preconditions ?? ["No recorded preconditions for this scenario."]).map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-[7px] size-1 shrink-0 rounded-full bg-neutral" />
                    {p}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel>
              <PanelHeader title="Test actions" meta="ordered, replayed by the local agent" />
              <ol className="divide-y divide-border">
                {(scenario.actions ?? ["Not yet executed"]).map((a, i) => (
                  <li key={a} className="flex items-center gap-3 px-4 py-2">
                    <Mono className="text-[11px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </Mono>
                    <span className="text-[12.5px]">{a}</span>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel>
              <PanelHeader title="Outcome" />
              <div className="divide-y divide-border">
                <div className="px-4 py-3">
                  <div className="label-caps">Expected</div>
                  <p className="mt-1 text-[12.5px] leading-relaxed">
                    {scenario.expected ?? "—"}
                  </p>
                </div>
                <div className="bg-destructive-soft/60 px-4 py-3">
                  <div className="label-caps text-destructive">Actual</div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-destructive">
                    {scenario.actual ?? "—"}
                  </p>
                </div>
              </div>
            </Panel>
          </div>

          <Panel className="min-w-0">
            <div className="flex flex-wrap gap-1 border-b border-border px-2 py-2">
              {tabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded-[5px] px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                    tab === t
                      ? "bg-primary-soft text-accent-foreground"
                      : "text-muted-foreground hover:bg-surface-2",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "Screenshot" ? (
              <div className="p-4">
                <div className="mx-auto flex aspect-[9/16] w-full max-w-[300px] flex-col items-center justify-center gap-2 rounded-[6px] border border-dashed border-border-strong bg-surface-2">
                  <Smartphone className="size-6 text-muted-foreground" strokeWidth={1.5} />
                  <div className="label-caps">Android emulator screenshot</div>
                  <Mono className="text-[10.5px] text-muted-foreground">
                    off-003_step5_checkout.png
                  </Mono>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <SourceTag source="deterministic" />
                  <Mono className="text-[10.5px] text-muted-foreground">
                    captured 00:22.7 · stored locally
                  </Mono>
                </div>
              </div>
            ) : null}

            {tab === "UI hierarchy" ? (
              <div className="p-4">
                <pre className="overflow-x-auto rounded-[6px] border border-border bg-surface-2 p-3 font-mono text-[11.5px] leading-relaxed">
                  {hierarchy}
                </pre>
                <div className="mt-3">
                  <SourceTag source="deterministic" />
                </div>
              </div>
            ) : null}

            {tab === "Logcat" ? (
              <div className="p-4">
                <pre className="max-h-[420px] overflow-auto rounded-[6px] border border-border bg-surface-2 p-3 font-mono text-[11.5px] leading-relaxed">
                  {logcat}
                </pre>
                <div className="mt-3">
                  <SourceTag source="deterministic" />
                </div>
              </div>
            ) : null}

            {tab === "Action timeline" ? (
              <div className="p-4">
                <p className="mb-3 text-[12px] leading-relaxed text-muted-foreground">
                  Tool results are recorded before any interpretation. AI rows read the collected
                  evidence and may be wrong; they never change device state.
                </p>
                <ol className="space-y-1.5">
                  {timeline.map((t) => (
                    <li
                      key={t.at + t.label}
                      className={cn(
                        "rounded-[6px] border px-2.5 py-2",
                        t.source === "deterministic"
                          ? "border-border bg-surface"
                          : "border-border-strong bg-surface-2",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Mono className="text-[11px] text-muted-foreground">{t.at}</Mono>
                        <SourceTag source={t.source} />
                      </div>
                      <div className="mt-1 font-mono text-[11.5px] leading-snug">{t.label}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{t.result}</div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </Panel>
        </div>

        {finding ? (
          <Panel>
            <PanelHeader title="Related finding" meta="raised from this execution" />
            <Link
              to="/findings/$findingId"
              params={{ findingId: finding.id }}
              className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-surface-2"
            >
              <SeverityTag severity={finding.severity} />
              <Tag tone="red">Blocking</Tag>
              <span className="text-[13px] font-medium">{finding.title}</span>
              <Mono className="text-[11px] text-muted-foreground">{finding.file}</Mono>
            </Link>
          </Panel>
        ) : null}
      </div>
    </AppShell>
  );
}
