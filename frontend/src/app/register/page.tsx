import { RegisterForm } from "@/app/register/form";
import { PageContainer } from "@/components/page-container";

export const metadata = {
  title: "Register — TurboAI",
};

export default function RegisterPage() {
  return (
    <PageContainer>
      <RegisterForm />
    </PageContainer>
  );
}
