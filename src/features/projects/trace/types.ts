export interface TraceFinding {
  kind: string;
  classification?: "issue" | "review" | "recommendation";
  summary: string;
  explanation?: string;
  pageUrl: string;
  viewport: { width: number; height: number };
  evidence: Record<string, unknown>;
  reproduce: string[];
  screenshotUrl?: string;
}

export interface TraceReport {
  id: string;
  title: string;
  requestedUrl: string;
  finalUrl: string;
  status: number;
  capturedAt: string;
  durationMs: number;
  screenshotUrl: string;
  mobile: { screenshotUrl: string };
  findings: TraceFinding[];
  actions: { kind: string; label: string; outcome: string; detail?: string }[];
  coverage: { pagesVisited: number; controlsTested: number; linksTested: number; featureTests: number; accessBlocked: boolean; limited: boolean; skipped: string[] };
  traceUrls: { desktop: string; mobile: string };
}
