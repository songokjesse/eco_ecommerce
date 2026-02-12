import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Heart, ShoppingCart, Leaf, Package } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartButton } from '@/components/cart/CartButton';
import { SearchBar } from '@/components/layout/SearchBar';

import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="w-full bg-white border-b border-border sticky top-0 z-50">
      {/* Top Bar with Logo and Search */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-12 w-48">
            <Image
              src="/logo.png"
              alt="CircuCity Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Search Bar */}
        <SearchBar />

        {/* Icons */}
        <div className="flex items-center gap-4 text-foreground">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className="hover:text-primary gap-2">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </SignInButton>
          </SignedOut>
          {/* Admin Dashboard - Only for admins */}
          {isAdmin && (
            <Link href="/dashboard/admin">
              <Button variant="ghost" size="sm" className="hover:text-blue-600 gap-2 text-blue-600 font-medium">
                <Package className="h-5 w-5" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          )}
          <SignedIn>
            <NotificationBell />
            {/* My Orders Link */}
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="hover:text-primary gap-2">
                <Package className="h-5 w-5" />
                <span className="hidden sm:inline">My Orders</span>
              </Button>
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9"
                }
              }}
            >
              <UserButton.MenuItems>
                {isAdmin && (
                  <UserButton.Link
                    label="Admin Dashboard"
                    labelIcon={<Package className="h-4 w-4" />}
                    href="/dashboard/admin"
                  />
                )}
                <UserButton.Link
                  label="Dashboard"
                  labelIcon={<Package className="h-4 w-4" />}
                  href="/dashboard"
                />
                <UserButton.Link
                  label="My Orders"
                  labelIcon={<ShoppingCart className="h-4 w-4" />}
                  href="/dashboard/orders"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>

          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Heart className="h-6 w-6" />
            <span className="sr-only">Wishlist</span>
          </Button>
          <CartButton />
        </div>
      </div>

    </header>
  );
}
