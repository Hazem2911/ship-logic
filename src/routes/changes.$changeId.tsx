import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Panel,
  PanelHeader,
  PageHeader,
  Field,
  Tag,
  Mono,
  buttonStyles,
  SeverityTag,
} from "@/components/kit";
import {
  change,
  project,
  workflow,
  impactedAreas,
  decisions,
  findings,
  scenarioStats,
} from "@/lib/demo-data";

export const Route = createFileRoute("/changes/$changeId")({
  head: () => ({
    meta: [
      { title: "Add offline support to checkout — Change review" },
      {
        name: "description",
        content:
          "Impact analysis, confirmed developer decisions, hidden scenarios and evidence for the offline checkout change on Commerce Android.",
      },
      { property: "og:title", content: "Add offline support to checkout — Change review" },
      {
        property: "og:description",
        content: "Six-stage quality workflow ending in a blocking DO NOT SHIP decision.",
      },
    ],
  }),
  component: ChangeDetail,
});

function WorkflowStrip() {
  return (
    <Panel>
      <PanelHeader title="Workflow" meta="all stages complete · gate blocking" />
      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {workflow.map((s, i) => {
          const blocked = s.state === "blocked";
          return (
            <div
              key={s.name}
              className={
                "min-w-[172px] flex-1 rounded-[6px] border px-2.5 py-2 " +
                (blocked
                  ? "border-destructive/30 bg-destructive-soft"
                  : "border-success/25 bg-success-soft")
              }
            >
              <div className="flex items-center justify-between">
                <Mono className="text-[10.5px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </Mono>
                {blocked ? (
                  <X className="size-3.5 text-destructive" strokeWidth={2.5} />
                ) : (
                  <Check className="size-3.5 text-success" strokeWidth={2.5} />
                )}
              </div>
              <div
                className={
                  "mt-1.5 text-[12.5px] font-medium leading-snug " +
                  (blocked ? "text-destructive" : "text-foreground")
                }
              >
                {s.name}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{s.detail}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function ChangeDetail() {
  const blocking = findings.filter((f) => f.blocking);
  const warnings = findings.filter((f) => !f.blocking);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Change detail"
          title={change.title}
          description={change.summary}
          right={
            <>
              <Link to="/scenarios" className={buttonStyles.outline}>
                Review scenarios
              </Link>
              <Link to="/gate" className={buttonStyles.danger}>
                DO NOT SHIP
              </Link>
            </>
          }
        />

        <Panel>
          <div className="grid grid-cols-2 divide-border sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Type" value={change.type} />
            </div>
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Branch" value={project.branch} mono />
            </div>
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Base commit" value={project.baseCommit} mono />
            </div>
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Head commit" value={project.commit} mono />
            </div>
            <div className="p-4">
              <Field label="Status" value={change.status} />
            </div>
            <div className="p-4">
              <Field label="Result" value={<Tag tone="red">Do not ship</Tag>} />
            </div>
          </div>
        </Panel>

        <WorkflowStrip />

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-6">
            <Panel>
              <PanelHeader
                title="Change summary"
                meta={`${change.stats.files} files · +${change.stats.added} / −${change.stats.removed}`}
              />
              <div className="space-y-3 px-4 py-3 text-[13px] leading-relaxed">
                <p>{change.summary}</p>
                <p className="text-muted-foreground">{change.summaryDetail}</p>
              </div>
            </Panel>

            <Panel>
              <PanelHeader title="Impacted areas" meta="6 items · reason recorded per item" />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-[12.5px]">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="px-4 py-2 font-medium">Symbol / file</th>
                      <th className="px-4 py-2 font-medium">Why included</th>
                      <th className="px-4 py-2 font-medium">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {impactedAreas.map((a) => (
                      <tr key={a.name} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5">
                          <Mono className="font-medium">{a.name}</Mono>
                          <div className="mt-0.5 truncate font-mono text-[10.5px] text-muted-foreground">
                            {a.path}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <Tag tone={a.reason === "Directly changed" ? "teal" : "neutral"}>
                            {a.reason}
                          </Tag>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{a.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel>
              <PanelHeader title="Developer decisions" meta="confirmed, not assumed" />
              <ul className="divide-y divide-border">
                {decisions.map((d, i) => (
                  <li key={d.text} className="flex gap-3 px-4 py-2.5">
                    <Mono className="pt-0.5 text-[11px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </Mono>
                    <div className="min-w-0">
                      <div className="text-[13px] leading-snug">{d.text}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {d.by} · <Mono className="text-[10.5px]">{d.at}</Mono>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border px-4 py-2.5 text-[11.5px] leading-relaxed text-muted-foreground">
                These statements were confirmed by the developer during requirement clarification and
                are used as pass/fail criteria. They are not AI assumptions.
              </div>
            </Panel>

            <Panel>
              <PanelHeader
                title="Outcome"
                action={
                  <Link to="/findings" className="text-[12px] font-medium text-primary hover:underline">
                    All findings
                  </Link>
                }
              />
              <div className="space-y-3 px-4 py-3">
                <div className="text-[12px] text-muted-foreground">
                  {scenarioStats.passed} passed · {scenarioStats.failed} failed ·{" "}
                  {scenarioStats.inconclusive} inconclusive
                </div>
                {[...blocking, ...warnings].map((f) => (
                  <Link
                    key={f.id}
                    to="/findings/$findingId"
                    params={{ findingId: f.id }}
                    className="block rounded-[6px] border border-border px-2.5 py-2 hover:bg-surface-2"
                  >
                    <div className="flex items-center gap-2">
                      <SeverityTag severity={f.severity} />
                      {f.blocking ? <Tag tone="red">Blocking</Tag> : <Tag tone="amber">Warning</Tag>}
                    </div>
                    <div className="mt-1.5 text-[12.5px] font-medium leading-snug">{f.title}</div>
                  </Link>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
