import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blakify — SaaS de Checkout",
  description: "Plataforma de checkout com múltiplos gateways, pixels e dashboard de vendas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
