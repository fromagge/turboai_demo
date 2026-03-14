import { Suspense } from "react";

import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "Login — TurboAI",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
