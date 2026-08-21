import type { Metadata } from "next";

// Ferramenta interna: fora de busca e de rastreadores.
export const metadata: Metadata = {
  title: "Admin — Maxima Concrete",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
