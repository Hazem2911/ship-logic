import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  Panel,
  PanelHeader,
  PageHeader,
  Tag,
  Mono,
  Stat,
  SeverityTag,
  StatusTag,
} from "@/components/kit";
import { scenarios, scenarioColumns, scenarioStats } from "@/lib/demo-data";

export const Route = createFileRoute("/scenarios/")({
  head: () => ({
    meta: [
      { title: "Scenario board — offline checkout | AI Quality Gate" },
      {
        name: "description",
        content:
          "17 discovered scenarios for the offline checkout change, tracked from discovery through execution to pass, fail or inconclusive.",
      },
      { property: "og:title", content: "Scenario board — offline checkout" },
      {
        property: "og:description",
        content: "Hidden scenarios discovered from the diff, confirmed decisions and impacted areas.",
      },
    ],
  }),
  component: ScenarioBoard,
});

function ScenarioBoard() {
  const [filter, setFilter] = useState<string>("all");
  const visible = filter === "all" ? scenarios : scenarios.filter((s) => s.status === filter);
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Scenarios · Add offline support to checkout"
          title="Scenario board"
          description="Scenarios are derived from the diff, the impacted symbol graph and the confirmed developer decisions. Automated scenarios run against a local emulator or the JVM test task; the rest stay visible instead of being silently dropped."
        />

        <Panel>
          <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-5 sm:divide-y-0">
            <Stat label="Discovered" value={scenarioStats.discovered} />
            <Stat label="Executed" value={scenarioStats.executed} tone="teal" />
            <Stat label="Passed" value={scenarioStats.passed} tone="green" />
            <Stat label="Failed" value={scenarioStats.failed} tone="red" />
            <Stat label="Inconclusive" value={scenarioStats.inconclusive} tone="amber" />
          </div>
        </Panel>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="label-caps mr-1">Filter</span>
          {[{ key: "all", label: "All" }, ...scenarioColumns].map((f) => {
            const selected = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(f.key)}
                className={
                  "rounded-[6px] border px-2.5 py-1 text-[12px] font-medium transition-colors " +
                  (selected
                    ? "border-primary/40 bg-primary-soft text-accent-foreground"
                    : "border-border bg-surface text-muted-foreground hover:bg-surface-2 hover:text-foreground")
                }
              >
                {f.label}
              </button>
            );
          })}
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
            {visible.length} shown
          </span>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="grid min-w-[1080px] grid-cols-6 gap-3">
            {scenarioColumns.map((col) => {
              const items = visible.filter((s) => s.status === col.key);
              return (
                <section key={col.key} className="min-w-0">
                  <div className="mb-2 flex items-center justify-between px-0.5">
                    <span className="label-caps">{col.label}</span>
                    <Mono className="text-[11px] text-muted-foreground">{items.length}</Mono>
                  </div>
                  <div className="space-y-2">
                    {items.length === 0 ? (
                      <div className="rounded-[6px] border border-dashed border-border px-2.5 py-3 text-[11.5px] text-muted-foreground">
                        None
                      </div>
                    ) : null}
                    {items.map((s) => (
                      <Link
                        key={s.id}
                        to="/scenarios/$scenarioId"
                        params={{ scenarioId: s.id }}
                        className="block rounded-[6px] border border-border bg-surface px-2.5 py-2 shadow-[var(--shadow-panel)] transition-colors hover:border-border-strong hover:bg-surface-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Mono className="text-[10.5px] text-muted-foreground">{s.code}</Mono>
                          <SeverityTag severity={s.risk} />
                        </div>
                        <div className="mt-1.5 text-[12.5px] font-medium leading-snug">{s.title}</div>
                        <div className="mt-1 text-[11px] text-muted-foreground">{s.category}</div>
                        <div className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                          {s.rationale}
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {s.automation}
                          </span>
                          <StatusTag status={s.status} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <Panel>
          <PanelHeader
            title="All scenarios"
            meta={filter === "all" ? "list view of the same data" : `filtered: ${filter}`}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-4 py-2 font-medium">ID</th>
                  <th className="px-4 py-2 font-medium">Scenario</th>
                  <th className="px-4 py-2 font-medium">Risk</th>
                  <th className="px-4 py-2 font-medium">Category</th>
                  <th className="px-4 py-2 font-medium">Automation</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-muted-foreground" colSpan={6}>
                      No scenarios in this state.
                    </td>
                  </tr>
                ) : null}
                {visible.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-surface-2">
                    <td className="px-4 py-2.5">
                      <Mono className="text-[11.5px] text-muted-foreground">{s.code}</Mono>
                    </td>
                    <td className="px-4 py-2.5">
                      <Link
                        to="/scenarios/$scenarioId"
                        params={{ scenarioId: s.id }}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {s.title}
                      </Link>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{s.rationale}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <SeverityTag severity={s.risk} />
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{s.category}</td>
                    <td className="px-4 py-2.5">
                      <Tag tone="neutral">{s.automation}</Tag>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusTag status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
