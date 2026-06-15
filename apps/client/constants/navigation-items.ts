import { Home } from "lucide-react";
import { AppPaths } from "./app-paths";

export const navigationItems = [
  {
    name: "Home",
    href: AppPaths.HOME,
    icon: Home,
  },
] as const;
