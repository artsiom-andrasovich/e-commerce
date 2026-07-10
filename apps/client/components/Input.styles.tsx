import { cn } from "@/lib/utils";

const variants = {
  variant: {
    default:
      "block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 shadow-sm bg-white",
  },
  size: {
    default: "px-3",
    sm: "px-2 py-1",
    lg: "px-4 py-3",
  },
} as const;

export type TInputVariants = {
  variant?: keyof typeof variants.variant;
  size?: keyof typeof variants.size;
  className?: string;
};

export function getInputVariants({
  variant = "default",
  size = "default",
  className,
}: TInputVariants) {
  return cn(variants.variant[variant], variants.size[size], className);
}
