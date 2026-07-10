import { Button } from "@/components/Button";
import { AppPaths } from "@/constants/app-paths";
import { useTranslations } from "next-intl";

export function AuthButtons() {
  const t = useTranslations("Auth");
  return (
    <div className="flex flex-row gap-2">
      <Button
        as="a"
        href={AppPaths.AUTH.SIGN_IN}
        className="rounded-md"
        variant="outline"
      >
        {t("sign-in")}
      </Button>
      <Button as="a" href={AppPaths.AUTH.SIGN_UP} className="rounded-md">
        {t("sign-up")}
      </Button>
    </div>
  );
}
