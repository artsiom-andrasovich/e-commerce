import { signInDto } from "@app/lib-shared-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInAction } from "./sign-in.actions";

export type SignInInput = z.input<typeof signInDto>;

export function useSignInForm() {
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInDto),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInInput) => {
    const res = await signInAction(data);
    if (res?.error) {
      form.setError("root", { message: res.error });
    }
  };

  return {
    ...form,
    onSubmit,
  };
}
