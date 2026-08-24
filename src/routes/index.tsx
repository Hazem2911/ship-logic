import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Panel, PanelHeader, PageHeader, Field, Tag, Stat, Mono, buttonStyles, SeverityTag } from "@/components/kit";
import { project, change, findings, executions, pipeline, scenarioStats } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Commerce Android — AI Quality Gate Overview" },
      {
        name: "description",
        content:
          "Release-readiness overview for Commerce Android: latest quality decision, risk summary, blocking findings and execution evidence.",
      },
      { property: "og:title", content: "Commerce Android — AI Quality Gate Overview" },
      {
        property: "og:description",
        content:
          "Independent QA layer: hidden scenarios, deterministic checks and an explainable ship decision.",
      },
    ],
  }),
  component: Overview,
});

function PipelineStrip() {
  return (
    <Panel>
      <PanelHeader
        title="Quality pipeline"
        meta="deterministic tools execute · AI reasons · gate rules decide"
      />
      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {pipeline.map((s, i) => (
          <div
            key={s.stage}
            className="min-w-[168px] flex-1 rounded-[6px] border border-border bg-surface-2 px-2.5 py-2"
          >
            <div className="flex items-center justify-between gap-2">
              <Mono className="text-[10.5px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </Mono>
              <Tag
                tone={s.kind === "ai" ? "neutral" : s.kind === "rules" ? "amber" : "teal"}
              >
                {s.kind === "ai" ? "AI" : s.kind === "rules" ? "Rules" : "Tool"}
              </Tag>
            </div>
            <div className="mt-1.5 text-[12.5px] font-medium leading-snug">{s.stage}</div>
            <div className="mt-1 text-[11px] leading-snug text-muted-foreground">{s.detail}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Overview() {
  const blocking = findings.filter((f) => f.blocking);
  const latest = executions[0]!;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Project overview"
          title={project.name}
          description="Independent senior QA layer over the current working tree. Every judgment below is anchored to a deterministic execution result or a labelled AI interpretation."
          right={
            <>
              <Link to="/gate" className={buttonStyles.danger}>
                DO NOT SHIP
              </Link>
              <Link to="/changes/$changeId" params={{ changeId: change.id }} className={buttonStyles.outline}>
                Open change
              </Link>
            </>
          }
        />

        <Panel>
          <div className="grid grid-cols-2 divide-border sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Platform" value={project.platform} />
            </div>
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Build system" value={project.buildSystem} />
            </div>
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Repository" value={project.repository} mono />
            </div>
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Branch" value={project.branch} mono />
            </div>
            <div className="p-4">
              <Field label="Commit" value={project.commit} mono />
            </div>
            <div className="p-4">
              <Field
                label="Repository status"
                value={<span className="text-primary">{project.repoStatus}</span>}
              />
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Panel>
            <PanelHeader title="Risk summary" meta="head a84f21c vs base 7cc901a" />
            <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
              <Stat label="Decision" value="DO NOT SHIP" tone="red" hint="2 blocking rules failed" />
              <Stat label="Blocking" value={blocking.length} tone="red" hint="functional + build" />
              <Stat label="Warnings" value="2" tone="amber" hint="architecture, concurrency" />
              <Stat
                label="Scenarios"
                value={`${scenarioStats.passed}/${scenarioStats.executed}`}
                tone="neutral"
                hint={`${scenarioStats.discovered} discovered · ${scenarioStats.failed} failed`}
              />
            </div>
            <div className="border-t border-border px-4 py-3 text-[12.5px] leading-relaxed text-muted-foreground">
              Passing scenarios do not override blocking failures. Checkout remains actionable while
              offline and the release variant does not assemble.
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              title="Latest execution"
              meta={latest.started}
              action={
                <Link to="/executions" className="text-[12px] font-medium text-primary hover:underline">
                  All executions
                </Link>
              }
            />
            <div className="space-y-2.5 px-4 py-3">
              <div className="text-[13px] font-medium">{latest.label}</div>
              <div className="font-mono text-[11.5px] text-muted-foreground">{latest.target}</div>
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="red">{latest.result}</Tag>
                <Tag tone="neutral" mono>
                  {latest.duration}
                </Tag>
              </div>
              <div className="font-mono text-[11.5px] text-foreground">{latest.counts}</div>
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                Artifacts (screenshots, UI hierarchy, logcat) were collected locally before any
                interpretation was applied.
              </p>
            </div>
          </Panel>
        </div>

        <PipelineStrip />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Panel>
            <PanelHeader title="Recent changes" meta="1 change under review" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Change</th>
                    <th className="px-4 py-2 font-medium">Type</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Result</th>
                    <th className="px-4 py-2 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border last:border-0 hover:bg-surface-2">
                    <td className="px-4 py-2.5">
                      <Link
                        to="/changes/$changeId"
                        params={{ changeId: change.id }}
                        className="font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {change.title}
                      </Link>
                      <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {project.branch} · {change.stats.files} files
                      </div>
                    </td>
                    <td className="px-4 py-2.5">{change.type}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Quality review complete</td>
                    <td className="px-4 py-2.5">
                      <Tag tone="red">Do not ship</Tag>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">Today</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              title="Open blocking findings"
              action={
                <Link to="/findings" className="text-[12px] font-medium text-primary hover:underline">
                  All findings
                </Link>
              }
            />
            <ul className="divide-y divide-border">
              {blocking.map((f) => (
                <li key={f.id} className="px-4 py-3">
                  <Link
                    to="/findings/$findingId"
                    params={{ findingId: f.id }}
                    className="text-[13px] font-medium hover:text-primary hover:underline"
                  >
                    {f.title}
                  </Link>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <SeverityTag severity={f.severity} />
                    <span className="text-[11.5px] text-muted-foreground">{f.category}</span>
                    <Mono className="text-[11px] text-muted-foreground">{f.file}</Mono>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
