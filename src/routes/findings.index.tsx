import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  Panel,
  PanelHeader,
  PageHeader,
  Tag,
  Mono,
  SeverityTag,
  SourceTag,
  buttonStyles,
} from "@/components/kit";
import { findings, type Finding } from "@/lib/demo-data";

export const Route = createFileRoute("/findings/")({
  head: () => ({
    meta: [
      { title: "Findings — offline checkout | AI Quality Gate" },
      {
        name: "description",
        content:
          "Blocking findings and warnings for the offline checkout change, each with evidence, affected files, reproduction steps, recommendation and confidence.",
      },
      { property: "og:title", content: "Findings — offline checkout" },
      {
        property: "og:description",
        content: "Two blocking findings and two warnings, all traceable to deterministic evidence.",
      },
    ],
  }),
  component: Findings,
});

function FindingRow({ finding }: { finding: Finding }) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <SeverityTag severity={finding.severity} />
        {finding.blocking ? <Tag tone="red">Blocking</Tag> : <Tag tone="amber">Warning</Tag>}
        <span className="text-[11.5px] text-muted-foreground">{finding.category}</span>
        <span className="ml-auto">
          <SourceTag source={finding.source} />
        </span>
      </div>

      <Link
        to="/findings/$findingId"
        params={{ findingId: finding.id }}
        className="mt-2 block text-[14px] font-semibold tracking-tight hover:text-primary hover:underline"
      >
        {finding.title}
      </Link>

      <p className="mt-1.5 max-w-3xl text-[12.5px] leading-relaxed text-muted-foreground">
        {finding.explanation}
      </p>

      <div className="mt-3 grid gap-3 text-[12px] sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="label-caps">Evidence</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {finding.evidence.map((e) => (
              <Tag key={e} tone="teal" mono>
                {e}
              </Tag>
            ))}
          </div>
        </div>
        <div>
          <div className="label-caps">Affected file</div>
          <Mono className="mt-1 block text-[11.5px]">{finding.file}</Mono>
        </div>
        <div>
          <div className="label-caps">Reproducibility</div>
          <Mono className="mt-1 block text-[11.5px]">{finding.reproducibility}</Mono>
        </div>
        <div>
          <div className="label-caps">Confidence</div>
          <div className="mt-1 text-[12px]">{finding.confidence}</div>
        </div>
      </div>

      <div className="mt-3 rounded-[6px] border border-border bg-surface-2 px-2.5 py-2">
        <div className="label-caps">Recommendation</div>
        <p className="mt-1 text-[12.5px] leading-relaxed">{finding.recommendation}</p>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-2">
        <Link
          to="/findings/$findingId"
          params={{ findingId: finding.id }}
          className={buttonStyles.outline}
        >
          Open finding
        </Link>
        {finding.relatedScenarios[0] ? (
          <Link
            to="/scenarios/$scenarioId"
            params={{ scenarioId: finding.relatedScenarios[0] }}
            className={buttonStyles.outline}
          >
            View evidence run
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function Findings() {
  const blocking = findings.filter((f) => f.blocking);
  const warnings = findings.filter((f) => !f.blocking);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Findings · Add offline support to checkout"
          title="Findings"
          description="Each finding names the evidence it came from and whether that evidence is a deterministic execution result or an AI interpretation of collected artifacts. Nothing here is a score."
          right={
            <Link to="/gate" className={buttonStyles.danger}>
              Quality gate
            </Link>
          }
        />

        <Panel>
          <PanelHeader
            title="Blocking"
            meta={`${blocking.length} findings · gate cannot pass`}
            action={<Tag tone="red">Release blocked</Tag>}
          />
          <div className="divide-y divide-border">
            {blocking.map((f) => (
              <FindingRow key={f.id} finding={f} />
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Warnings" meta={`${warnings.length} findings · do not block release`} />
          <div className="divide-y divide-border">
            {warnings.map((f) => (
              <FindingRow key={f.id} finding={f} />
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
