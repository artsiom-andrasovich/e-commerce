import { ComponentProps } from "react";
import { getInputVariants, TInputVariants } from "./Input.styles";

export type TInputProps = TInputVariants & ComponentProps<"input">;

export const Input = ({
  className,
  variant,
  size,
  ref,
  ...props
}: TInputProps) => {
  return (
    <input
      ref={ref}
      className={getInputVariants({ variant, size, className })}
      {...props}
    />
  );
};
