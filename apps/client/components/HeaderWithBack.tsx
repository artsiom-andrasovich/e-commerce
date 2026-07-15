import { Container } from "@/components/Container";
import { Link } from "@/i18n";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export function HeaderWithBack() {
  const t = useTranslations("Checkout");

  return (
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
  );
}
