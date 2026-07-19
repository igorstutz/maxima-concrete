import Link from "next/link";
import { MapPin, Clock, Mail, Phone } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { GoogleIcon } from "@/components/nav-icons";
import footer from "@/content/settings/footer.json";

/**
 * Site footer — fiel ao original, mas full-bleed no <footer> externo e
 * conteúdo alinhado pelo <Container> padrão (regra nº 1 do rebuild:
 * nenhum cálculo próprio dos 350px do menu lateral).
 */
export default function Footer() {
  const {
    logoImage,
    tagline,
    address,
    hours,
    email,
    phone,
    learnMoreLinks,
    contactCta,
    socialLinks,
    monthlyPaymentImage,
    googleReviewsImage,
    bbbRatingImage,
    licensedInsuredImage,
    angiesListImage,
    copyright,
    designerText,
    designerName,
    designerUrl,
  } = footer;

  return (
    <footer className="relative bg-navy min-h-[400px] lg:min-h-[350px]">
      <div className="border-t border-white/20 lg:border-t-0" />
      <Container className="py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr] gap-8 lg:gap-8">
          {/* Column 1 - Logo + Company Info */}
          <div className="flex flex-col gap-5 items-start lg:pr-6">
            <Image
              src={logoImage}
              alt="Maxima Concrete"
              width={289}
              height={79}
              className="h-auto w-auto max-h-[80px] md:max-h-[100px] lg:max-h-[110px] object-contain"
            />
            {tagline && (
              <p className="text-white/80 text-sm leading-relaxed max-w-[320px]">
                {tagline}
              </p>
            )}
            <div className="flex flex-col gap-3 mt-1">
              {address && (
                <div className="flex items-start gap-2.5 text-white/90 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/70" />
                  <span className="leading-relaxed whitespace-pre-line">{address}</span>
                </div>
              )}
              {hours && (
                <div className="flex items-start gap-2.5 text-white/90 text-sm">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/70" />
                  <span className="leading-relaxed whitespace-pre-line">{hours}</span>
                </div>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 text-white/90 text-sm hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0 text-white/70" />
                  <span>{email}</span>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-2.5 text-white/90 text-sm hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0 text-white/70" />
                  <span>{phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Column 2 - Learn More */}
          <div className="flex flex-col gap-4 items-start">
            <h3 className="text-white text-lg font-semibold mb-2">Learn More</h3>
            <nav className="flex flex-col gap-3 items-start">
              {learnMoreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/90 text-base hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              href={contactCta.href}
              className="mt-4 bg-white text-navy font-medium px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-white/90 transition-colors"
            >
              {contactCta.label}
              <Image
                src="/images/assets/footer/arrow-icon.svg"
                alt=""
                width={8}
                height={8}
                className="w-3 h-3"
              />
            </Link>
          </div>

          {/* Column 3 - Social */}
          <div className="flex flex-col gap-4 items-start">
            <h3 className="text-white text-lg font-semibold mb-2">Social</h3>
            {/* Social Icons Row */}
            <div className="flex items-center gap-4">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <Image
                  src="/images/assets/footer/facebook-icon.svg"
                  alt="Facebook"
                  width={10}
                  height={18}
                  className="w-5 h-5"
                />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <Image
                  src="/images/assets/footer/instagram-icon.svg"
                  alt="Instagram"
                  width={18}
                  height={18}
                  className="w-5 h-5"
                />
              </a>
              <a
                href={socialLinks.google}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Google"
              >
                <GoogleIcon className="w-5 h-5 text-white" />
              </a>
            </div>
            {/* Join Our Team button hidden until page is ready */}
          </div>

          {/* Column 4 - Badges & Payment */}
          <div className="flex flex-col gap-6 items-start">
            {/* Monthly Payment Options Banner */}
            <Image
              src={monthlyPaymentImage}
              alt="Hearth Monthly Payment Options"
              width={310}
              height={120}
              className="w-auto h-auto max-w-[240px] md:max-w-[280px] rounded-lg"
            />

            {/* Trust Badges Row */}
            <div className="flex flex-wrap items-center justify-start gap-3 md:gap-4">
              <Image
                src={googleReviewsImage}
                alt="Google Reviews"
                width={117}
                height={88}
                className="w-auto object-contain h-8 md:h-10"
              />
              <Image
                src={bbbRatingImage}
                alt="BBB A+ Rating"
                width={50}
                height={34}
                className="w-auto object-contain h-7 md:h-8"
              />
              <Image
                src={licensedInsuredImage}
                alt="Licensed & Insured"
                width={69}
                height={35}
                className="w-auto object-contain h-7 md:h-8"
              />
              <Image
                src={angiesListImage}
                alt="Angie's List"
                width={138}
                height={23}
                className="w-auto object-contain h-3 md:h-4"
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Copyright Bar */}
      <Container className="py-4 md:py-6">
        <div className="bg-white py-3 md:py-4 px-4 md:px-8 rounded-lg relative z-50">
          <p className="text-center text-navy text-xs md:text-sm">
            {copyright} | {designerText}{" "}
            <a
              href={designerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {designerName}
            </a>
          </p>
        </div>
      </Container>

      {/* Bottom Spacing */}
      <div className="py-4 md:py-6" />
    </footer>
  );
}
