export interface ReportAction {
  kind: string;
  label: string;
  viewport: string;
  beforeUrl: string;
  outcome: "passed" | "failed" | "review";
  detail: string;
  evidenceId?: string;
  evidenceNote?: string;
  expected?: string;
  observed?: string;
}

export interface ReportPresentation {
  title: string;
  url: string;
  response: string;
  summary: string;
  sample: string;
  completion: string;
  sections: {
    kind: "issue" | "review" | "recommendation";
    title: string;
    items: {
      title: string;
      detail: string;
      nextStep?: string;
      location?: string;
      examples?: {
        label: string;
        evidenceId?: string;
        evidenceNote?: string;
      }[];
    }[];
  }[];
}

export interface ScreenshotEvidence {
  id: string;
  dataUrl: string;
  caption: string;
}

export interface ReportJourney {
  name: string;
  reason: string;
  outcome: "passed" | "failed" | "review";
  detail: string;
  steps: number[];
}
