import { checkoutAction } from "./checkout.actions";
import { useCart } from "@/hooks/useCart";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderDto, TCreateOrder } from "@app/lib-shared-types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { fetchProfile } from "@/containers/Profile/profile.actions";

export type CheckoutInput = TCreateOrder;

export const useCheckoutForm = () => {
  const router = useRouter();
  const { loadCart } = useCart();
  const form = useForm<CheckoutInput>({
    resolver: zodResolver(createOrderDto),
    defaultValues: {
      deliveryMethod: "COURIER",
      paymentMethod: "STRIPE",
      billingInfo: {
        firstName: "",
        lastName: "",
        country: "",
        city: "",
        zipCode: "",
        street: "",
      },
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await fetchProfile();
      if (profile) {
        form.reset({
          ...form.getValues(),
          billingInfo: {
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            country: profile.address?.country || "",
            city: profile.address?.city || "",
            zipCode: profile.address?.zipCode || "",
            street: profile.address?.street || "",
          },
        });
      }
    };
    loadProfile();
  }, [form]);

  const onSubmit = async (data: CheckoutInput) => {
    try {
      const res = await checkoutAction(data);
      await loadCart();
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        router.push(`/checkout/success?orderId=${res.order._id}`);
      }
    } catch (error: any) {
      console.error(error);
      form.setError("root", {
        type: "manual",
        message: error.message || "Failed to process checkout",
      });
    }
  };

  return {
    ...form,
    onSubmit,
  };
};
