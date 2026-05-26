import { cn } from '@/lib/utils';
import { PropsWithChildren, useContext } from 'react';
import { Button } from '../Button';
import { DropDownMenuContext } from './DropdownMenu';

export function DropdownMenuTrigger({
  children,
  className,
  ...props
}: PropsWithChildren<React.ComponentProps<'button'>>) {
  const context = useContext(DropDownMenuContext);
  if (!context)
    throw new Error(
      'DropdownMenuTrigger must be used inside DropdownMenu component'
    );
  const { setIsOpened } = context;

  return (
    <Button
      {...props}
      className={cn(className)}
      variant="ghost"
      onClick={() => setIsOpened((prev) => !prev)}
    >
      {children}
    </Button>
  );
}
