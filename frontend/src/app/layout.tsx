import type { Metadata } from "next";
import { Toaster } from "sonner";

import { AuthProvider } from "@/components/auth-provider";
import { QueryProvider } from "@/lib/clients/query-provider";
import { fontVariables } from "@/lib/utils/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "TurboAI Notetaking Demo",
  description: "TurboAI Notetaking Demo",
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
