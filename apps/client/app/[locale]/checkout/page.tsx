import { Container } from "@/components/Container";
import { HeaderWithBack } from "@/components/HeaderWithBack";
import { CheckoutForm } from "@/containers/Checkout/CheckoutForm";

export default async function CheckoutPage() {
  return (
    <div className="pb-20">
      <HeaderWithBack />
      <Container className="mt-8">
        <CheckoutForm />
      </Container>
    </div>
  );
}
