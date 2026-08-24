import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Panel, PanelHeader, PageHeader, Tag, Mono, Stat, SeverityTag } from "@/components/kit";
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
  component: ScenarioBoard;
});

function ScenarioBoard() {
  return null;
}
