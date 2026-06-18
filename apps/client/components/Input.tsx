import { ComponentPropsWithoutRef } from "react";
import { getInputVariants, TInputVariants } from "./Input.styles";

export type TInputProps = TInputVariants & ComponentPropsWithoutRef<"input">;

export const Input = ({ className, variant, size, ...props }: TInputProps) => {
  return (
    <input
      className={getInputVariants({ variant, size, className })}
      {...props}
    />
  );
};
