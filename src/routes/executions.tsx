import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Panel, PanelHeader, PageHeader, Tag, Mono, SourceTag, buttonStyles } from "@/components/kit";
import { executions, currentRun, project } from "@/lib/demo-data";

export const Route = createFileRoute("/executions")({
  head: () => ({
    meta: [
      { title: "Executions — local agent runs | AI Quality Gate" },
      {
        name: "description",
        content:
          "Deterministic run history for Commerce Android: Gradle builds, JVM unit tests, emulator suites and repository analysis with durations and results.",
      },
      { property: "og:title", content: "Executions — local agent runs" },
      {
        property: "og:description",
        content: "Every judgment is anchored to one of these deterministic runs.",
      },
    ],
  }),
  component: Executions,
});

function Executions() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Executions"
          title="Local agent runs"
          description="Git, Gradle, unit tests and emulator actions are executed by the local agent on this machine. Results are recorded verbatim before any AI interpretation is applied."
          right={
            <Link to="/findings" className={buttonStyles.outline}>
              View findings
            </Link>
          }
        />

        {currentRun.active ? (
          <Panel className="border-primary/25">
            <PanelHeader title="Run in progress" meta={currentRun.detail} action={<Tag tone="teal">Running</Tag>} />
            <div className="px-4 py-3">
              <div className="font-mono text-[12.5px]">{currentRun.label}</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${currentRun.progress}%` }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <Mono className="text-[11px] text-muted-foreground">
                  {project.commit} · emulator-5554
                </Mono>
                <Mono className="text-[11px] text-muted-foreground">{currentRun.progress}%</Mono>
              </div>
            </div>
          </Panel>
        ) : null}

        <Panel>
          <PanelHeader title="Run history" meta="most recent first" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Run</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Target</th>
                  <th className="px-4 py-2 font-medium">Started</th>
                  <th className="px-4 py-2 font-medium">Duration</th>
                  <th className="px-4 py-2 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {executions.map((e) => (
                  <tr key={e.id} className="border-b border-border last:border-0 hover:bg-surface-2">
                    <td className="px-4 py-3">
                      <div className="font-medium">{e.label}</div>
                      <Mono className="mt-0.5 block text-[11px] text-muted-foreground">
                        {e.id} · {e.counts}
                      </Mono>
                    </td>
                    <td className="px-4 py-3">
                      <Tag tone="neutral">{e.kind}</Tag>
                    </td>
                    <td className="px-4 py-3">
                      <Mono className="text-[11.5px] text-muted-foreground">{e.target}</Mono>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{e.started}</td>
                    <td className="px-4 py-3">
                      <Mono className="text-[11.5px]">{e.duration}</Mono>
                    </td>
                    <td className="px-4 py-3">
                      <Tag tone={e.result === "passed" ? "green" : "red"}>{e.result}</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-2.5">
            <SourceTag source="deterministic" />
            <span className="text-[11.5px] text-muted-foreground">
              Command output, screenshots and logs are stored locally alongside the repository.
            </span>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
