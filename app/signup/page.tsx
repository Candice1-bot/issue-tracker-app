"use client";
import { Button, Callout, TextField } from "@radix-ui/themes";

import axios from "axios";
import "easymde/dist/easymde.min.css";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { z } from "zod";
import { registerSchema } from "../validationSchema";

type RegisterFormData = z.infer<typeof registerSchema>;

const SignUpPage = () => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>(
    // a configuration object
    { resolver: zodResolver(registerSchema) }
  );

  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const submitRegister = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      await axios.post("/api/register", data);
      router.push("/issues/list"); // after post data, go to '/issues'
      router.refresh(); // refresh '/issues' page.
    } catch (error) {
      setSubmitting(false);
      setError("An unexpected error occured.");
    }
  });
  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form id="form" className="space-y-3" onSubmit={submitRegister}>
        <TextField.Root placeholder="email" {...register("email")} />
        <ErrorMessage>{errors.email?.message}</ErrorMessage>
        <TextField.Root placeholder="password" {...register("password")} />
        <ErrorMessage>{errors.password?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>
          {"Register"}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default SignUpPage;
