import { DashboardContent } from "@/app/dashboard/content";
import { PageContainer } from "@/components/page-container";

export const metadata = {
  title: "Dashboard — TurboAI",
};

export default function DashboardPage() {
  return (
    <PageContainer className="items-start pt-24">
      <DashboardContent />
    </PageContainer>
  );
}
