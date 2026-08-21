"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  LogOut,
  RefreshCcw,
  Inbox,
  PhoneCall,
  Mail,
  MapPin,
  ChevronDown,
  AlertCircle,
} from "lucide-react";

type Submission = {
  ts: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  poolSize?: string;
  source?: string;
  message?: string;
  email_status?: string;
};

type Call = { ts: string; location: string; page: string };

type ApiData = {
  ok: boolean;
  submissions: Submission[];
  calls: Call[];
  callsCapped?: boolean;
  generatedAt?: string;
};

type Preset = "7" | "30" | "90" | "all" | "custom";

const PRESETS: { value: Preset; label: string }[] = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "all", label: "All time" },
];

/**
 * Parse a "YYYY-MM-DD" value from <input type="date"> as LOCAL midnight.
 * `new Date("2026-06-16")` would parse as UTC midnight, which lands on the
 * previous day in negative-offset timezones — shifting the whole range back a
 * day relative to the local-time grouping/display. Building from parts avoids that.
 */
function parseLocalDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function dayKey(ts: string): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fmtDayLabel(ts: string): string {
  return new Date(ts).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtTime(ts: string): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const LOCATION_LABELS: Record<string, string> = {
  header: "Header",
  footer: "Footer",
  contact_form: "Contact form",
  body: "Page body",
  unknown: "Other",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [data, setData] = useState<ApiData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [preset, setPreset] = useState<Preset>("30");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [tab, setTab] = useState<"submissions" | "calls">("submissions");

  async function load(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/data.php", {
        credentials: "include",
        cache: "no-store",
      });
      if (res.status === 401) {
        router.replace("/admin/login/");
        return;
      }
      const json: ApiData = await res.json();
      setData(json);
      setStatus("ready");
    } catch {
      setStatus("error");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    try {
      await fetch("/api/admin/logout.php", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* ignore */
    }
    router.replace("/admin/login/");
  }

  // Resolve the active [from, to] window from the preset / custom inputs.
  const [from, to] = useMemo<[number, number]>(() => {
    const now = Date.now();
    if (preset === "all") return [0, now + 86400000];
    if (preset === "custom") {
      const fd = customFrom ? parseLocalDate(customFrom) : null;
      const td = customTo ? parseLocalDate(customTo) : null;
      const f = fd ? fd.getTime() : 0;
      const t = td ? td.getTime() + 86400000 - 1 : now + 86400000;
      return [f, t];
    }
    const days = Number(preset);
    return [now - days * 86400000, now + 86400000];
  }, [preset, customFrom, customTo]);

  const inRange = (ts: string) => {
    const t = new Date(ts).getTime();
    return !Number.isNaN(t) && t >= from && t <= to;
  };

  const submissions = useMemo(
    () =>
      (data?.submissions ?? [])
        .filter((s) => s.ts && inRange(s.ts))
        .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, from, to]
  );

  const calls = useMemo(
    () => (data?.calls ?? []).filter((c) => c.ts && inRange(c.ts)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, from, to]
  );

  // Group submissions by local day.
  const submissionsByDay = useMemo(() => {
    const groups = new Map<string, Submission[]>();
    for (const s of submissions) {
      const k = dayKey(s.ts);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(s);
    }
    return Array.from(groups.entries());
  }, [submissions]);

  // Calls aggregated by day (desc) and by location.
  const callsByDay = useMemo(() => {
    const m = new Map<string, { label: string; count: number }>();
    for (const c of calls) {
      const k = dayKey(c.ts);
      if (!m.has(k)) m.set(k, { label: fmtDayLabel(c.ts), count: 0 });
      m.get(k)!.count++;
    }
    return Array.from(m.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [calls]);

  const callsByLocation = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of calls) {
      const key = c.location || "unknown";
      m.set(key, (m.get(key) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [calls]);

  const maxDayCalls = Math.max(1, ...callsByDay.map(([, v]) => v.count));

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle size={32} className="text-red-500" />
        <p className="text-gray-600">
          Couldn&apos;t load the dashboard data.
        </p>
        <button
          onClick={() => load(true)}
          className="px-5 py-2.5 bg-accent text-white font-semibold rounded-full"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Form submissions and call-button clicks.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-accent/40 hover:text-primary transition disabled:opacity-50"
            >
              <RefreshCcw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-red-300 hover:text-red-600 transition"
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>

        {/* Period filter */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="inline-flex rounded-full bg-white border border-gray-200 p-1">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPreset(p.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  preset === p.value
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 text-sm">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => {
                setCustomFrom(e.target.value);
                setPreset("custom");
              }}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-700 focus:border-accent outline-none"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => {
                setCustomTo(e.target.value);
                setPreset("custom");
              }}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-700 focus:border-accent outline-none"
            />
          </div>
        </div>

        {/* Summary cards (click to switch tab) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setTab("submissions")}
            className={`rounded-2xl bg-white border p-6 flex items-center gap-4 shadow-sm text-left transition ${
              tab === "submissions"
                ? "border-accent ring-1 ring-accent/30"
                : "border-gray-100 hover:border-accent/40"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Inbox size={22} className="text-accent" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {submissions.length}
              </p>
              <p className="text-sm text-gray-500">Form submissions</p>
            </div>
          </button>
          <button
            onClick={() => setTab("calls")}
            className={`rounded-2xl bg-white border p-6 flex items-center gap-4 shadow-sm text-left transition ${
              tab === "calls"
                ? "border-primary ring-1 ring-primary/30"
                : "border-gray-100 hover:border-primary/40"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <PhoneCall size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{calls.length}</p>
              <p className="text-sm text-gray-500">Call-button clicks</p>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div className="inline-flex rounded-full bg-white border border-gray-200 p-1 mb-8">
          <button
            onClick={() => setTab("submissions")}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition ${
              tab === "submissions"
                ? "bg-primary text-white"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            <Inbox size={15} />
            Form Submissions
          </button>
          <button
            onClick={() => setTab("calls")}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition ${
              tab === "calls"
                ? "bg-primary text-white"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            <PhoneCall size={15} />
            Call Clicks
          </button>
        </div>

        {/* Submissions */}
        {tab === "submissions" && (
          <>
        {submissionsByDay.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-100 p-10 text-center text-gray-400 mb-12">
            No submissions in this period.
          </div>
        ) : (
          <div className="space-y-6 mb-12">
            {submissionsByDay.map(([key, items]) => (
              <div key={key}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">
                    {fmtDayLabel(items[0].ts)}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {items.length} lead{items.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-3">
                  {items.map((s, i) => (
                    <div
                      key={`${key}-${i}`}
                      className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {s.name || "—"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {fmtTime(s.ts)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {s.poolSize && (
                            <span className="text-xs bg-accent/10 text-accent font-medium rounded-full px-2.5 py-1">
                              {s.poolSize}
                            </span>
                          )}
                          {s.source && (
                            <span className="text-xs bg-gray-100 text-gray-600 font-medium rounded-full px-2.5 py-1">
                              via {s.source}
                            </span>
                          )}
                          {s.email_status === "failed" && (
                            <span className="text-xs bg-amber-100 text-amber-700 font-medium rounded-full px-2.5 py-1">
                              email failed
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                        {s.phone && (
                          <a
                            href={`tel:${s.phone}`}
                            className="flex items-center gap-2 text-gray-700 hover:text-accent"
                          >
                            <PhoneCall size={14} className="text-gray-400" />
                            {s.phone}
                          </a>
                        )}
                        {s.email && (
                          <a
                            href={`mailto:${s.email}`}
                            className="flex items-center gap-2 text-gray-700 hover:text-accent break-all"
                          >
                            <Mail size={14} className="text-gray-400 shrink-0" />
                            {s.email}
                          </a>
                        )}
                        {(s.address || s.city || s.state) && (
                          <span className="flex items-center gap-2 text-gray-700">
                            <MapPin size={14} className="text-gray-400 shrink-0" />
                            {[s.address, s.city, s.state, s.zip]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        )}
                      </div>

                      {s.message && (
                        <details className="mt-3 group">
                          <summary className="flex items-center gap-1 text-sm text-accent font-medium cursor-pointer list-none">
                            <ChevronDown
                              size={14}
                              className="group-open:rotate-180 transition-transform"
                            />
                            Message
                          </summary>
                          <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-xl p-3">
                            {s.message}
                          </p>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {/* Calls */}
        {tab === "calls" && (
          <>
        <div className="grid lg:grid-cols-2 gap-4">
          {/* By day */}
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">By day</h3>
            {callsByDay.length === 0 ? (
              <p className="text-gray-400 text-sm">No clicks in this period.</p>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {callsByDay.map(([key, v]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-xs text-gray-500">
                      {v.label}
                    </span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        style={{
                          width: `${(v.count / maxDayCalls) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-7 shrink-0 text-sm font-semibold text-gray-700 text-right">
                      {v.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* By location */}
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              By location on site
            </h3>
            {callsByLocation.length === 0 ? (
              <p className="text-gray-400 text-sm">No clicks in this period.</p>
            ) : (
              <div className="space-y-3">
                {callsByLocation.map(([loc, count]) => (
                  <div
                    key={loc}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {LOCATION_LABELS[loc] ?? loc}
                    </span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {data?.callsCapped && (
          <p className="text-xs text-gray-400 mt-4">
            Showing the most recent 20,000 call clicks.
          </p>
        )}
          </>
        )}
      </div>
    </section>
  );
}
