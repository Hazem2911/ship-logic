import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FileCode2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Panel,
  PanelHeader,
  PageHeader,
  Field,
  Tag,
  Mono,
  SourceTag,
  buttonStyles,
  SeverityTag,
  StatusTag,
} from "@/components/kit";
import { findingById, scenarioById } from "@/lib/demo-data";

export const Route = createFileRoute("/findings/$findingId")({
  head: () => ({
    meta: [
      { title: "Checkout remains actionable while offline — Finding" },
      {
        name: "description",
        content:
          "Critical finding detail: explanation, why it matters, reproduction steps, expected versus actual behaviour, evidence, affected code and recommended action.",
      },
      { property: "og:title", content: "Checkout remains actionable while offline" },
      {
        property: "og:description",
        content: "Critical blocking finding backed by a reproducible emulator run (5/5).",
      },
    ],
  }),
  loader: ({ params }) => {
    const finding = findingById(params.findingId);
    if (!finding) throw notFound();
    return { findingId: finding.id };
  },
  component: FindingDetail,
});

function FindingDetail() {
  const { findingId } = Route.useLoaderData();
  const finding = findingById(findingId)!;
  const related = finding.relatedScenarios
    .map((id) => scenarioById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow={`Finding ${finding.id.toUpperCase()} · ${finding.category}`}
          title={finding.title}
          right={
            <>
              <Link to="/findings" className={buttonStyles.outline}>
                All findings
              </Link>
              <Link to="/gate" className={buttonStyles.danger}>
                Quality gate
              </Link>
            </>
          }
        />

        <div
          className={
            "flex flex-wrap items-center gap-4 rounded-[6px] border px-4 py-3.5 " +
            (finding.severity === "critical"
              ? "border-destructive/30 bg-destructive-soft"
              : "border-warning/30 bg-warning-soft")
          }
        >
          <div
            className={
              "text-[26px] font-bold uppercase leading-none tracking-tight " +
              (finding.severity === "critical" ? "text-destructive" : "text-warning")
            }
          >
            {finding.severity}
          </div>
          <div className="h-8 w-px bg-border-strong" />
          <div className="text-[12.5px] leading-snug">
            <div className="font-medium">
              {finding.blocking ? "Blocks release" : "Does not block release"}
            </div>
            <div className="text-muted-foreground">
              {finding.category} · reproducibility {finding.reproducibility} · confidence{" "}
              {finding.confidence}
            </div>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <SourceTag source={finding.source} />
            {finding.source === "deterministic" ? (
              <Tag tone="teal">Deterministic execution result</Tag>
            ) : (
              <Tag tone="neutral">AI interpretation</Tag>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-6">
            <Panel>
              <PanelHeader title="Explanation" />
              <div className="space-y-3 px-4 py-3 text-[13px] leading-relaxed">
                <p>{finding.explanation}</p>
                <div>
                  <div className="label-caps">Why this matters</div>
                  <p className="mt-1">{finding.why}</p>
                </div>
              </div>
            </Panel>

            <Panel>
              <PanelHeader title="Reproduction steps" meta={`reproduced ${finding.reproducibility}`} />
              <ol className="divide-y divide-border">
                {finding.steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-3 px-4 py-2">
                    <Mono className="text-[11px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </Mono>
                    <span className="text-[12.5px]">{s}</span>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel>
              <PanelHeader title="Expected vs actual" />
              <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="px-4 py-3">
                  <div className="label-caps">Expected</div>
                  <p className="mt-1 text-[12.5px] leading-relaxed">{finding.expected}</p>
                </div>
                <div className="bg-destructive-soft/60 px-4 py-3">
                  <div className="label-caps text-destructive">Actual</div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-destructive">
                    {finding.actual}
                  </p>
                </div>
              </div>
            </Panel>

            <Panel>
              <PanelHeader title="Recommended action" meta="agent does not modify production code" />
              <p className="px-4 py-3 text-[13px] leading-relaxed">{finding.recommendation}</p>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel>
              <PanelHeader title="Affected code location" />
              <div className="px-4 py-3">
                <div className="flex items-start gap-2 rounded-[6px] border border-border bg-surface-2 px-2.5 py-2">
                  <FileCode2
                    className="mt-0.5 size-[15px] shrink-0 text-muted-foreground"
                    strokeWidth={1.75}
                  />
                  <div className="min-w-0">
                    <Mono className="block break-words text-[11.5px]">{finding.location}</Mono>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Resolved locally from the symbol graph; file contents stay on this machine.
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel>
              <PanelHeader title="Evidence preview" />
              <div className="space-y-2 px-4 py-3">
                {finding.evidence.map((e) => (
                  <div
                    key={e}
                    className="flex items-center justify-between gap-2 rounded-[6px] border border-border px-2.5 py-2"
                  >
                    <Mono className="text-[11.5px]">{e}</Mono>
                    <SourceTag source="deterministic" />
                  </div>
                ))}
                <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                  Artifacts were collected before interpretation. The conclusion above is
                  {finding.source === "deterministic"
                    ? " a direct read of these results."
                    : " an AI reading of these results and may be wrong."}
                </p>
              </div>
            </Panel>

            <Panel>
              <PanelHeader title="Related scenarios" />
              <div className="divide-y divide-border">
                {related.map((s) => (
                  <Link
                    key={s.id}
                    to="/scenarios/$scenarioId"
                    params={{ scenarioId: s.id }}
                    className="block px-4 py-2.5 hover:bg-surface-2"
                  >
                    <div className="flex items-center gap-2">
                      <Mono className="text-[11px] text-muted-foreground">{s.code}</Mono>
                      <StatusTag status={s.status} />
                      <SeverityTag severity={s.risk} />
                    </div>
                    <div className="mt-1 text-[12.5px] font-medium">{s.title}</div>
                  </Link>
                ))}
              </div>
            </Panel>

            <Panel>
              <PanelHeader title="Classification" />
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="p-4">
                  <Field label="Confidence" value={finding.confidence} />
                </div>
                <div className="p-4">
                  <Field
                    label="Source"
                    value={
                      finding.source === "deterministic"
                        ? "Deterministic execution result"
                        : "AI interpretation"
                    }
                  />
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
