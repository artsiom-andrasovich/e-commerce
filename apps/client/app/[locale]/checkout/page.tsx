import { Container } from "@/components/Container";
import { CheckoutForm } from "@/containers/Checkout/CheckoutForm";
import { Link } from "@/i18n";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function CheckoutPage() {
  const t = await getTranslations("Checkout");

  return (
    <div className="pb-20">
      <header className="border-b p-4">
        <Container className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:underline"
          >
            <ArrowLeft size={18} />
            {t("backToHome")}
          </Link>
        </Container>
      </header>
      <Container className="mt-8">
        <CheckoutForm />
      </Container>
    </div>
  );
}
