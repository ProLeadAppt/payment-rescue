#!/usr/bin/env python3
"""Generate a local Payment Rescue operations dashboard.

Reads Hermes cron jobs/output + reports, checks live site health, and writes a
single static HTML file under ~/.hermes/reports/payment-rescue-ops-dashboard.html.
"""
from __future__ import annotations

import html
import json
import os
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import URLError, HTTPError
from urllib.request import Request, urlopen

HOME = Path(os.environ.get("HERMES_HOME", str(Path.home() / ".hermes")))
REPORTS = HOME / "reports"
CRON = HOME / "cron"
OUTPUT = REPORTS / "payment-rescue-ops-dashboard.html"
SITE = "https://payment-rescue.vercel.app"
REPO = HOME / "payment-rescue-repo"

PAYMENT_KEYWORDS = ("payment rescue", "pr ", "payment-rescue")


def esc(value) -> str:
    return html.escape("" if value is None else str(value))


def fetch(url: str, method: str = "GET", body: bytes | None = None, timeout: int = 20) -> dict:
    start = time.time()
    try:
        req = Request(url, data=body, method=method, headers={"Content-Type": "application/json"})
        with urlopen(req, timeout=timeout) as res:
            content = res.read(4000).decode("utf-8", "replace")
            return {"ok": 200 <= res.status < 400, "status": res.status, "ms": int((time.time() - start) * 1000), "body": content[:500]}
    except HTTPError as e:
        content = e.read(1000).decode("utf-8", "replace") if hasattr(e, "read") else ""
        return {"ok": 200 <= e.code < 400, "status": e.code, "ms": int((time.time() - start) * 1000), "body": content[:500]}
    except (URLError, TimeoutError, Exception) as e:
        return {"ok": False, "status": "ERR", "ms": int((time.time() - start) * 1000), "body": str(e)[:500]}


def run(cmd: list[str], cwd: Path | None = None, timeout: int = 30) -> str:
    try:
        return subprocess.check_output(cmd, cwd=str(cwd) if cwd else None, stderr=subprocess.STDOUT, text=True, timeout=timeout).strip()
    except Exception as e:
        return f"ERROR: {e}"


def load_jobs() -> list[dict]:
    path = CRON / "jobs.json"
    if not path.exists():
        return []
    data = json.loads(path.read_text())
    return data.get("jobs", [])


def job_id_of(job: dict) -> str:
    return str(job.get("id") or job.get("job_id") or "")


def schedule_of(job: dict) -> str:
    sched = job.get("schedule")
    if isinstance(sched, dict):
        return str(job.get("schedule_display") or sched.get("display") or sched.get("expr") or "")
    return str(job.get("schedule_display") or sched or "")


def latest_output(job_id: str) -> tuple[str, str]:
    out_dir = CRON / "output" / job_id
    if not out_dir.exists():
        return "", ""
    files = sorted(out_dir.glob("*.md"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not files:
        return "", ""
    text = files[0].read_text(errors="replace")
    first = " ".join(line.strip() for line in text.splitlines() if line.strip())[:260]
    return str(files[0]), first


def status_class(job: dict) -> str:
    if not job.get("enabled", True):
        return "paused"
    status = job.get("last_status")
    if status == "ok":
        return "ok"
    if status == "error":
        return "bad"
    return "warn"


def is_payment_job(job: dict) -> bool:
    hay = f"{job.get('name','')} {job.get('prompt','')}".lower()
    return any(k in hay for k in PAYMENT_KEYWORDS)


def rel(path: str) -> str:
    if not path:
        return ""
    try:
        return str(Path(path).relative_to(REPORTS))
    except Exception:
        return path


def collect_reports() -> list[Path]:
    if not REPORTS.exists():
        return []
    files = [p for p in REPORTS.iterdir() if p.is_file() and p.suffix.lower() in {".md", ".html", ".pdf", ".png"}]
    return sorted(files, key=lambda p: p.stat().st_mtime, reverse=True)[:40]


def main() -> None:
    REPORTS.mkdir(parents=True, exist_ok=True)
    jobs = load_jobs()
    payment_jobs = [j for j in jobs if is_payment_job(j)]
    legacy_jobs = [j for j in jobs if j not in payment_jobs]

    checks = [
        ("Landing page", fetch(SITE)),
        ("Dashboard auth redirect", fetch(f"{SITE}/dashboard")),
        ("SMS verify-send unauth guard", fetch(f"{SITE}/api/sms/verify-send", method="POST", body=b"{}")),
        ("SMS verify-check unauth guard", fetch(f"{SITE}/api/sms/verify-check", method="POST", body=b'{"code":"0000"}')),
    ]

    git_head = run(["git", "log", "--oneline", "-1"], REPO) if REPO.exists() else "repo missing"
    git_status = run(["git", "status", "--short"], REPO) if REPO.exists() else "repo missing"
    build_hint = "Last verified manually with npm run build after mobile verification fix."

    ok_jobs = sum(1 for j in jobs if j.get("last_status") == "ok")
    bad_jobs = sum(1 for j in jobs if j.get("last_status") == "error")
    configured_gpt55 = sum(1 for j in jobs if j.get("model") == "gpt-5.5" and j.get("provider") == "openai-codex")
    health_ok = sum(1 for _, c in checks if c["ok"] or c["status"] in (307, 401, 400))

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    def job_card(job: dict) -> str:
        klass = status_class(job)
        out_path, preview = latest_output(job_id_of(job))
        err = job.get("last_error") or ""
        model = f"{job.get('provider') or 'global'}/{job.get('model') or 'global'}"
        sched = schedule_of(job)
        return f"""
        <article class='card job {klass}'>
          <div class='row between'><h3>{esc(job.get('name'))}</h3><span class='pill {klass}'>{esc(job.get('last_status') or 'not run')}</span></div>
          <p class='muted'>ID: <code>{esc(job_id_of(job))}</code> · Schedule: <code>{esc(sched)}</code></p>
          <p><b>Model:</b> {esc(model)} · <b>Next:</b> {esc(job.get('next_run_at'))}</p>
          <p><b>Last:</b> {esc(job.get('last_run_at') or 'never')}</p>
          {f"<p class='badtext'><b>Error:</b> {esc(err[:360])}</p>" if err else ""}
          {f"<p><b>Latest output:</b> <a href='file://{esc(out_path)}'>{esc(Path(out_path).name)}</a><br><span class='muted'>{esc(preview)}</span></p>" if out_path else "<p class='muted'>No output file yet.</p>"}
        </article>"""

    report_rows = "".join(
        f"<li><a href='file://{esc(str(p))}'>{esc(p.name)}</a><span>{esc(datetime.fromtimestamp(p.stat().st_mtime).strftime('%d/%m %H:%M'))}</span></li>"
        for p in collect_reports()
    )

    check_rows = "".join(
        f"<div class='check {'ok' if (c['ok'] or c['status'] in (307,401,400)) else 'bad'}'><b>{esc(name)}</b><span>{esc(c['status'])} · {esc(c['ms'])}ms</span><small>{esc(c['body'][:160])}</small></div>"
        for name, c in checks
    )

    payment_cards = "".join(job_card(j) for j in payment_jobs)
    legacy_cards = "".join(job_card(j) for j in legacy_jobs)

    html_doc = f"""<!doctype html>
<html lang='en'>
<head>
<meta charset='utf-8'>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<title>Payment Rescue Ops Dashboard</title>
<style>
:root{{--bg:#07111f;--panel:#0d1b2f;--panel2:#10243d;--text:#eaf2ff;--muted:#8fa6c5;--ok:#15be53;--warn:#f5a524;--bad:#ea2261;--brand:#7c5cff;}}
*{{box-sizing:border-box}}body{{margin:0;background:radial-gradient(circle at top left,#1e2f67 0,#07111f 35%,#050914 100%);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;color:var(--text)}}
a{{color:#9fb8ff;text-decoration:none}}a:hover{{text-decoration:underline}}.wrap{{max-width:1220px;margin:0 auto;padding:28px}}.hero{{display:flex;gap:20px;align-items:flex-end;justify-content:space-between;margin-bottom:24px}}h1{{font-size:40px;margin:0 0 8px}}h2{{font-size:22px;margin:26px 0 12px}}h3{{margin:0 0 8px;font-size:17px}}.muted{{color:var(--muted)}}.grid{{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}}.grid2{{display:grid;grid-template-columns:1.4fr .9fr;gap:16px}}.jobs{{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:14px}}.card,.metric,.check{{background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035));border:1px solid rgba(255,255,255,.11);border-radius:18px;padding:16px;box-shadow:0 10px 40px rgba(0,0,0,.25)}}.metric b{{font-size:30px;display:block}}.metric span{{color:var(--muted);font-size:13px}}.row{{display:flex;gap:12px;align-items:center}}.between{{justify-content:space-between}}.pill{{padding:5px 10px;border-radius:999px;font-size:12px;font-weight:700;text-transform:uppercase}}.pill.ok{{background:rgba(21,190,83,.15);color:#78f0a2}}.pill.bad{{background:rgba(234,34,97,.15);color:#ff85af}}.pill.warn{{background:rgba(245,165,36,.15);color:#ffd58c}}.pill.paused{{background:rgba(143,166,197,.15);color:#c2d2e8}}.job.ok{{border-color:rgba(21,190,83,.28)}}.job.bad{{border-color:rgba(234,34,97,.34)}}.badtext{{color:#ff9bb9}}code{{background:rgba(255,255,255,.09);padding:2px 6px;border-radius:6px;color:#d9e7ff}}.checks{{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px}}.check b,.check span,.check small{{display:block}}.check span{{color:var(--muted);margin:4px 0}}.check.ok{{border-color:rgba(21,190,83,.3)}}.check.bad{{border-color:rgba(234,34,97,.35)}}ul.reports{{list-style:none;margin:0;padding:0}}ul.reports li{{display:flex;justify-content:space-between;gap:10px;border-bottom:1px solid rgba(255,255,255,.08);padding:10px 0}}.actions li{{margin:9px 0}}.footer{{margin:34px 0 8px;color:var(--muted);font-size:13px}}@media(max-width:850px){{.grid,.grid2{{grid-template-columns:1fr}}.hero{{display:block}}h1{{font-size:31px}}}}
</style>
</head>
<body><div class='wrap'>
  <section class='hero'>
    <div><p class='pill warn' style='display:inline-block'>Payment Rescue Command Centre</p><h1>Ops Dashboard</h1><p class='muted'>Live health, cron agents, generated reports, and recommended scheduled agents. Updated {esc(now)}.</p></div>
    <div class='row'><a class='pill ok' href='{SITE}'>Open live app</a><a class='pill warn' href='file://{OUTPUT}'>Local dashboard file</a></div>
  </section>

  <section class='grid'>
    <div class='metric'><b>{health_ok}/{len(checks)}</b><span>core health checks passing</span></div>
    <div class='metric'><b>{len(payment_jobs)}</b><span>Payment Rescue scheduled agents</span></div>
    <div class='metric'><b>{configured_gpt55}/{len(jobs)}</b><span>cron jobs pinned to GPT-5.5/Codex</span></div>
    <div class='metric'><b>{bad_jobs}</b><span>jobs with previous error history</span></div>
  </section>

  <h2>Live app checks</h2><section class='checks'>{check_rows}</section>

  <section class='grid2'>
    <div><h2>Current Payment Rescue agents</h2><section class='jobs'>{payment_cards or '<p class="muted">No Payment Rescue jobs found.</p>'}</section></div>
    <aside><h2>Reports hub</h2><div class='card'><ul class='reports'>{report_rows}</ul></div>
    <h2>Recommended agent stack</h2><div class='card'><ul class='actions'>
      <li><b>Hourly uptime watchdog:</b> only alerts on site/API/auth/SMS route failure.</li>
      <li><b>Daily morning founder brief:</b> concise Payment Rescue action list, AEST.</li>
      <li><b>Lead finder:</b> Australian tradies with late-payment pain signals.</li>
      <li><b>Competitor watch:</b> Chaser, ezyCollect, GoCardless, Chargeflow, Square/Stripe issues.</li>
      <li><b>Weekly content pack:</b> Facebook group posts, objections, CTA angles.</li>
      <li><b>Engagement/onboarding check:</b> signups stuck before first invoice/SMS.</li>
    </ul></div></aside>
  </section>

  <h2>Legacy / non-PR jobs still active</h2><section class='jobs'>{legacy_cards or '<p class="muted">No legacy jobs active.</p>'}</section>

  <h2>Build and repo status</h2><section class='card'><p><b>HEAD:</b> <code>{esc(git_head)}</code></p><p><b>Git status:</b> <code>{esc(git_status or 'clean')}</code></p><p>{esc(build_hint)}</p></section>

  <p class='footer'>Generated by ~/.hermes/scripts/payment_rescue_ops_dashboard.py. Serve this directory with a tunnel for phone-friendly access.</p>
</div></body></html>"""
    OUTPUT.write_text(html_doc)
    print(str(OUTPUT))


if __name__ == "__main__":
    main()
