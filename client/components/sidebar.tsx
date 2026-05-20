import { Settings } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="p-2 bg-foreground">
      <nav className="flex flex-col space-y-2 ">
        {/*example buttons */}
        <Link href={'#'} className="text-white ">
          <Settings className="border-2 border-white rounded-full p-[2px] w-8 h-8" />
        </Link>
        <Link href={'#'} className="text-white ">
          <Settings className="border-2 border-white rounded-full p-[2px] w-8 h-8" />
        </Link>
      </nav>
    </aside>
  );
}
