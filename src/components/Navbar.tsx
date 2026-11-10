"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Categories", href: "/categories" },
  { name: "Products", href: "/shop" },
  { name: "Contact Us", href: "/contact" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 8);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      router.push(`/shop?q=${encodeURIComponent(query)}`);
      setMenuOpen(false);
    }
  };

  const handleMenuClose = () => setMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-md shadow-black/5" : "shadow-sm"
      }`}
    >
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1500px] items-center justify-between gap-3 px-4 sm:min-h-[82px] sm:px-6 lg:gap-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={handleMenuClose}
          aria-label="RK Frozen Food home"
          className="flex min-w-0 shrink items-center gap-2 sm:gap-3"
        >
          <Image
            src="/rklogo.jpeg"
            alt="RK Frozen Food"
            width={120}
            height={120}
            priority
            className="h-12 w-12 shrink-0 object-contain sm:h-16 sm:w-16 lg:h-[72px] lg:w-[72px]"
          />

      <span className="flex min-w-0 flex-col">
  {/* Brand name */}
  <span className="hidden xl:block whitespace-nowrap text-[15px] font-bold tracking-tight text-[#111111] xl:text-xl">
    RK FROZEN FOOD
  </span>

  {/* Tagline */}
  <span className="hidden xl:block mt-1 text-xs font-medium tracking-[0.12em] text-[#555555]">
    STAY FRESH. STAY HEALTHY.
  </span>
</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden shrink-0 items-center gap-4 lg:flex xl:gap-6"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`whitespace-nowrap text-[15px] font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-[#65C92E]"
                    : "text-[#111111] hover:text-[#65C92E]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="hidden h-11 min-w-[180px] max-w-[360px] flex-1 items-center rounded-full border border-[#E5E7EB] bg-[#F7FAF5] px-3 transition-colors duration-200 focus-within:border-[#E5E7EB] focus-within:ring-0 lg:flex"
        >
          <Search size={18} className="shrink-0 text-[#555555]" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent px-2 text-[15px] text-[#111111] !outline-none !ring-0 focus:!outline-none focus:!ring-0 focus-visible:!outline-none placeholder:text-[#777777]"
          />

          <button
            type="submit"
            aria-label="Search"
            className="rounded-full p-1.5 text-[#111111] transition-colors hover:bg-[#EFF8E9]"
          >
            <ChevronRight size={18} />
          </button>
        </form>

        {/* Cart and Mobile Menu */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Premium Desktop Cart Button */}
          <Link
            href="/cart"
            aria-label="Enquiry cart"
            onClick={handleMenuClose}
            className="group hidden h-11 items-center justify-center gap-2.5 rounded-lg border border-[#65C92E] bg-white px-4 text-[14px] font-semibold text-[#111111] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#65C92E] hover:shadow-md sm:flex"
          >
            <ShoppingCart
              size={19}
              strokeWidth={2}
              className="text-[#65C92E] transition-colors duration-200 group-hover:text-[#111111]"
            />
            <span>Cart</span>
          </Link>

          {/* Mobile Cart Icon */}
          <Link
            href="/cart"
            aria-label="Enquiry cart"
            onClick={handleMenuClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#65C92E] bg-white text-[#111111] transition-all duration-200 hover:bg-[#65C92E] sm:hidden"
          >
            <ShoppingCart size={19} strokeWidth={2} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#111111] transition hover:border-[#65C92E] hover:text-[#65C92E] lg:hidden sm:h-11 sm:w-11"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="absolute left-0 top-full z-50 w-full border-t border-[#E5E7EB] bg-white px-4 py-4 shadow-xl lg:hidden sm:px-6"
        >
          <nav
            className="mx-auto flex max-w-[700px] flex-col"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={handleMenuClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center justify-between border-b border-[#E5E7EB] py-3.5 text-[15px] font-medium transition-colors ${
                    isActive
                      ? "text-[#65C92E]"
                      : "text-[#111111] hover:text-[#65C92E]"
                  }`}
                >
                  {link.name}
                  <ChevronRight size={17} className="text-[#65C92E]" />
                </Link>
              );
            })}
          </nav>

          {/* Mobile Search */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="mx-auto mt-4 flex h-11 max-w-[700px] items-center rounded-full border border-[#E5E7EB] bg-[#F7FAF5] px-3 focus-within:border-[#E5E7EB] focus-within:ring-0"
          >
            <Search size={18} className="shrink-0 text-[#555555]" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent px-2 text-[15px] text-[#111111] !outline-none !ring-0 focus:!outline-none focus:!ring-0 focus-visible:!outline-none placeholder:text-[#777777]"
            />

            <button
              type="submit"
              className="rounded-full bg-[#65C92E] px-4 py-1.5 text-xs font-semibold text-[#111111] transition hover:bg-[#55B525]"
            >
              Search
            </button>
          </form>

          {/* Mobile Cart */}
          <Link
            href="/cart"
            onClick={handleMenuClose}
            className="mx-auto mt-3 flex h-11 max-w-[700px] items-center justify-center gap-2 rounded-lg border border-[#65C92E] bg-white text-[15px] font-semibold text-[#111111] transition hover:bg-[#65C92E]"
          >
            <ShoppingCart size={18} />
           Cart
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;