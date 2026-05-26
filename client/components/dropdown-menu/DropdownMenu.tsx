import { cn } from '@/lib/utils';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { useClickAway } from 'react-use';

export const DropDownMenuContext = createContext<{
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export function DropdownMenu({
  children,
  className,
  ...props
}: PropsWithChildren<React.ComponentProps<'div'>>) {
  const [isOpened, setIsOpened] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    setIsOpened(false);
  });

  return (
    <DropDownMenuContext.Provider value={{ isOpened, setIsOpened }}>
      <div
        ref={ref}
        className={cn('relative w-fit h-fit', className)}
        {...props}
      >
        {children}
      </div>
    </DropDownMenuContext.Provider>
  );
}
