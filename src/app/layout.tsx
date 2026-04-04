import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DC Bootcamp - Data Center Engineer Training",
  description:
    "A gamified 5-day bootcamp teaching middle schoolers about data center infrastructure, from motherboards to cloud profit!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
