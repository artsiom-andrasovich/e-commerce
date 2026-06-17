import { Button } from "@/components/Button";
import { DropdownContext } from "@/components/Dropdown";
import { cn } from "@/lib/utils";
import { PropsWithChildren, useContext } from "react";

export function DropdownMenuTrigger({
  children,
  className,
  variant = "ghost",
  ...props
}: PropsWithChildren<React.ComponentProps<typeof Button>>) {
  const context = useContext(DropdownContext);
  if (!context)
    throw new Error(
      "DropdownMenuTrigger must be used inside Dropdown component"
    );
  const { setIsOpened } = context;

  return (
    <Button
      {...props}
      className={cn(className)}
      variant={variant}
      onClick={() => setIsOpened((prev) => !prev)}
    >
      {children}
    </Button>
  );
}
