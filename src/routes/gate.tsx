import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Panel, PanelHeader, Mono, Tag, Stat, buttonStyles, SourceTag } from "@/components/kit";
import { gateRules, project, change, scenarioStats, pipeline } from "@/lib/demo-data";

export const Route = createFileRoute("/gate")({
  head: () => ({
    meta: [
      { title: "Quality gate decision: DO NOT SHIP | AI Quality Gate" },
      {
        name: "description",
        content:
          "Explicit gate rules for the offline checkout change: two blocking findings, a failed release build and incomplete scenario coverage.",
      },
      { property: "og:title", content: "Quality gate decision: DO NOT SHIP" },
      {
        property: "og:description",
        content: "Passing scenarios do not override blocking failures. Every rule is stated and evidenced.",
      },
    ],
  }),
  component: QualityGate,
});

const ruleIcon = {
  passed: <Check className="size-3.5 text-success" strokeWidth={2.5} />,
  failed: <X className="size-3.5 text-destructive" strokeWidth={2.5} />,
  warning: <Minus className="size-3.5 text-warning" strokeWidth={2.5} />,
  incomplete: <Minus className="size-3.5 text-warning" strokeWidth={2.5} />,
} as const;

const ruleTone = {
  passed: "green",
  failed: "red",
  warning: "amber",
  incomplete: "amber",
} as const;

function QualityGate() {
  const [exported, setExported] = useState(false);
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="rounded-[6px] border border-destructive/30 bg-destructive-soft px-5 py-5">
          <div className="label-caps text-destructive">Quality gate decision</div>
          <h1 className="mt-1.5 text-[34px] font-bold leading-none tracking-tight text-destructive sm:text-[42px]">
            DO NOT SHIP
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Tag tone="red">2 blocking rules failed</Tag>
            <Mono className="text-[11.5px] text-muted-foreground">
              {change.title} · {project.branch} · {project.baseCommit} → {project.commit}
            </Mono>
          </div>
          <p className="mt-3 max-w-3xl text-[13px] leading-relaxed">
            The change is not ready to ship because checkout remains actionable offline and the
            release build fails. Passing scenarios do not override blocking failures.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/findings" className={buttonStyles.danger}>
              View blocking findings
            </Link>
            <Link to="/scenarios" className={buttonStyles.outline}>
              Review failed scenarios
            </Link>
            <button type="button" onClick={() => setExported(true)} className={buttonStyles.outline}>
              Export report
            </button>
            <Link
              to="/changes/$changeId"
              params={{ changeId: change.id }}
              className={buttonStyles.outline}
            >
              Back to change
            </Link>
          </div>
          {exported ? (
            <div
              role="status"
              className="mt-3 flex flex-wrap items-center gap-2 rounded-[6px] border border-success/30 bg-success-soft px-3 py-2 text-[12.5px]"
            >
              <Check className="size-3.5 text-success" strokeWidth={2.5} />
              Report prepared for export.
              <Link to="/reports" className="font-medium text-primary hover:underline">
                Open report view
              </Link>
            </div>
          ) : null}
        </div>

        <Panel>
          <PanelHeader title="Supporting summary" meta={`evaluated ${project.analyzedAt}`} />
          <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-3 lg:grid-cols-6 sm:divide-y-0">
            <Stat label="Blocking findings" value={2} tone="red" hint="functional + build" />
            <Stat label="Release build" value={1} tone="red" hint="assembleRelease failed" />
            <Stat label="Arch. warnings" value={2} tone="amber" hint="non-blocking" />
            <Stat label="Passed" value={scenarioStats.passed} tone="green" />
            <Stat label="Failed" value={scenarioStats.failed} tone="red" />
            <Stat label="Inconclusive" value={scenarioStats.inconclusive} tone="amber" />
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Decision rules" meta="explicit, evaluated in order" />
          <ul className="divide-y divide-border">
            {gateRules.map((r) => (
              <li key={r.rule} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="grid size-6 place-items-center rounded-[5px] border border-border bg-surface-2">
                  {ruleIcon[r.state]}
                </span>
                <span className="text-[13px] font-medium">{r.rule}</span>
                <Tag tone={ruleTone[r.state]}>{r.state}</Tag>
                <span className="ml-auto text-[11.5px] text-muted-foreground">{r.detail}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border px-4 py-3 text-[12px] leading-relaxed text-muted-foreground">
            A single failed blocking rule produces DO NOT SHIP. Warnings and incomplete coverage are
            reported but never downgrade or upgrade the decision on their own.
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="How this decision was produced" meta="tools execute · AI reasons · rules decide" />
          <div className="flex gap-2 overflow-x-auto px-4 py-3">
            {pipeline.map((s, i) => (
              <div
                key={s.stage}
                className="min-w-[164px] flex-1 rounded-[6px] border border-border bg-surface-2 px-2.5 py-2"
              >
                <div className="flex items-center justify-between">
                  <Mono className="text-[10.5px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </Mono>
                  <Tag tone={s.kind === "ai" ? "neutral" : s.kind === "rules" ? "amber" : "teal"}>
                    {s.kind === "ai" ? "AI" : s.kind === "rules" ? "Rules" : "Tool"}
                  </Tag>
                </div>
                <div className="mt-1.5 text-[12.5px] font-medium leading-snug">{s.stage}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{s.detail}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-2.5">
            <SourceTag source="rules" />
            <span className="text-[11.5px] text-muted-foreground">
              The gate reads recorded evidence only. It does not re-run tests and does not modify
              production code.
            </span>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
