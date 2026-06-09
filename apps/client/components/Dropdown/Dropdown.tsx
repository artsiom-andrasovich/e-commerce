import { cn } from "@/lib/utils";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { useClickAway } from "react-use";

export const DropdownContext = createContext<{
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
} | null>(null);

type TDropdownProps = {
  closeOnOutsideClick?: boolean;
} & React.ComponentProps<"div">;

export function Dropdown({
  children,
  closeOnOutsideClick = true,
  className,
  ...props
}: PropsWithChildren<TDropdownProps>) {
  const [isOpened, setIsOpened] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    if (closeOnOutsideClick) {
      setIsOpened(false);
    }
  });

  return (
    <DropdownContext.Provider value={{ isOpened, setIsOpened }}>
      <div
        ref={ref}
        className={cn("relative w-fit h-fit", className)}
        {...props}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}
