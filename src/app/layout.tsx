import { env } from "@/env";
import { cn } from "@/lib/utils";
import { OpenPanelComponent } from "@openpanel/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alternative OSS",
  description: "Open Source Software Alternative Directory",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased dark",
          inter.className
        )}
      >
        <OpenPanelComponent
          apiUrl="/api/op"
          clientId={env.OPEN_PANEL_CLIENT_ID!}
          trackScreenViews={true}
          trackAttributes={true}
          trackOutgoingLinks={true}
        />
        {children}
      </body>
    </html>
  );
}
