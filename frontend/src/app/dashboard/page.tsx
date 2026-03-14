import { DashboardContent } from "@/components/dashboard-content";

export const metadata = {
  title: "Dashboard — TurboAI",
};

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <DashboardContent />
    </main>
  );
}
