"use client";

import { Link, usePathname } from "@/i18n";
import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface NavLinkProps {
  href: string;
  name: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  className?: string;
}

export const NavLink = ({ href, name, icon, className }: NavLinkProps) => {
  const pathname = usePathname();
  const Icon = icon;
  const isActive = pathname === href;

  return (
    <Link key={name} href={href} className="">
      <Icon
        className={cn(
          "border-2  rounded-full p-[2px] w-8 h-8",
          isActive
            ? "border-primary text-primary"
            : "border-foreground text-foreground",
          className,
        )}
      />
    </Link>
  );
};
