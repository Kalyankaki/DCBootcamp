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
    <html lang="en" className="h-full antialiased theme-dark" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Prevent theme flash by reading localStorage before paint */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('dc-theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');document.documentElement.classList.remove('theme-dark');document.documentElement.classList.add('theme-light');}}catch(e){}})();`,
        }} />
      </head>
      <body className="min-h-full flex flex-col app-surface app-text">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
