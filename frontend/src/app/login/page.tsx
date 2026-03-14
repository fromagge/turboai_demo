import { Suspense } from "react";

import { LoginForm } from "@/app/login/form";
import { PageContainer } from "@/components/page-container";

export const metadata = {
  title: "Login — TurboAI",
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
