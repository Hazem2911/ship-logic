import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Panel, PanelHeader, PageHeader, Tag, Mono, buttonStyles, Field } from "@/components/kit";
import { project, change, findings, scenarioStats, gateRules } from "@/lib/demo-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Quality report — offline checkout | AI Quality Gate" },
      {
        name: "description",
        content:
          "Exportable release-readiness report for the offline checkout change: decision, rules, findings, scenario coverage and evidence index.",
      },
      { property: "og:title", content: "Quality report — offline checkout" },
      {
        property: "og:description",
        content: "An evidence-backed report a reviewer can read without opening the tool.",
      },
    ],
  }),
  component: Reports,
});

function Reports() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Reports"
          title="Quality report"
          description="Reports are generated from recorded evidence and rendered locally. Repository source code is not included by default; only file paths, symbol names and captured artifacts are referenced."
          right={
            <>
              <button type="button" className={buttonStyles.outline}>
                <Download className="size-3.5" strokeWidth={1.75} />
                Export PDF
              </button>
              <button type="button" className={buttonStyles.primary}>
                <FileText className="size-3.5" strokeWidth={1.75} />
                Export Markdown
              </button>
            </>
          }
        />

        <Panel>
          <PanelHeader title="Report header" meta={`generated ${project.analyzedAt}`} />
          <div className="grid grid-cols-2 divide-border sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Project" value={project.name} />
            </div>
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Change" value={change.title} />
            </div>
            <div className="border-b border-border p-4 lg:border-b-0">
              <Field label="Commit range" value={`${project.baseCommit}..${project.commit}`} mono />
            </div>
            <div className="p-4">
              <Field label="Decision" value={<Tag tone="red">Do not ship</Tag>} />
            </div>
            <div className="p-4">
              <Field
                label="Coverage"
                value={`${scenarioStats.executed}/${scenarioStats.discovered} executed`}
                mono
              />
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Panel>
            <PanelHeader title="Decision rules" />
            <ul className="divide-y divide-border text-[12.5px]">
              {gateRules.map((r) => (
                <li key={r.rule} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span>{r.rule}</span>
                  <Tag
                    tone={r.state === "passed" ? "green" : r.state === "failed" ? "red" : "amber"}
                  >
                    {r.state}
                  </Tag>
                </li>
              ))}
            </ul>
            <div className="border-t border-border px-4 py-2.5">
              <Link to="/gate" className="text-[12px] font-medium text-primary hover:underline">
                Open quality gate
              </Link>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Findings index" />
            <ul className="divide-y divide-border">
              {findings.map((f) => (
                <li key={f.id} className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Tag tone={f.blocking ? "red" : "amber"}>{f.blocking ? "Blocking" : "Warning"}</Tag>
                    <Mono className="text-[11px] text-muted-foreground">{f.id.toUpperCase()}</Mono>
                  </div>
                  <Link
                    to="/findings/$findingId"
                    params={{ findingId: f.id }}
                    className="mt-1 block text-[12.5px] font-medium hover:text-primary hover:underline"
                  >
                    {f.title}
                  </Link>
                  <Mono className="mt-0.5 block text-[11px] text-muted-foreground">
                    {f.file} · confidence {f.confidence} ·{" "}
                    {f.source === "deterministic" ? "deterministic" : "AI-derived"}
                  </Mono>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel>
          <PanelHeader title="Evidence index" meta="stored locally, referenced by path" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Artifact</th>
                  <th className="px-4 py-2 font-medium">Source</th>
                  <th className="px-4 py-2 font-medium">Size</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["off-003_step5_checkout.png", "Emulator screenshot", "412 KB"],
                  ["off-003_hierarchy.xml", "UI hierarchy dump", "88 KB"],
                  ["off-003_logcat.txt", "Logcat capture", "1.2 MB"],
                  ["run-116_assembleRelease.log", "Gradle task log", "246 KB"],
                  ["run-117_testDebugUnitTest.xml", "JUnit results", "34 KB"],
                ].map(([name, src, size]) => (
                  <tr key={name} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5">
                      <Mono className="text-[11.5px]">{name}</Mono>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{src}</td>
                    <td className="px-4 py-2.5">
                      <Mono className="text-[11.5px] text-muted-foreground">{size}</Mono>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-4 py-2.5 text-[11.5px] leading-relaxed text-muted-foreground">
            Artifacts remain on the developer machine. Secrets and private repository content are
            never uploaded by the dashboard.
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
