import { DropdownContext } from "@/components/Dropdown";
import { cn } from "@/lib/utils";
import { PropsWithChildren, useContext } from "react";

export function DropdownMenuContent({
  children,
  className,
  ...props
}: PropsWithChildren<React.ComponentProps<"div">>) {
  const context = useContext(DropdownContext);
  if (!context)
    throw new Error(
      "DropdownMenuContent must be used inside Dropdown component"
    );
  const { isOpened } = context;
  return (
    <div
      className={cn(
        isOpened ? "flex flex-col" : "hidden",
        "absolute mt-2 z-50 bg-background border border-border rounded-md shadow-md p-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
