import type { Metadata } from "next";
import "./globals.css";
import { AppHeader } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { BadgeNotification } from "@/components/gamification/badge-notification";
import { GamificationProvider } from "@/context/GamificationContext";
import { SessionProvider } from "@/context/SessionContext";
import { ExplainabilityProvider } from "@/context/ExplainabilityContext";
import { TooltipLayerProvider } from "@/context/TooltipLayerContext";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "KAITE Demo",
  description: "A functional demo of the KAITE AI Ethics Tutor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <TooltipProvider delayDuration={300}>
          <TooltipLayerProvider>
            <SessionProvider>
              <ExplainabilityProvider>
                <GamificationProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                  >
                    <AppHeader />
                    <main>{children}</main>
                    <BadgeNotification />
                    <Toaster />
                  </ThemeProvider>
                </GamificationProvider>
              </ExplainabilityProvider>
            </SessionProvider>
          </TooltipLayerProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
