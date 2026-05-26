import { PropsWithChildren } from 'react';
import { getButtonVariants, TButtonVariants } from './Button.styles';

type TButtonProps = TButtonVariants & React.ComponentProps<'button'>;

export function Button({
  children,
  variant,
  size,
  className,
  ...props
}: PropsWithChildren<TButtonProps>) {
  return (
    <button
      className={getButtonVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}
