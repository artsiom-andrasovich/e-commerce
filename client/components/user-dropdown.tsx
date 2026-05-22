'use client';
import { ShoppingBasket, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function UserDropdown() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="rounded-full border-[1px] border-white flex items-center justify-center h-12 w-12 border-foreground text-white">
            <User className="h-8 w-8" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem className="flex flex-row gap-2">
              <ShoppingBasket />
              Cart
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
