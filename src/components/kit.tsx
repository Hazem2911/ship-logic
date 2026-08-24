import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Severity, Source, ScenarioStatus } from "@/lib/demo-data";

export function Panel({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("panel", className)} {...rest}>
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
      <div className="flex items-baseline gap-3">
        <h2 className="text-[13px] font-semibold tracking-tight">{title}</h2>
        {meta ? <span className="text-xs text-muted-foreground">{meta}</span> : null}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="label-caps">{label}</div>
      <div
        className={cn(
          "mt-1 text-[13px] text-foreground",
          mono && "font-mono text-[12.5px]",
        )}
      >
        {value}
      </div>
    </div>
  );
}

const toneMap = {
  neutral: "bg-neutral-soft text-neutral border-border",
  teal: "bg-primary-soft text-accent-foreground border-primary/20",
  amber: "bg-warning-soft text-warning border-warning/25",
  red: "bg-destructive-soft text-destructive border-destructive/25",
  green: "bg-success-soft text-success border-success/25",
} as const;

export type Tone = keyof typeof toneMap;

export function Tag({
  children,
  tone = "neutral",
  mono,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  mono?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[4px] border px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.06em]",
        toneMap[tone],
        mono && "font-mono tracking-normal normal-case",
        className,
      )}
    >
      {children}
    </span>
  );
}

export const severityTone: Record<Severity, Tone> = {
  critical: "red",
  high: "amber",
  medium: "amber",
  low: "neutral",
};

export function SeverityTag({ severity }: { severity: Severity }) {
  return <Tag tone={severityTone[severity]}>{severity}</Tag>;
}

export const statusTone: Record<ScenarioStatus, Tone> = {
  discovered: "neutral",
  planned: "neutral",
  running: "teal",
  passed: "green",
  failed: "red",
  inconclusive: "amber",
};

export function StatusTag({ status }: { status: ScenarioStatus }) {
  return <Tag tone={statusTone[status]}>{status}</Tag>;
}

export function SourceTag({ source }: { source: Source | "rules" }) {
  const label =
    source === "deterministic"
      ? "Deterministic result"
      : source === "ai"
        ? "AI interpretation"
        : "Gate rule";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[4px] border px-1.5 py-0.5 text-[10.5px] font-medium",
        source === "deterministic"
          ? "border-primary/20 bg-primary-soft text-accent-foreground"
          : source === "ai"
            ? "border-border-strong bg-surface-2 text-neutral"
            : "border-border-strong bg-muted text-neutral",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          source === "deterministic" ? "bg-primary" : "bg-neutral",
        )}
      />
      {label}
    </span>
  );
}

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-mono text-[12.5px]", className)}>{children}</span>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
      <div className="min-w-0">
        {eyebrow ? <div className="label-caps">{eyebrow}</div> : null}
        <h1 className="mt-1 text-[20px] font-semibold tracking-tight">{title}</h1>
        {description ? (
          <div className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </div>
        ) : null}
      </div>
      {right ? <div className="flex shrink-0 flex-wrap items-center gap-2">{right}</div> : null}
    </div>
  );
}

const btn =
  "inline-flex items-center justify-center gap-1.5 rounded-[6px] border px-3 py-1.5 text-[12.5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export const buttonStyles = {
  primary: cn(btn, "border-primary bg-primary text-primary-foreground hover:bg-primary/90"),
  outline: cn(btn, "border-border-strong bg-surface text-foreground hover:bg-surface-2"),
  danger: cn(btn, "border-destructive/30 bg-destructive-soft text-destructive hover:bg-destructive/10"),
};

export function Stat({
  label,
  value,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: ReactNode;
  tone?: "neutral" | "red" | "amber" | "green" | "teal";
  hint?: string;
}) {
  const color = {
    neutral: "text-foreground",
    red: "text-destructive",
    amber: "text-warning",
    green: "text-success",
    teal: "text-primary",
  }[tone];
  return (
    <div className="px-4 py-3">
      <div className="label-caps">{label}</div>
      <div className={cn("mt-1 text-[22px] font-semibold tabular-nums leading-none", color)}>
        {value}
      </div>
      {hint ? <div className="mt-1.5 text-[11.5px] text-muted-foreground">{hint}</div> : null}
    </div>
  );
}
