import "@/styles/globals.css";
import { Inter } from "next/font/google";

import ClientOnly from "@/components/ClientOnly";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { type Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "superhack",
  description: "superhack",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',

  themeColor: "white",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientOnly>{children}</ClientOnly>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
