
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Home,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

import categories from "../../../shared/categories.json";

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

const categoryItems = categories.map((category) => ({
  ...category,
  image: categoryImages[category.slug] ?? category.image,
}));

const CategoriesPage = () => {
  return (
    <main className="min-h-screen bg-brand-ice">
      {/* Page Header */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-10">
          {/* Breadcrumb */}
          <div className="mb-5 flex flex-wrap items-center gap-2 text-[13px]">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-medium text-brand-text transition-colors hover:text-[#65C92E]"
            >
              <Home size={15} />
              Home
            </Link>

            <ChevronRight size={14} className="text-brand-text" />

            <span className="font-semibold text-brand-navy">
              Categories
            </span>
          </div>

          {/* Page Title and Back Button */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[1.8px] text-[#65C92E]">
                RK Frozen Food
              </p>

              <h1 className="text-[30px] font-bold leading-tight text-brand-navy">
                All Categories
              </h1>

              <p className="mt-2 text-[15px] text-brand-text">
                Browse all categories and find favourites for any occasion.
              </p>
            </div>

            {/* Back to Home Button */}
            <Link
              href="/"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#111111] transition-all duration-200 hover:border-[#65C92E] hover:bg-[#EFF8E9] hover:text-[#438F20]"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* All Categories */}
      <section className="px-4 py-9 sm:px-6 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-[1400px]">
          {/* Section Heading */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[24px] font-bold text-brand-navy">
                Explore Categories
              </h2>

              <p className="mt-1 text-[14px] text-brand-text">
                Find convenient favourites for meals, sharing and snacking.
              </p>
            </div>

            <span className="shrink-0 text-[13px] font-medium text-brand-text">
              {categories.length} Categories
            </span>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-5">
            {categoryItems.map((category, index) => (
              <Link
                key={category.slug}
                href={`/shop?category=${encodeURIComponent(category.slug)}`}
                className={`group flex w-full flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#65C92E] hover:shadow-lg ${
                  index >= categoryItems.length - 2
                    ? "sm:translate-x-1/2 lg:translate-x-0"
                    : ""
                }`}
              >
                {/* Category Image */}
                <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-[#F7FAF5]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Category Name */}
                <div className="flex min-h-[42px] flex-1 items-center justify-between gap-1 px-1 pt-2">
                  <h3 className="min-w-0 text-left text-[14px] font-semibold leading-snug text-[#111111] transition-colors group-hover:text-[#55B525] sm:text-[15px]">
                    {category.name}
                  </h3>

                  <ArrowRight
                    size={15}
                    className="shrink-0 text-[#65C92E] transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CategoriesPage;
