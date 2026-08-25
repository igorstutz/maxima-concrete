"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Upload } from "lucide-react";
import { Container } from "@/components/Container";
import { asset } from "@/lib/base-path";
import { newLeadId, pushLeadEvent } from "@/lib/analytics";

/**
 * joinourteam-sec-form — formulário de candidatura/currículo. Envia (multipart,
 * com o arquivo do currículo) para /api/submit.php com form_type=resume, que
 * encaminha para info@maximaconcrete.com com o assunto "New Resume Submitted".
 */
export default function JoinOurTeamForm({ content }: { content: Record<string, any> }) {
  const c = content as {
    title?: string;
    subtitle?: string;
    positions?: string[];
  };
  const title = c.title || "Apply to Join Our Team";
  const subtitle =
    c.subtitle ||
    "Send us your resume and tell us a bit about yourself. If there's a fit, we'll be in touch.";
  const positions = c.positions?.length
    ? c.positions
    : ["Concrete Finisher", "Laborer / Crew Member", "Crew Leader", "Office / Admin", "Other"];

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");

  const sectionRef = useRef<HTMLElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);

  // Mesmo caso do formulário de contato: o aviso de recebido é bem mais curto
  // que o formulário, então a página encolhe e a confirmação fica acima do que
  // está na tela. Ver src/components/sections/home/Contact.tsx.
  useEffect(() => {
    if (status !== "sent") return;
    const suave =
      typeof window.matchMedia === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sectionRef.current?.scrollIntoView({
      behavior: suave ? "smooth" : "auto",
      block: "start",
    });
    sentRef.current?.focus({ preventScroll: true });
  }, [status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("form_type", "resume");
    const leadId = newLeadId();
    data.set("lead_id", leadId);
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch(asset("/api/submit.php"), { method: "POST", body: data });
      const json = await res.json().catch(() => ({ ok: res.ok }));
      if (res.ok && json.ok) {
        setStatus("sent");
        pushLeadEvent({
          form: "join_our_team",
          page: window.location.pathname,
          leadId,
          fields: {
            email: String(data.get("email") || ""),
            phone: String(data.get("phone") || ""),
            firstName: String(data.get("name") || data.get("first_name") || ""),
          },
        });
        form.reset();
        setFileName("");
      } else {
        setStatus("error");
        setErrorMsg(
          json.error ||
            json.errors?.contact ||
            json.errors?.name ||
            json.errors?.resume ||
            "Something went wrong. Please try again.",
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again or email info@maximaconcrete.com.");
    }
  };

  const inputCls =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-navy focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/40";

  return (
    <section
      id="apply"
      ref={sectionRef}
      className="scroll-mt-24 bg-surface-soft py-16 sm:py-24"
    >
      <Container width="narrow">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold tracking-[-1px] text-navy md:text-3xl lg:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600 md:text-base">{subtitle}</p>
        </div>

        {status === "sent" ? (
          <div
            ref={sentRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-ocean/20 bg-white p-8 text-center shadow-sm focus:outline-none"
          >
            <p className="text-lg font-semibold text-navy">Thank you for applying!</p>
            <p className="mt-2 text-sm text-gray-600">
              We&apos;ve received your application and will reach out if there&apos;s a fit.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:grid-cols-2 md:p-8"
          >
            {/* Honeypot */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-navy">Full name *</label>
              <input name="name" required className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy">Email</label>
              <input type="email" name="email" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy">Phone</label>
              <input type="tel" name="phone" inputMode="tel" className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-navy">Position of interest</label>
              <select name="position" className={inputCls} defaultValue="">
                <option value="" disabled>
                  Select a position
                </option>
                {positions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-navy">
                Tell us about yourself
              </label>
              <textarea name="message" rows={4} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-navy">
                Resume (PDF or Word, max 8 MB)
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 transition-colors hover:border-ocean">
                <Upload className="h-4 w-4 shrink-0 text-ocean" />
                <span className="truncate">{fileName || "Choose a file…"}</span>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx,.rtf,.txt,.odt"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                />
              </label>
            </div>

            {status === "error" && (
              <p className="text-sm text-red-600 sm:col-span-2">{errorMsg}</p>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="gradient-navy inline-flex items-center gap-2 rounded-lg px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
              >
                {status === "sending" ? "Sending…" : "Submit Application"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </Container>
    </section>
  );
}
