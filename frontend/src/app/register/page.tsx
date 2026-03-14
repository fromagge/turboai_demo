import { RegisterForm } from "@/app/register/Form";
import { PageContainer } from "@/components/PageContainer";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <PageContainer>
      <RegisterForm />
    </PageContainer>
  );
}
