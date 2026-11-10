
"use client";

import { useEffect, useRef, useState } from "react";

type ShopFiltersProps = {
  categories: { name: string; slug: string }[];
  selectedCategories: string[];
  selectedPrice: string;
  selectedWeight: string;
  selectedType: string;
  onCategoryChange: (category: string) => void;
  onPriceChange: (price: string) => void;
  onWeightChange: (weight: string) => void;
  onTypeChange: (type: string) => void;
  onClearFilters: () => void;
};

const ShopFilters = ({
  categories,
  selectedCategories,
  selectedPrice,
  selectedWeight,
  selectedType,
  onCategoryChange,
  onPriceChange,
  onWeightChange,
  onTypeChange,
  onClearFilters,
}: ShopFiltersProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = filterRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const sectionTitle =
    "mb-4 text-[15px] font-bold text-brand-navy";

  const labelStyle =
    "filter-option flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-all duration-200";

  const radioStyle =
    "h-4 w-4 shrink-0 cursor-pointer accent-brand-orange transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65C92E]";

  return (
    <div
      ref={filterRef}
      className={`filter-panel rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-all duration-500 sm:p-6 ${
        isVisible ? "filter-panel-visible" : ""
      }`}
    >
      {/* Filter Heading */}
      <div className="filter-heading mb-6 flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">
            Filters
          </h2>

          <p className="mt-1 text-xs text-brand-text">
            Find your favourite products
          </p>
        </div>

        <span className="filter-icon rounded-lg bg-brand-ice p-2 text-brand-navy">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 21v-7" />
            <path d="M4 10V3" />
            <path d="M12 21v-9" />
            <path d="M12 8V3" />
            <path d="M20 21v-5" />
            <path d="M20 12V3" />
            <path d="M2 14h4" />
            <path d="M10 8h4" />
            <path d="M18 16h4" />
          </svg>
        </span>
      </div>

      <div className="space-y-6">

        {/* Category */}
        <div className="filter-section">
          <h3 className={sectionTitle}>
            Product Category
          </h3>

          <div className="space-y-1.5">
            {categories.map((category, index) => {
              const isSelected = selectedCategories.includes(
                category.slug
              );

              return (
                <label
                  key={category.slug}
                  style={{
                    animationDelay: `${Math.min(index * 60, 480)}ms`,
                  }}
                  className={`${labelStyle} filter-stagger ${
                    isVisible ? "filter-stagger-visible" : ""
                  } ${
                    isSelected
                      ? "border border-brand-orange/30 bg-brand-orange/10 font-semibold text-brand-navy"
                      : "border border-transparent text-brand-text hover:border-[#E5E7EB] hover:bg-brand-ice hover:text-brand-navy"
                  }`}
                >
                  <span>{category.name}</span>

                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      onCategoryChange(category.slug)
                    }
                    className={radioStyle}
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-[#E5E7EB]" />

        {/* Price */}
        <div className="filter-section">
          <h3 className={sectionTitle}>
            Price Range
          </h3>

          <div className="space-y-1.5">
            {[
              "All Prices",
              "Under ₹100",
              "₹100 - ₹250",
              "₹250 - ₹500",
              "Above ₹500",
              ...(selectedPrice === "Custom" ? ["Custom"] : []),
            ].map((price, index) => (
              <label
                key={price}
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
                className={`${labelStyle} filter-stagger ${
                  isVisible ? "filter-stagger-visible" : ""
                } ${
                  selectedPrice === price
                    ? "bg-brand-ice font-semibold text-brand-navy"
                    : "text-brand-text hover:bg-brand-ice hover:text-brand-navy"
                }`}
              >
                <span>
                  {price === "Custom" ? "Custom range" : price}
                </span>

                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === price}
                  disabled={price === "Custom"}
                  onChange={() => onPriceChange(price)}
                  className={radioStyle}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-[#E5E7EB]" />

        {/* Veg / Non-Veg */}
        <div className="filter-section">
          <h3 className={sectionTitle}>
            Product Type
          </h3>

          <div className="space-y-1.5">
            {[
              { label: "All Types", value: "all" },
              { label: "Veg", value: "veg" },
              { label: "Non-Veg", value: "non-veg" },
            ].map((type, index) => (
              <label
                key={type.value}
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
                className={`${labelStyle} filter-stagger ${
                  isVisible ? "filter-stagger-visible" : ""
                } ${
                  selectedType === type.value
                    ? "bg-brand-ice font-semibold text-brand-navy"
                    : "text-brand-text hover:bg-brand-ice hover:text-brand-navy"
                }`}
              >
                <span className="flex items-center gap-2">
                  {type.value !== "all" && (
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 rounded-full ${
                        type.value === "veg"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    />
                  )}

                  {type.label}
                </span>

                <input
                  type="radio"
                  name="product-type"
                  value={type.value}
                  checked={selectedType === type.value}
                  onChange={() => onTypeChange(type.value)}
                  className={radioStyle}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-[#E5E7EB]" />

        {/* Weight */}
        <div className="filter-section">
          <h3 className={sectionTitle}>
            Product Weight
          </h3>

          <div className="space-y-1.5">
            {["All Weights", "250g", "500g", "1kg", "5kg"].map(
              (weight, index) => (
                <label
                  key={weight}
                  style={{
                    animationDelay: `${index * 60}ms`,
                  }}
                  className={`${labelStyle} filter-stagger ${
                    isVisible ? "filter-stagger-visible" : ""
                  } ${
                    selectedWeight === weight
                      ? "bg-brand-ice font-semibold text-brand-navy"
                      : "text-brand-text hover:bg-brand-ice hover:text-brand-navy"
                  }`}
                >
                  <span>{weight}</span>

                  <input
                    type="radio"
                    name="weight"
                    checked={selectedWeight === weight}
                    onChange={() => onWeightChange(weight)}
                    className={radioStyle}
                  />
                </label>
              )
            )}
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          type="button"
          onClick={onClearFilters}
          className="group/view hidden shrink-0 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#111111] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#65C92E] hover:bg-[#EFF8E9] hover:shadow-md active:scale-95 sm:inline-flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-rotate-180 motion-reduce:transform-none"
          >
            <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
            <path d="M3 3v5h5" />
          </svg>

          Clear All Filters
        </button>

      </div>

      {/* Filter Animations */}
      <style jsx global>{`
        @keyframes filterFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes filterStagger {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes filterIconSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(180deg);
          }
        }

        .filter-heading {
          animation: filterFadeUp 600ms ease-out both;
        }

        .filter-icon {
          animation: filterIconSpin 1.2s ease-out both;
          transition: background-color 250ms ease;
        }

        .filter-panel-visible .filter-stagger {
          animation: filterStagger 450ms ease-out both;
        }

        .filter-option:has(input:checked) {
          transition:
            background-color 250ms ease,
            border-color 250ms ease,
            color 250ms ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .filter-heading,
          .filter-icon,
          .filter-stagger,
          .filter-panel-visible .filter-stagger {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }

          .filter-option,
          .filter-option input,
          button {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ShopFilters;
