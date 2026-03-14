import { Suspense } from "react";

import { LoginForm } from "@/app/login/Form";
import { PageContainer } from "@/components/PageContainer";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <PageContainer>
      <Suspense>
        <LoginForm />
      </Suspense>
    </PageContainer>
  );
}
