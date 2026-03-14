import { Content } from "@/app/dashboard/Content";
import { PageContainer } from "@/components/PageContainer";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <PageContainer className="items-start pt-24">
      <Content />
    </PageContainer>
  );
}
