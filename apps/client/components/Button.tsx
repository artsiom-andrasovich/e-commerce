import { ComponentProps, ElementType } from "react";
import { getButtonVariants, TButtonVariants } from "./Button.styles";

export type TButtonProps<T extends ElementType> = TButtonVariants & {
  as?: T;
} & ComponentProps<T>;

export function Button<T extends ElementType = "button">({
  as,
  children,
  variant,
  size,
  className,
  ...props
}: TButtonProps<T>) {
  const Component = as || "button";
  return (
    <Component
      className={getButtonVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </Component>
  );
}
