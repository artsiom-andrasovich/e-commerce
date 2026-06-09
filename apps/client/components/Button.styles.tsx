import { cn } from "@/lib/utils";

const variants = {
  variant: {
    default: "bg-primary text-foreground",
    outline: "border border-input bg-background",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
  },
} as const;

export type TButtonVariants = {
  variant?: keyof typeof variants.variant;
  size?: keyof typeof variants.size;
  className?: string;
};

export function getButtonVariants({
  variant = "default",
  size = "default",
  className,
}: TButtonVariants) {
  return cn(variants.variant[variant], variants.size[size], className);
}
