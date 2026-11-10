"use client";

import Image from "next/image";
import Link from "next/link";
import categories from "../../shared/categories.json";
import { ArrowRight } from "lucide-react";

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
};

// 7th & 8th category ku image URL inga paste pannunga (index based)
// Empty ah irundha green placeholder kaattum

const fallbackImages: string[] = [
  "", // 1 - Existing image
  "", // 2 - Existing image
  "", // 3 - Existing image
  "", // 4 - Existing image
  "", // 5 - Existing image
  "", // 6 - Existing image

  // 7th category - Cutlets / Cheese Snacks
  "https://images.pexels.com/photos/6941010/pexels-photo-6941010.jpeg?auto=compress&cs=tinysrgb&w=640",

  // 8th category - Chicken Snacks
  "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=640",
];



const categoryItems = categories.slice(0, 8).map((category, index) => ({
  ...category,
  image:
    categoryImages[category.slug] ||
    fallbackImages[index] ||
    (category as { image?: string }).image ||
    "",
}));


// Cards kammi na (8 kum kammi) repeat panni, gap varaama paarthukkum
const loopItems =
  categoryItems.length < 8
    ? [...categoryItems, ...categoryItems]
    : categoryItems;

const CategoryCards = () => (
  <>
    {loopItems.map((category, index) => (
      <Link
        key={`${category.slug}-${index}`}
        href={`/shop?category=${encodeURIComponent(category.slug)}`}
        className="group flex w-[145px] shrink-0 flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#65C92E] hover:shadow-lg sm:w-[165px] md:w-[180px] lg:w-[190px]"
      >
        {/* Category Image */}
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-[#F7FAF5]">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 145px, (max-width: 1024px) 180px, 190px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#EFF8E9] to-[#D6F0C2] text-4xl font-bold text-[#65C92E] transition-transform duration-500 group-hover:scale-110">
              {category.name.charAt(0)}
            </div>
          )}
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
  </>
);

const CategorySection = () => {
  return (
    <section
      data-reveal
      className="overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Section Heading */}
        <div className="mb-7 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-[#65C92E]">
              Explore Our Collection
            </p>

            <h2 className="text-[26px] font-bold text-[#111111] sm:text-[30px]">
              Shop by Category
            </h2>

            <p className="mt-2 text-[14px] text-[#555555] sm:text-[15px]">
              Browse convenient favourites for meals, sharing and snacking.
            </p>
          </div>

          <Link
            href="/categories"
            className="group/view hidden shrink-0 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#111111] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#65C92E] hover:bg-[#EFF8E9] hover:shadow-md active:scale-95 sm:inline-flex"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Looping marquee: right -> left
            - Left & right rendu side layum fade (32px)
            - pl-8 = first card fade aagaama full ah theriyum
            - 1.5s kazhichu loop start, right side la irundhu next cards varum */}
        <div className="group/marquee flex overflow-hidden py-3 pl-8 [mask-image:linear-gradient(to_right,transparent_0,black_32px,black_calc(100%_-_32px),transparent_100%)]">
          {/* 2 identical groups = seamless infinite loop */}
          {[0, 1].map((i) => (
            <div
              key={i}
              aria-hidden={i === 1}
              className="flex shrink-0 animate-marquee items-stretch gap-[30px] pr-[30px] [animation-delay:1.5s] motion-reduce:animate-none group-hover/marquee:[animation-play-state:paused]"
            >
              <CategoryCards />
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-5 flex justify-center sm:hidden">
          <Link
            href="/categories"
            className="flex items-center gap-2 rounded-lg bg-[#65C92E] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#55B525] active:scale-95"
          >
            View All Categories
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;