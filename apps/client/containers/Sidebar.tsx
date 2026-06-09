'use client';

import { navigationItems } from '@/constants/navigation-items';
import { Link, usePathname } from '@/i18n';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="p-2 bg-background border-r border-t rounded-r-md">
      <nav className="flex flex-col space-y-2 ">
        {/*example buttons */}
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="">
              <Icon
                className={cn(
                  'border-2  rounded-full p-[2px] w-8 h-8',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-foreground text-foreground'
                )}
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
