import { zodPasswordSchema } from "@app/lib-shared-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUpAction } from "./sign-up.actions";

const signUpFormSchema = z.object({
  email: z.email(),
  password: zodPasswordSchema,
  firstName: z.string().min(1).max(30).optional(),
  lastName: z.string().min(1).max(40).optional(),
  address: z
    .object({
      country: z.string().optional(),
      city: z.string().optional(),
      street: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
});

export type SignUpInput = z.infer<typeof signUpFormSchema>;

export function useSignUpForm() {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: {
        country: "",
        city: "",
        zipCode: "",
        street: "",
      },
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    const hasAddress =
      data.address?.country ||
      data.address?.city ||
      data.address?.zipCode ||
      data.address?.street;

    const payload = {
      email: data.email,
      password: data.password,
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      address: hasAddress
        ? {
            country: data.address!.country || "",
            city: data.address!.city || "",
            street: data.address!.street || "",
            zipCode: data.address!.zipCode || "",
            isDefault: true,
          }
        : undefined,
    };

    const res = await signUpAction(payload);
    if (res?.error) {
      form.setError("root", { message: res.error });
    }
  };

  return {
    ...form,
    onSubmit,
  };
}
