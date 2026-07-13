import { Container } from "@/components/Container";
import { APP_NAME } from "@/constants";
import { AppPaths } from "@/constants/app-paths";
import { Link } from "@/i18n";
import { CirclePercent } from "lucide-react";
import { AuthButtons } from "./AuthButtons";
import { UserDropdown } from "./UserDropdown";
import { hasAuthToken } from "@/lib/server-auth";
import { cookies } from "next/headers";
import { TCurrencyCode } from "@app/lib-shared-types";

export async function Header() {
  const hasToken = await hasAuthToken();
  const cookieStore = await cookies();
  const initialCurrency = (cookieStore.get("currency")?.value || "USD") as TCurrencyCode;
  return (
    <header className="bg-background shadow-md">
      <Container className="py-4 px-2 flex-row flex justify-between">
        <Link
          href={AppPaths.HOME}
          className="flex items-center gap-2 text-2xl text-foreground "
        >
          <CirclePercent />
          <h1>{APP_NAME}</h1>
        </Link>
        {hasToken ? <UserDropdown initialCurrency={initialCurrency} /> : <AuthButtons />}
      </Container>
    </header>
  );
}
