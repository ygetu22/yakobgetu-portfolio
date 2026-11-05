"use client";

import ActionLinkLabel from "@/components/ui/action-link-label";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "./trace.module.css";

import {
  ActionResult,
  ReportOverview,
  JourneyResult,
  actionLocation,
} from "./report-view";
import type {
  ReportAction,
  ReportPresentation,
  ScreenshotEvidence,
  ReportJourney,
} from "./report-types";

interface Usage {
  remaining: number;
  retryAt: string | null;
  unlimited?: boolean;
}

async function loadUsage(signal?: AbortSignal): Promise<Usage> {
  const response = await fetch("/api/trace/usage", {
    cache: "no-store",
    signal,
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error ?? "Usage tracking is unavailable.");
  return data;
}

export default function TracePage() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState("");
  const [downloadText, setDownloadText] = useState("");
  const [completion, setCompletion] = useState("completed");
  const [actions, setActions] = useState<ReportAction[]>([]);
  const [presentation, setPresentation] = useState<ReportPresentation | null>(
    null,
  );
  const [screenshots, setScreenshots] = useState<ScreenshotEvidence[]>([]);
  const [journey, setJourney] = useState<ReportJourney | null>(null);
  const [limits, setLimits] = useState<string[]>([]);
  const downloadLink = useRef<HTMLAnchorElement>(null);
  const capture = useRef<AbortController | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    loadUsage(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setUsage(data);
      })
      .catch((cause) => {
        if (!controller.signal.aborted)
          setError(
            cause instanceof Error
              ? cause.message
              : "Usage tracking is unavailable.",
          );
      });
    return () => {
      controller.abort();
      capture.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!report) return;
    const url = URL.createObjectURL(
      new Blob([downloadText || report], { type: "text/plain;charset=utf-8" }),
    );
    if (downloadLink.current) downloadLink.current.href = url;
    heading.current?.focus();
    return () => URL.revokeObjectURL(url);
  }, [report, downloadText]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (capture.current || !usage || usage.remaining === 0) return;
    const form = new FormData(event.currentTarget);
    const featureLabel = String(form.get("featureLabel") ?? "").trim();
    const expectedText = String(form.get("expectedText") ?? "").trim();
    if (Boolean(featureLabel) !== Boolean(expectedText)) {
      setError(
        "For a feature check, enter both the control name and expected text.",
      );
      return;
    }
    const payload: {
      url: string;
      featureCheck?: { label: string; expectedText: string };
    } = { url: String(form.get("url") ?? "").trim() };
    if (featureLabel)
      payload.featureCheck = { label: featureLabel, expectedText };
    const controller = new AbortController();
    capture.current = controller;
    setBusy(true);
    setError("");
    setReport("");
    setDownloadText("");
    setCompletion("completed");
    setActions([]);
    setLimits([]);
    setPresentation(null);
    setScreenshots([]);
    setJourney(null);
    try {
      const response = await fetch("/api/trace/captures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(100_000),
        ]),
      });
      const data = await response.json();
      if (data.usage) setUsage(data.usage);
      if (!response.ok)
        throw new Error(data.error ?? "The check could not complete.");
      if (typeof data.text !== "string")
        throw new Error("Trace returned an invalid text report.");
      setReport(data.text);
      setDownloadText(
        typeof data.downloadText === "string" ? data.downloadText : data.text,
      );
      setCompletion(
        data.coverage?.status ??
          (data.incomplete ? "interrupted" : "completed"),
      );
      setPresentation(data.presentation ?? null);
      setScreenshots(Array.isArray(data.screenshots) ? data.screenshots : []);
      setJourney(data.journey ?? null);
      setActions(Array.isArray(data.actions) ? data.actions : []);
      setLimits(Array.isArray(data.limits) ? data.limits : []);
    } catch (cause) {
      if (!controller.signal.aborted)
        setError(
          cause instanceof Error
            ? cause.message
            : "The check could not complete.",
        );
    } finally {
      if (!controller.signal.aborted) {
        try {
          setUsage(await loadUsage(controller.signal));
        } catch {
          setUsage(null);
          setError(
            "Usage tracking is unavailable. Restart the local server and reload.",
          );
        }
        setBusy(false);
      }
      capture.current = null;
    }
  }

  return (
    <div className={styles.page}>
      <Link href="/projects" className={styles.back}>
        <ActionLinkLabel direction="back">All projects</ActionLinkLabel>
      </Link>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowMark} /> Website check{" "}
            <span className={styles.eyebrowIndex}>01 / 01</span>
          </p>
          <h1 className={styles.title}>
            Trace<span>.</span>
          </h1>
          <p className={styles.intro}>A closer look at a website.</p>
          <p className={styles.copy}>
            Enter a public URL. Trace tries a short visitor path and checks page
            health on desktop and mobile. See what worked, what needs review,
            and screenshots of failed or unverified steps.
          </p>
        </div>
        <div className={styles.heroAside} aria-label="Trace check summary">
          <span className={styles.asideRule} />
          <p>Desktop + mobile</p>
          <p>Evidence based</p>
          <p>Screenshot evidence</p>
        </div>
      </header>
      <section className={styles.panel} aria-labelledby="investigate-heading">
        <div className={styles.panelTop}>
          <div>
            <p className={styles.panelKicker}>Start here</p>
            <h2 id="investigate-heading">Enter a website URL</h2>
          </div>
          <span className={styles.panelIndex}>TRACE / 001</span>
        </div>
        <form onSubmit={submit} className={styles.form} aria-busy={busy}>
          <label htmlFor="trace-url">Website address</label>
          <div className={styles.inputRow}>
            <span className={styles.inputPrefix} aria-hidden="true">
              ↗
            </span>
            <input
              className={styles.input}
              id="trace-url"
              name="url"
              type="url"
              placeholder="https://your-website.com"
              maxLength={2048}
              readOnly={busy}
              required
              aria-describedby="trace-usage"
            />
            <button
              className={styles.button}
              disabled={busy || !usage || usage.remaining === 0}
            >
              <span>{busy ? "Checking" : "Run check"}</span>
              <span className={styles.buttonArrow} aria-hidden="true">
                ↗
              </span>
            </button>
          </div>
          <details className={styles.featureCheck}>
            <summary>Check one specific feature (optional)</summary>
            <p>
              Enter the exact accessible name of a button, tab, or link and the
              text that should appear after it is clicked. Trace tries it on
              desktop and mobile when safe.
            </p>
            <label htmlFor="trace-feature-label">
              Control’s accessible name
            </label>
            <input
              className={styles.featureInput}
              id="trace-feature-label"
              name="featureLabel"
              maxLength={200}
              placeholder="For example: Show hours"
              readOnly={busy}
            />
            <label htmlFor="trace-expected-text">Text that should appear</label>
            <input
              className={styles.featureInput}
              id="trace-expected-text"
              name="expectedText"
              maxLength={500}
              placeholder="For example: Open today until 5 PM"
              readOnly={busy}
            />
          </details>
          <div className={styles.formFooter}>
            <p id="trace-usage" className={styles.status} role="status">
              {!usage?.unlimited && (
                <span className={styles.usageDots} aria-hidden="true">
                  {[0, 1, 2].map((index) => (
                    <i
                      key={index}
                      className={
                        usage && index >= usage.remaining ? styles.used : ""
                      }
                    />
                  ))}
                </span>
              )}
              {usage ? (
                usage.unlimited ? (
                  <span>Unlimited checks in development.</span>
                ) : (
                  <span>
                    {usage.remaining} of 3 checks remaining{" "}
                    <span className={styles.statusDetail}>
                      · per IP, every 24 hours
                    </span>
                    {usage.retryAt ? (
                      <span className={styles.statusDetail}>
                        {" "}
                        · Next check {new Date(usage.retryAt).toLocaleString()}.
                      </span>
                    ) : null}
                  </span>
                )
              ) : (
                <span>Loading available checks…</span>
              )}
            </p>
            <span className={styles.localNote}>
              {usage?.unlimited ? "Debug mode" : "Local preview"}
            </span>
          </div>
          {busy && (
            <div className={styles.progress} role="status">
              <span className={styles.progressBar} />
              <span>
                Opening pages, trying buttons and form fields, and recording
                what happens. This can take up to 90 seconds.
              </span>
            </div>
          )}
        </form>
        {error && (
          <p role="alert" className={`${styles.status} ${styles.error}`}>
            {error}
          </p>
        )}
      </section>
      {report && (
        <section className={styles.report} aria-labelledby="report-heading">
          <div className={styles.reportHeader}>
            <div>
              <p className={styles.panelKicker}>
                {completion === "blocked"
                  ? "Access blocked"
                  : completion === "interrupted"
                    ? "Stopped early"
                    : "Sample checked"}
              </p>
              <h2 id="report-heading" ref={heading} tabIndex={-1}>
                Your report<span>.</span>
              </h2>
            </div>
            <a
              className={styles.download}
              ref={downloadLink}
              download="trace-report.txt"
            >
              <ActionLinkLabel direction="download">
                Save text report
              </ActionLinkLabel>
            </a>
          </div>
          {presentation ? (
            <ReportOverview
              presentation={presentation}
              screenshots={screenshots}
            >
              {journey && (
                <JourneyResult
                  journey={journey}
                  actions={actions}
                  screenshots={screenshots}
                />
              )}
            </ReportOverview>
          ) : (
            <div className={styles.reportFrame}>
              <pre className={styles.textReport}>{report}</pre>
            </div>
          )}
          {!presentation && journey && (
            <JourneyResult
              journey={journey}
              actions={actions}
              screenshots={screenshots}
            />
          )}
          {screenshots.length > 0 && (
            <p className={styles.evidenceNote}>
              Screenshots stay in this page until you leave or reload. Save
              images separately; the text report does not include them.
            </p>
          )}
          {actions.length > 0 && (
            <details className={styles.featureCheck}>
              <summary>All actions tried ({actions.length})</summary>
              <ol className={styles.actionList}>
                {actions.map((action, index) => (
                  <li key={index}>
                    <ActionResult action={action} screenshots={screenshots} />
                  </li>
                ))}
              </ol>
            </details>
          )}
          {limits.length > 0 && (
            <details className={styles.featureCheck}>
              <summary>Check details</summary>
              <ul className={styles.actionList}>
                {limits.map((limit, index) => (
                  <li key={index}>
                    {limit.replace(/https?:\/\/[^\s]+/g, actionLocation)}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>
      )}
      <footer className={styles.footnote}>
        <span>About this check</span>
        <p>
          Trace selects a public browsing path from page text and links; it may
          not match the site’s full purpose. Up to three links and selected
          controls are tried within a time limit. Sign-in, payments, and
          successful submissions are untested. Live checks are local only.
        </p>
      </footer>
    </div>
  );
}
