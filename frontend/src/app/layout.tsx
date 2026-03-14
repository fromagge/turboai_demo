import type { Metadata } from "next";
import { Toaster } from "sonner";

import { AuthProvider } from "@/components/AuthProvider";
import { QueryProvider } from "@/lib/clients/query-provider";
import { fontVariables } from "@/lib/utils/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Notes - Not AI Note Taker",
    template: "%s — Notes",
  },
  description: "Notes - Not AI Note Taker",
  icons: {
    icon: "/static/assets/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-full">
      <body
        className={`${fontVariables} min-h-screen antialiased bg-background text-foreground`}
      >
        <div className="mx-auto max-w-[1280px]">
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
