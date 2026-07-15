import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div {...props} className={cn("mx-auto w-full max-w-[1024px]", className)}>
      {children}
    </div>
  );
}
