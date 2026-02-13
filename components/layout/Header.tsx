import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Heart, ShoppingBag, Package } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartButton } from '@/components/cart/CartButton';
import { SearchBar } from '@/components/layout/SearchBar';

import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Header({ isAdmin = false, hideNavigation = false }: { isAdmin?: boolean; hideNavigation?: boolean }) {
  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="relative h-10 w-40">
            <Image
              src="/logo.png"
              alt="CircuCity Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Search Bar - Center */}
        <div className="flex-1 max-w-2xl px-4 hidden md:block">
          <SearchBar />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className="hidden sm:flex hover:text-primary gap-2">
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            {/* Admin Link */}
            {isAdmin && (
              <Link href="/dashboard/admin">
                <Button variant="ghost" size="sm" className="hidden lg:flex text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2 font-medium">
                  <Package className="h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}

            <NotificationBell />

            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="hidden sm:flex hover:text-primary gap-2">
                <Package className="h-5 w-5" />
                <span className="hidden lg:inline">My Orders</span>
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="hover:text-primary relative hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>

            <CartButton />

            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-gray-100"
                }
              }}
            >
              <UserButton.MenuItems>
                {isAdmin && (
                  <UserButton.Link
                    label="Admin Console"
                    labelIcon={<Package className="h-4 w-4" />}
                    href="/dashboard/admin"
                  />
                )}
                <UserButton.Link
                  label="My Orders"
                  labelIcon={<ShoppingBag className="h-4 w-4" />}
                  href="/dashboard/orders"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </div>

      {/* Navigation Menu - Hidden if hideNavigation is true */}
      {!hideNavigation && (
        <div className="border-t border-gray-100 hidden md:block">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-8 h-12 text-sm font-medium text-gray-600">
              <Link href="/" className="text-primary font-semibold hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/products?category=food" className="hover:text-primary transition-colors">
                Organic Food
              </Link>
              <Link href="/products?category=fashion" className="hover:text-primary transition-colors">
                Sustainable Fashion
              </Link>
              <Link href="/products?category=home" className="hover:text-primary transition-colors">
                Eco Home
              </Link>
              <Link href="/products?category=beauty" className="hover:text-primary transition-colors">
                Clean Beauty
              </Link>
              <Link href="/products?category=tech" className="hover:text-primary transition-colors">
                Green Tech
              </Link>
              <div className="flex-1" />
              <Link href="/sell" className="text-green-600 hover:text-green-700 font-medium transition-colors">
                Become a Seller
              </Link>
              <Link href="/impact" className="hover:text-primary transition-colors">
                Track Impact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
