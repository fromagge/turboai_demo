"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/clients/api";
import { type RegisterFormData, registerSchema } from "@/lib/schemas/register";
import { register } from "@/services/auth";
import { useAuthStore } from "@/stores/auth-store";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register: field,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      router.push("/dashboard");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        const { fieldErrors } = error;
        if (Object.keys(fieldErrors).length > 0) {
          for (const [key, messages] of Object.entries(fieldErrors)) {
            if (key in registerSchema.shape) {
              setError(key as keyof RegisterFormData, {
                message: messages[0],
              });
            }
          }
        } else {
          setError("root", { message: error.message });
        }
      } else {
        setError("root", { message: "Something went wrong" });
      }
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex w-full max-w-96 flex-col items-center justify-center space-y-6 m-6 text-foreground">
      <div className="relative w-full">
        <Image
          src="/static/assets/images/cow.png"
          alt=""
          width={188}
          height={134}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-16px] h-[134px] w-[188px] object-contain"
        />
        <h1 className="w-full rounded-input py-3 text-center font-heading text-[48px] font-bold leading-[100%] tracking-normal text-foreground">
          Yay, New Friend!
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-96">
        {errors.root && (
          <p className="mb-4 text-center text-sm text-error">
            {errors.root.message}
          </p>
        )}
        <div className="flex w-full flex-col gap-4">
          <Input
            id="email"
            type="email"
            {...field("email")}
            placeholder="Email address"
            error={errors.email?.message}
          />
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...field("password")}
              placeholder="Password"
              className="pr-10"
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1 hover:opacity-80"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Image
                src="/static/assets/icons/privacy.svg"
                alt=""
                width={20}
                height={20}
                className="cursor-pointer"
              />
            </button>
          </div>
        </div>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="mt-11 h-11 w-full max-w-96 text-base leading-none tracking-normal"
        >
          {mutation.isPending ? "Creating account..." : "Sign up"}
        </Button>
      </form>
      <p className="text-center text-sm">
        <Link href="/login" className="text-link underline">
          We&apos;re already friends!
        </Link>
      </p>
    </div>
  );
}
