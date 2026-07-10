"use client";

import { navigationItems } from "@/constants/navigation-items";
import { NavLink } from "./NavLink";

export function NavigationList() {
  return (
    <nav className="grid grid-cols-4 gap-3 mx-auto">
      {navigationItems.map((item) => (
        <NavLink
          key={item.name}
          href={item.href}
          name={item.name}
          icon={item.icon}
        />
      ))}
    </nav>
  );
}
