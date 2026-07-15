import {
  createAddressDto,
  createUserDto,
} from "@app/lib-shared-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUpAction } from "./sign-up.actions";

const signUpFormSchema = createUserDto.extend({
  address: createAddressDto
    .or(
      z.object({
        country: z.literal(""),
        city: z.literal(""),
        street: z.literal(""),
        zipCode: z.literal(""),
      })
    )
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
    const payload = {
      email: data.email,
      password: data.password,
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      address: data.address && data.address.country
        ? {
            country: data.address.country,
            city: data.address.city,
            street: data.address.street,
            zipCode: data.address.zipCode,
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
