import Link from "next/link";
import { ShoppingCart, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/products?category=electronics", label: "Electronics" },
  { href: "/products?category=home-kitchen", label: "Home & Kitchen" },
  { href: "/products?category=books", label: "Books" },
  { href: "/products?category=fashion", label: "Fashion" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-xl font-semibold tracking-tight">
          shop<span className="text-primary">.io</span>
        </Link>

        <div className="relative hidden flex-1 max-w-xl sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-9"
          />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Account">
            <User className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
            <ShoppingCart className="size-5" />
          </Button>
        </div>
      </div>

      <nav className="border-t">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2 text-sm sm:px-6 lg:px-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
