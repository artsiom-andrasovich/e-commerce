"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Link } from "@/i18n";
import { useTranslations } from "next-intl";
import { ADDRESS_FIELDS, FieldConfig, USER_FIELDS } from "./form-fields";
import { useSignUpForm } from "./useSignUpForm";

export function SignUpForm() {
  const { register, handleSubmit, getFieldState, formState, onSubmit } =
    useSignUpForm();
  const t = useTranslations("Forms");

  const renderField = (field: FieldConfig) => {
    const { error } = getFieldState(field.name, formState);
    return (
      <div
        key={field.name}
        className={`flex flex-col ${field.colSpan === 2 ? "col-span-2" : "col-span-1"}`}
      >
        <label className="block text-sm font-medium mb-1">
          {t(field.labelKey as string)}
        </label>
        <Input
          type={field.type}
          placeholder={t(field.placeholderKey as string)}
          {...register(field.name)}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
      </div>
    );
  };

  return (
    <div className="w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">{t("signUp")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {USER_FIELDS.map(renderField)}
        </div>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-xl font-semibold mb-4 text-slate-800">
          {t("addressOptional")}
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {ADDRESS_FIELDS.map(renderField)}
        </div>

        {formState.errors.root && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {formState.errors.root.message}
          </div>
        )}

        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full mt-6"
        >
          {formState.isSubmitting ? t("signingUp") : t("signUp")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href="/auth/sign-in"
          className="font-medium text-emerald-600 hover:text-emerald-500 hover:underline"
        >
          {t("alreadyHaveAccountLink")}
        </Link>
      </p>
    </div>
  );
}
