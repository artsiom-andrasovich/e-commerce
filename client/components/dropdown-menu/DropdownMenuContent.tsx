import { cn } from '@/lib/utils';
import { PropsWithChildren, useContext } from 'react';
import { DropDownMenuContext } from './DropdownMenu';

export function DropdownMenuContent({
  children,
  className,
  ...props
}: PropsWithChildren<React.ComponentProps<'div'>>) {
  const context = useContext(DropDownMenuContext);
  if (!context)
    throw new Error(
      'DropdownMenuItem must be used inside DropdownMenu component'
    );
  const { isOpened } = context;
  return (
    <div
      className={cn(
        isOpened ? 'flex flex-col' : 'hidden',
        'absolute mt-2 z-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
