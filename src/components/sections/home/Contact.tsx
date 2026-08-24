"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, ChevronDown, Loader2 } from "lucide-react";
import { Container } from "@/components/Container";
import { asset } from "@/lib/base-path";
import { newLeadId, pushLeadEvent } from "@/lib/analytics";
import { saveVisitorData, getOrCreateExternalId } from "@/lib/visitor-data";

interface ContactContent {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  nameSectionLabel?: string;
  contactSectionLabel?: string;
  addressSectionLabel?: string;
  hearAboutLabel?: string;
  servicesSectionLabel?: string;
  messageSectionLabel?: string;
  hearAboutOptions?: string[];
  services?: string[];
}

const DEFAULT_HEAR_ABOUT = [
  "Google",
  "Facebook",
  "Instagram",
  "Referral",
  "Yard Sign",
  "Other",
];

const DEFAULT_SERVICES = [
  "Driveways",
  "Patios",
  "Approaches",
  "Porches",
  "Basements",
  "Garage Floors",
  "Curb & Gutter",
  "Slabs",
  "Footers",
  "Sport Courts",
  "Outdoor Living",
  "Steps",
  "Pools",
  "Walkways",
];

const INPUT_CLASS =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-4 text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean/30";
const LABEL_CLASS = "mb-3 block font-medium text-navy";

// Asterisco de campo obrigatório. aria-hidden porque a obrigatoriedade já é
// anunciada aos leitores de tela pelo atributo required do campo.
const Req = () => (
  <span aria-hidden="true" className="ml-1 text-red-600">
    *
  </span>
);

type Status = "idle" | "sending" | "success" | "error";

export default function Contact({ content }: { content: Record<string, any> }) {
  const c = content as ContactContent;

  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const hearAboutOptions = c.hearAboutOptions?.length
    ? c.hearAboutOptions
    : DEFAULT_HEAR_ABOUT;
  const services = c.services?.length ? c.services : DEFAULT_SERVICES;

  const toggleService = (service: string) =>
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("hear_about", selectedOption);
    selectedServices.forEach((s) => data.append("services[]", s));
    data.set("page_url", window.location.pathname);

    // Todos os campos são obrigatórios. Os campos de texto já são barrados pelo
    // próprio navegador (required); aqui ficam os dois controles feitos à mão —
    // a lista "how did you hear about us" e os serviços — que o navegador não
    // valida sozinho.
    if (!selectedOption) {
      setStatus("error");
      setErrorMessage("Please tell us how you heard about us.");
      return;
    }
    if (selectedServices.length === 0) {
      setStatus("error");
      setErrorMessage("Please choose at least one service.");
      return;
    }

    // Vai junto no envio para o servidor poder usar o MESMO identificador ao
    // reportar o lead à API de Conversões do Meta (evita contar duas vezes).
    const leadId = newLeadId();
    data.set("lead_id", leadId);
    // Mesmo identificador de navegador que o Pixel usa, para o evento do
    // servidor e o do navegador falarem do mesmo visitante.
    data.set("external_id", getOrCreateExternalId());

    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch(asset("/api/submit.php"), {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      // Lido do envio, antes do form.reset() abaixo: depois disso os campos já
      // não existem mais na tela.
      pushLeadEvent({
        form: "contact",
        page: window.location.pathname,
        leadId,
        fields: {
          email: String(data.get("email") || ""),
          phone: String(data.get("phone") || ""),
          firstName: String(data.get("first_name") || ""),
          lastName: String(data.get("last_name") || ""),
          zip: String(data.get("zip_code") || ""),
        },
      });
      form.reset();
      setSelectedOption("");
      setSelectedServices([]);
    } catch {
      setStatus("error");
      setErrorMessage("Error sending request. Please try again later.");
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 bg-[#EAEAEA] py-16 sm:py-24">
      <Container>
        {/* Cabeçalho */}
        <div className="mb-8 text-center md:mb-12 lg:text-left">
          <h2 className="mb-3 text-2xl font-bold leading-tight text-navy md:mb-4 md:text-4xl lg:text-[36px]">
            {c.title}
          </h2>
          <p className="text-sm text-navy/70 md:text-lg">{c.subtitle}</p>
        </div>

        {status === "success" ? (
          <div className="space-y-4 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-navy">Thank You!</h3>
            <p className="text-navy/70">
              Your request has been submitted. We&apos;ll contact you soon.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="text-sm text-ocean underline"
            >
              Send another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Nome */}
            <div>
              <label className={LABEL_CLASS}>{c.nameSectionLabel || "Your Name"}<Req /></label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input type="text" name="first_name" placeholder="First Name" required
                  className={INPUT_CLASS} />
                <input type="text" name="last_name" placeholder="Last Name" required
                  className={INPUT_CLASS} />
              </div>
            </div>

            {/* Contato */}
            <div>
              <label className={LABEL_CLASS}>{c.contactSectionLabel || "Your Contact"}<Req /></label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input type="tel" name="phone" placeholder="Phone Number" required
                  className={INPUT_CLASS} />
                <input type="email" name="email" placeholder="E-mail Address" required
                  className={INPUT_CLASS} />
              </div>
            </div>

            {/* Endereço */}
            <div>
              <label className={LABEL_CLASS}>{c.addressSectionLabel || "Address"}<Req /></label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input type="text" name="street" placeholder="Street" required
                  className={INPUT_CLASS} />
                <input type="text" name="zip_code" placeholder="Zip Code" required
                  className={INPUT_CLASS} />
              </div>
            </div>

            {/* Como nos conheceu */}
            <div>
              <label className={LABEL_CLASS}>
                {c.hearAboutLabel || "How Did You Hear About Us"}<Req />
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-4 text-left focus:outline-none focus:ring-2 focus:ring-ocean/30"
                >
                  <span className={selectedOption ? "text-navy" : "text-gray-400"}>
                    {selectedOption || "Choose an option"}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg">
                    {hearAboutOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSelectedOption(option);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-navy first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Serviços */}
            <div>
              <label className={LABEL_CLASS}>
                {c.servicesSectionLabel || "Choose a Service"}<Req />
              </label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {services.map((service) => {
                  const isSelected = selectedServices.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className="group flex items-center gap-3 text-left"
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded transition-all duration-200 ${
                          isSelected
                            ? "gradient-navy"
                            : "border-2 border-gray-300 bg-white group-hover:border-ocean"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </span>
                      <span className={`text-navy ${isSelected ? "font-semibold" : ""}`}>
                        {service}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mensagem */}
            <div>
              <label className={LABEL_CLASS}>
                {c.messageSectionLabel || "Enter Your Message Here"}<Req />
              </label>
              <textarea
                name="message"
                required
                placeholder="Type Here"
                rows={6}
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            {status === "error" && errorMessage && (
              <p className="text-center text-sm font-medium text-red-600">
                {errorMessage}
              </p>
            )}

            {/* Enviar */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="gradient-navy flex items-center gap-3 rounded-[10px] px-8 py-4 font-medium text-white transition-all duration-300 hover:scale-105 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    {c.ctaText || "Send Request"}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </Container>
    </section>
  );
}
