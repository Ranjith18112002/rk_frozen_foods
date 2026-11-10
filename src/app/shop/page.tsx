
"use client";

import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ShopFilters from "@/components/ShopFilters";
import categories from "../../../shared/categories.json";
import { products, type Product } from "@/data/products";
import {
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  Home,
  ChevronRight,
  SlidersHorizontal,
  Search,
  Snowflake,
} from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  weight: string;
};

const categoryImages: Record<string, string> = {
  "samosas-rolls":
    "https://images.pexels.com/photos/37153389/pexels-photo-37153389.jpeg?auto=compress&cs=tinysrgb&w=640",
  "kebabs-tikkis":
    "https://images.pexels.com/photos/31249644/pexels-photo-31249644.jpeg?auto=compress&cs=tinysrgb&w=640",
  "nuggets-popcorn":
    "https://images.pexels.com/photos/11710530/pexels-photo-11710530.jpeg?auto=compress&cs=tinysrgb&w=640",
  "fries-potato":
    "https://images.pexels.com/photos/5779487/pexels-photo-5779487.jpeg?auto=compress&cs=tinysrgb&w=640",
  "parathas-breads":
    "https://images.pexels.com/photos/40262799/pexels-photo-40262799.jpeg?auto=compress&cs=tinysrgb&w=640",
  "momos-dumplings":
    "https://images.pexels.com/photos/18803174/pexels-photo-18803174.jpeg?auto=compress&cs=tinysrgb&w=640",
  "patties-cutlets":
    "https://images.pexels.com/photos/36007383/pexels-photo-36007383.jpeg?auto=compress&cs=tinysrgb&w=640",
  "ready-to-cook":
    "https://images.pexels.com/photos/36388454/pexels-photo-36388454.jpeg?auto=compress&cs=tinysrgb&w=640",
};

const validCategorySlugs = new Set(
  categories.map((category) => category.slug)
);

const ShopPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Scroll reveal state
  const productsGridRef = useRef<HTMLDivElement>(null);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const element = productsGridRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCardsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const [filterOpen, setFilterOpen] = useState(
    () => searchParams.get("filter") === "open"
  );

  const updateQuery = (
    update: (params: URLSearchParams) => void,
    method: "push" | "replace" = "push"
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    update(params);

    const query = params.toString();

    router[method](
      query ? `/shop?${query}` : "/shop",
      { scroll: false }
    );
  };

  const selectedCategories = useMemo(
    () => [
      ...new Set(
        searchParams
          .getAll("category")
          .flatMap((value) => value.split(","))
          .map((value) => value.trim())
          .filter((slug) => validCategorySlugs.has(slug))
      ),
    ],
    [searchParams]
  );

  const selectedType = searchParams.get("type");

  const typeFilter =
    selectedType === "veg" || selectedType === "non-veg"
      ? selectedType
      : "all";

  const minPriceValue = Number(searchParams.get("minPrice"));
  const maxPriceValue = Number(searchParams.get("maxPrice"));

  const minPrice =
    Number.isFinite(minPriceValue) && searchParams.has("minPrice")
      ? minPriceValue
      : undefined;

  const maxPrice =
    Number.isFinite(maxPriceValue) && searchParams.has("maxPrice")
      ? maxPriceValue
      : undefined;

  const selectedWeight =
    searchParams.get("weight") ?? "All Weights";

  const selectedPrice =
    minPrice === undefined && maxPrice === undefined
      ? "All Prices"
      : minPrice === undefined && maxPrice === 99
        ? "Under ₹100"
        : minPrice === 100 && maxPrice === 250
          ? "₹100 - ₹250"
          : minPrice === 251 && maxPrice === 500
            ? "₹250 - ₹500"
            : minPrice === 501 && maxPrice === undefined
              ? "Above ₹500"
              : "Custom";

  const searchTerm =
    searchParams.get("q") ??
    searchParams.get("search") ??
    "";

  const activeCategory =
    selectedCategories.length === 1
      ? categories.find(
          (category) => category.slug === selectedCategories[0]
        )
      : undefined;

  const heading = activeCategory?.name ?? "All Products";

  // Add product to Enquiry Cart
  const handleAddToCart = (product: Product) => {
    try {
      const image = categoryImages[product.category] ?? product.image;
      const savedCart = localStorage.getItem("rk-enquiry-cart");

      const cart: CartItem[] = savedCart
        ? JSON.parse(savedCart)
        : [];

      const productId = String(product.id);

      const existingProduct = cart.find(
        (item) => item.id === productId
      );

      let updatedCart: CartItem[];

      if (existingProduct) {
        updatedCart = cart.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      } else {
        const newProduct: CartItem = {
          id: productId,
          name: product.name,
          image,
          price: product.price,
          quantity: 1,
          weight: product.weight,
        };

        updatedCart = [...cart, newProduct];
      }

      localStorage.setItem(
        "rk-enquiry-cart",
        JSON.stringify(updatedCart)
      );

      router.push("/cart");
    } catch (error) {
      console.error("Unable to add product to cart:", error);
      alert("Unable to add product. Please try again.");
    }
  };

  const handleCategoryChange = (category: string) => {
    const nextCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    updateQuery((params) => {
      params.delete("category");

      nextCategories.forEach((slug) =>
        params.append("category", slug)
      );
    });
  };

  const handlePriceChange = (price: string) => {
    updateQuery((params) => {
      params.delete("minPrice");
      params.delete("maxPrice");

      if (price === "Under ₹100") {
        params.set("maxPrice", "99");
      }

      if (price === "₹100 - ₹250") {
        params.set("minPrice", "100");
        params.set("maxPrice", "250");
      }

      if (price === "₹250 - ₹500") {
        params.set("minPrice", "251");
        params.set("maxPrice", "500");
      }

      if (price === "Above ₹500") {
        params.set("minPrice", "501");
      }
    });
  };

  const handleWeightChange = (weight: string) => {
    updateQuery((params) => {
      if (weight === "All Weights") {
        params.delete("weight");
      } else {
        params.set("weight", weight);
      }
    });
  };

  const handleTypeChange = (type: string) => {
    updateQuery((params) => {
      if (type === "all") {
        params.delete("type");
      } else {
        params.set("type", type);
      }
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      const matchesPrice =
        (minPrice === undefined || product.price >= minPrice) &&
        (maxPrice === undefined || product.price <= maxPrice);

      const matchesWeight =
        selectedWeight === "All Weights" ||
        product.weight.toLowerCase() ===
          selectedWeight.toLowerCase();

      const categoryName = categories.find(
        (category) => category.slug === product.category
      )?.name;

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (categoryName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ?? false);

      const matchesType =
        typeFilter === "all" || product.type === typeFilter;

      return (
        matchesCategory &&
        matchesPrice &&
        matchesWeight &&
        matchesSearch &&
        matchesType
      );
    });
  }, [
    selectedCategories,
    minPrice,
    maxPrice,
    selectedWeight,
    searchTerm,
    typeFilter,
  ]);

  const handleClearFilters = () => {
    setFilterOpen(false);
    router.replace("/shop", { scroll: false });
  };

  const activeFilterCount =
    selectedCategories.length +
    (minPrice !== undefined || maxPrice !== undefined ? 1 : 0) +
    (selectedWeight !== "All Weights" ? 1 : 0) +
    (typeFilter !== "all" ? 1 : 0) +
    (searchTerm ? 1 : 0);

  return (
    <main className="min-h-screen bg-brand-ice">

      {/* Page Header */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">

          {/* Breadcrumb */}
          <div className="breadcrumb mb-5 flex flex-wrap items-center gap-2 text-[13px] sm:mb-6">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[13px] font-medium text-brand-text transition hover:text-brand-navy"
            >
              <Home size={15} />
              Home
            </Link>

            <ChevronRight size={14} className="text-brand-text" />

            <span className="font-semibold text-brand-navy">
              {heading}
            </span>
          </div>

          {/* Heading and Back Button */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[2px] text-brand-navy animate-fade-up motion-reduce:animate-none">
                <Snowflake
                  size={16}
                  className="animate-snowflake motion-reduce:animate-none"
                />
                RK Frozen Food
              </p>

              <h1 className="text-3xl font-bold text-brand-navy animate-fade-up motion-reduce:animate-none [animation-delay:100ms]">
                {heading}
              </h1>

              <p className="mt-2 max-w-xl text-[15px] leading-6 text-brand-text animate-fade-up motion-reduce:animate-none [animation-delay:200ms]">
                Browse frozen favourites, from quick bites to convenient meal options.
              </p>

              <p className="mt-2 text-xs font-semibold text-brand-text sm:mt-3 animate-fade-up motion-reduce:animate-none [animation-delay:300ms]">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            <Link
              href="/"
              className="group hidden shrink-0 items-center gap-2 rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#111111] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#65C92E] hover:bg-[#EFF8E9] active:scale-95 sm:inline-flex"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        data-reveal
        className="bg-brand-ice py-8 sm:py-10 md:py-14"
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-7">

            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <ShopFilters
                  categories={categories}
                  selectedCategories={selectedCategories}
                  selectedPrice={selectedPrice}
                  selectedWeight={selectedWeight}
                  selectedType={typeFilter}
                  onCategoryChange={handleCategoryChange}
                  onPriceChange={handlePriceChange}
                  onWeightChange={handleWeightChange}
                  onTypeChange={handleTypeChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </aside>

            {/* Right Side - Products */}
            <div className="min-w-0">

              {/* Products Toolbar */}
              <div className="mb-5 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">
                      {heading}
                    </h2>

                    <p className="mt-1 text-xs text-brand-text">
                      Showing {filteredProducts.length} of {products.length} products
                    </p>
                  </div>

                  {/* Search Box */}
                  <div className="relative w-full sm:max-w-xs">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text"
                    />

                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) => {
                        const value = event.target.value;

                        updateQuery((params) => {
                          params.delete("search");

                          if (value) {
                            params.set("q", value);
                          } else {
                            params.delete("q");
                          }
                        }, "replace");
                      }}
                      placeholder="Search products..."
                      className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-[15px] text-brand-text outline-none shadow-none ring-0 focus:border-[#E5E7EB] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 active:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Filter Button */}
              <div className="mb-4 lg:hidden">
                <button
                  type="button"
                  onClick={() =>
                    setFilterOpen((previous) => !previous)
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-navy bg-white px-4 py-3 text-[15px] font-semibold text-brand-navy"
                >
                  <SlidersHorizontal size={18} />

                  {filterOpen ? "Hide Filters" : "Filter Products"}

                  {activeFilterCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-xs text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {filterOpen && (
                  <div className="mt-4">
                    <ShopFilters
                      categories={categories}
                      selectedCategories={selectedCategories}
                      selectedPrice={selectedPrice}
                      selectedWeight={selectedWeight}
                      selectedType={typeFilter}
                      onCategoryChange={handleCategoryChange}
                      onPriceChange={handlePriceChange}
                      onWeightChange={handleWeightChange}
                      onTypeChange={handleTypeChange}
                      onClearFilters={handleClearFilters}
                    />
                  </div>
                )}
              </div>

              {/* Active Filter Clear Button */}
              {activeFilterCount > 0 && (
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-[15px] font-semibold text-brand-navy hover:text-brand-navy"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div
                  ref={productsGridRef}
                  className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
                >
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`product-reveal group relative min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:bg-[#65C92E] after:transition-all after:duration-300 after:ease-out hover:-translate-y-1 hover:border-[#65C92E] hover:shadow-lg hover:shadow-[#65C92E]/10 hover:after:w-full sm:rounded-2xl ${
                        cardsVisible ? "product-reveal-visible" : ""
                      }`}
                      style={{
                        animationDelay: `${Math.min(index * 100, 700)}ms`,
                      }}
                    >

                      {/* Product Image */}
                      <Link
                        href={`/shop?q=${encodeURIComponent(product.name)}`}
                        className="relative block aspect-[5/4] overflow-hidden bg-brand-ice"
                      >
                        <Image
                          src={categoryImages[product.category] ?? product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="p-2.5 sm:p-3.5 lg:p-4">

                        {/* Category and Weight */}
                        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-brand-navy sm:text-xs">
                          {categories.find(
                            (category) =>
                              category.slug === product.category
                          )?.name}

                          {" "}

                          <span className="text-gray-400">·</span>

                          {" "}

                          {product.weight}
                        </p>

                        {/* Product Name */}
                        <Link
                          href={`/shop?q=${encodeURIComponent(product.name)}`}
                        >
                          <h3 className="line-clamp-2 min-h-[50px] font-medium text-brand-navy transition-colors hover:text-brand-orange">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Veg / Non-Veg */}
                        <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-normal text-brand-text sm:text-xs">
                          <span
                            aria-hidden="true"
                            className={`h-2 w-2 rounded-full ${
                              product.type === "veg"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          />

                          {product.type === "veg" ? "Veg" : "Non-Veg"}
                        </span>

                        {/* Description */}
                        <p className="mt-1 line-clamp-2 min-h-[42px] text-[14px] font-normal leading-[21px] text-brand-text">
                          {product.description}
                        </p>

                        {/* Price */}
                        <p className="mt-1.5 text-[16px] font-bold text-brand-navy sm:text-[18px]">
                          ₹{product.price}
                        </p>

                        {/* Add to Enquiry Button */}
                        <div className="mt-2 border-t border-[#E5E7EB] pt-2">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="group relative flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-md bg-brand-orange px-2 py-2 text-[12px] font-medium text-[#111111] transition-all duration-200 hover:bg-brand-orange-hover active:scale-[0.98] sm:rounded-lg sm:py-2.5 sm:text-[13px] motion-reduce:transition-none"
                          >
                            <span className="button-shine pointer-events-none absolute inset-0 motion-reduce:hidden" />

                            <ShoppingCart
                              size={14}
                              className="relative z-10 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transform-none"
                            />

                            <span className="relative z-10">
                              Request a Quote
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* No Products Found */
                <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-14 text-center">
                  <SlidersHorizontal className="mx-auto h-10 w-10 text-brand-navy" />

                  <h2 className="mt-4 text-2xl font-bold text-brand-navy">
                    No Products Found
                  </h2>

                  <p className="mt-2 text-[15px] text-brand-text">
                    Try changing your filters to find more products.
                  </p>

                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="mt-5 rounded-lg bg-brand-orange px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-brand-orange-hover"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bulk Orders Banner */}
          <div className="mt-10 rounded-2xl bg-brand-navy px-5 py-8 text-center shadow-lg sm:mt-14 sm:px-10 sm:py-10">
            <h2 className="text-2xl font-bold text-white">
              Looking for Bulk Orders?
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-[15px] leading-6 text-white">
              Contact us for bulk product enquiries and special requirements.
              We are happy to assist you.
            </p>

            <Link
              href="/contact"
              className="group mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-orange px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-brand-orange-hover active:scale-95 sm:px-6"
            >
              Contact Us
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Shop Page Animations */}
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes snowflakeSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes productReveal {
          from {
            opacity: 0;
            transform: translateY(35px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shineSweep {
          from {
            transform: translateX(-150%) skewX(-20deg);
          }

          to {
            transform: translateX(250%) skewX(-20deg);
          }
        }

        .animate-fade-up {
          animation: fadeUp 700ms ease-out both;
        }

        .animate-snowflake {
          animation: snowflakeSpin 12s linear infinite;
        }

        .product-reveal {
          opacity: 0;
        }

        .product-reveal-visible {
          animation: productReveal 650ms ease-out both;
        }

        .button-shine {
          background: linear-gradient(
            110deg,
            transparent 25%,
            rgba(255, 255, 255, 0.55) 50%,
            transparent 75%
          );

          transform: translateX(-150%) skewX(-20deg);
        }

        .group:hover .button-shine {
          animation: shineSweep 700ms ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up,
          .animate-snowflake,
          .product-reveal,
          .product-reveal-visible {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }

          .button-shine {
            display: none;
          }
        }
      `}</style>
    </main>
  );
};

const ShopPage = () => (
  <Suspense
    fallback={
      <main className="min-h-screen bg-brand-ice px-4 py-10 text-[15px] text-brand-text">
        Loading products...
      </main>
    }
  >
    <ShopPageContent />
  </Suspense>
);

export default ShopPage;
