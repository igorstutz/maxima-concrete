import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import tracking from "@/content/settings/tracking.json";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const GTM_ID = tracking.gtmId;

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maximaconcrete.com"),
  title: {
    default: "Maxima Concrete — Premium Patios & Driveways in Ohio",
    template: "%s",
  },
  description:
    "Transform your property with expertly crafted driveways, pools, patios, and outdoor living spaces. Premium concrete, pavers, and stone work in Ohio.",
  authors: [{ name: "Maxima Concrete" }],
  creator: "Maxima Concrete",
  publisher: "Maxima Concrete",
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    title: "Maxima Concrete — Premium Patios & Driveways in Ohio",
    description:
      "Transform your property with expertly crafted driveways, pools, patios, and outdoor living spaces. Premium concrete, pavers, and stone work in Ohio.",
    type: "website",
    locale: "en_US",
    siteName: "Maxima Concrete",
    url: "https://maximaconcrete.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maxima Concrete — Premium Patios & Driveways in Ohio",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
  other: { "theme-color": "#041c2d" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.className}>
      <head>
        {GTM_ID ? (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        ) : null}
      </head>
      <body className="bg-white text-navy antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://maximaconcrete.com/#organization",
                  name: "Maxima Concrete",
                  url: "https://maximaconcrete.com",
                  telephone: "+1-614-384-5917",
                  email: "info@maximaconcrete.com",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "4059 State Route 37 E, Suite A",
                    addressLocality: "Delaware",
                    addressRegion: "OH",
                    postalCode: "43015",
                    addressCountry: "US",
                  },
                  sameAs: [
                    "https://www.facebook.com/maximaconcrete/",
                    "https://www.instagram.com/maximaconcrete/",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://maximaconcrete.com/#website",
                  name: "Maxima Concrete",
                  url: "https://maximaconcrete.com",
                  publisher: { "@id": "https://maximaconcrete.com/#organization" },
                },
              ],
            }),
          }}
        />
        {GTM_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <Navigation />
        {children}
        <Footer />
        {tracking.extraBodyCode ? (
          <div
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: tracking.extraBodyCode }}
          />
        ) : null}
      </body>
    </html>
  );
}
