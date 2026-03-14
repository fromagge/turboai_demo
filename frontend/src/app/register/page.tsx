import { RegisterForm } from "@/components/register-form";

export const metadata = {
  title: "Register — TurboAI",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <RegisterForm />
    </main>
  );
}
