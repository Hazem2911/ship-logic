import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  AlertOctagon,
  FileText,
  GitBranch,
  LayoutDashboard,
  ListChecks,
  Menu,
  Settings,
  ShieldCheck,
  Terminal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { project, currentRun } from "@/lib/demo-data";
import { Mono } from "@/components/kit";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/changes", label: "Changes", icon: GitBranch },
  { to: "/scenarios", label: "Scenarios", icon: ListChecks },
  { to: "/executions", label: "Executions", icon: Terminal },
  { to: "/findings", label: "Findings", icon: AlertOctagon },
  { to: "/reports", label: "Reports", icon: FileText },
];

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5">
      {nav.map((item) => {
        const active =
          item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-[6px] px-2.5 py-[7px] text-[13px] font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-accent-foreground"
                : "text-sidebar-foreground hover:bg-surface-2",
            )}
          >
            <Icon className="size-[15px] opacity-80" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
      <div className="my-2 h-px bg-sidebar-border" />
      <Link
        to="/gate"
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-2.5 rounded-[6px] border px-2.5 py-[7px] text-[13px] font-medium transition-colors",
          pathname.startsWith("/gate")
            ? "border-destructive/30 bg-destructive-soft text-destructive"
            : "border-border bg-surface text-foreground hover:bg-surface-2",
        )}
      >
        <ShieldCheck className="size-[15px] opacity-80" strokeWidth={1.75} />
        Quality Gate
        <span className="ml-auto font-mono text-[10px] font-semibold uppercase text-destructive">
          Blocked
        </span>
      </Link>
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-sidebar-border px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-[5px] bg-primary text-[11px] font-bold text-primary-foreground">
            Q
          </span>
          <span className="text-[14px] font-semibold tracking-tight">AI Quality Gate</span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-1.5 rounded-full bg-success" />
          </span>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-success">
            {project.agent}
          </span>
        </div>
      </div>

      <div className="border-b border-sidebar-border px-4 py-3">
        <div className="label-caps">Project</div>
        <button
          type="button"
          className="mt-1.5 flex w-full items-center justify-between rounded-[6px] border border-border bg-surface px-2.5 py-1.5 text-left text-[13px] font-medium hover:bg-surface-2"
        >
          {project.name}
          <span className="font-mono text-[10px] uppercase text-muted-foreground">
            {project.platform}
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 py-3">
        <NavList onNavigate={onNavigate} />

        {currentRun.active ? (
          <div className="mt-4 rounded-[6px] border border-primary/25 bg-primary-soft px-2.5 py-2.5">
            <div className="flex items-center gap-1.5">
              <Activity className="size-[13px] text-primary" strokeWidth={2} />
              <span className="label-caps text-accent-foreground">Run in progress</span>
            </div>
            <div className="mt-1.5 font-mono text-[11px] leading-snug text-foreground">
              {currentRun.label}
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${currentRun.progress}%` }}
              />
            </div>
            <div className="mt-1.5 text-[10.5px] text-muted-foreground">{currentRun.detail}</div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="label-caps">Repository</div>
            <div className="mt-1 truncate font-mono text-[11.5px]">{project.repository}</div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <GitBranch className="size-3" strokeWidth={1.75} />
              <span className="truncate font-mono">{project.branch}</span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-muted-foreground">
              HEAD {project.commit} · {project.repoStatus}
            </div>
          </div>
          <button
            type="button"
            aria-label="Settings"
            className="rounded-[5px] border border-border bg-surface p-1.5 text-muted-foreground hover:bg-surface-2"
          >
            <Settings className="size-[14px]" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarBody />
      </aside>

      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-sidebar px-4 py-2.5 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="rounded-[5px] border border-border bg-surface p-1.5"
        >
          <Menu className="size-4" strokeWidth={1.75} />
        </button>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold">AI Quality Gate</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-success">
            {project.agent}
          </div>
        </div>
        <Link
          to="/gate"
          className="ml-auto rounded-[5px] border border-destructive/30 bg-destructive-soft px-2 py-1 font-mono text-[10px] font-semibold uppercase text-destructive"
        >
          Do not ship
        </Link>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/25"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-[264px] border-r border-sidebar-border bg-sidebar">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="absolute right-2 top-2 rounded-[5px] border border-border bg-surface p-1.5"
            >
              <X className="size-3.5" strokeWidth={1.75} />
            </button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="min-w-0">
        <div key={pathname} className="view-enter mx-auto max-w-[1220px] px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </div>
        <footer className="border-t border-border px-4 py-4 sm:px-6">
          <p className="mx-auto max-w-[1220px] text-[11.5px] leading-relaxed text-muted-foreground">
            Local-first prototype with seeded data. Repository contents are analyzed by the local
            agent and are not stored remotely. Findings combine deterministic execution results with
            AI interpretation — AI conclusions are labelled and can be wrong.{" "}
            <Mono>{project.analyzedAt}</Mono>
          </p>
        </footer>
      </main>
    </div>
  );
}
