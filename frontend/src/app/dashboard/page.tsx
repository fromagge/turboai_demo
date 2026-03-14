import { DashboardContent } from "@/app/dashboard/dashboard-content";
import { PageContainer } from "@/components/page-container";

export const metadata = {
  title: "Dashboard — TurboAI",
};

export default function DashboardPage() {
  return (
    <PageContainer>
      <DashboardContent />
    </PageContainer>
  );
}
