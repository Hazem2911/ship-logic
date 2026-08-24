import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Panel, PanelHeader, PageHeader, Tag, Mono } from "@/components/kit";
import { change, project } from "@/lib/demo-data";

export const Route = createFileRoute("/changes/")({
  head: () => ({
    meta: [
      { title: "Changes under quality review — AI Quality Gate" },
      {
        name: "description",
        content:
          "Software changes analyzed by the local quality agent, with branch, commits and the resulting ship decision.",
      },
      { property: "og:title", content: "Changes under quality review" },
      {
        property: "og:description",
        content: "Every change gets impact analysis, hidden scenarios, evidence and an explainable decision.",
      },
    ],
  }),
  component: Changes,
});

function Changes() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Changes"
          title="Changes under quality review"
          description="Changes are read from the local working tree and analyzed in place. Production code is never modified by the agent."
        />

        <Panel>
          <PanelHeader title="Working tree" meta={`${project.branch} · analyzed ${project.analyzedAt}`} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Change</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Commits</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Result</th>
                  <th className="px-4 py-2 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-surface-2">
                  <td className="px-4 py-3">
                    <Link
                      to="/changes/$changeId"
                      params={{ changeId: change.id }}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {change.title}
                    </Link>
                    <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {project.baseCommit} → {project.commit} · +{change.stats.added} −
                      {change.stats.removed}
                    </div>
                  </td>
                  <td className="px-4 py-3">{change.type}</td>
                  <td className="px-4 py-3">
                    <Mono>{change.stats.commits}</Mono>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Quality review complete</td>
                  <td className="px-4 py-3">
                    <Tag tone="red">Do not ship</Tag>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Today</td>
                </tr>
                <tr className="text-muted-foreground">
                  <td className="px-4 py-3" colSpan={6}>
                    No other changes queued. The agent analyzes one change at a time to keep evidence
                    attributable.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
