
import { useState } from "react";
import {
  X,
  Package,
  Tag,
  FileText,
  CheckCircle,
  Ban,
  Pencil,
  CalendarDays,
  Star,
  Box,
  Layers,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Utensils,
  AlertCircle,
  Leaf,
  Flame,
  Info,
} from "lucide-react";

const ProductView = ({ product, onClose, onEdit }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  if (!product) return null;

  const isActive = product.status === "Active";

  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? product.category.name || "-"
      : product.categoryName || product.category || "-";

  const categoryId =
    typeof product.category === "object" && product.category !== null
      ? product.category._id || product.category.id || "-"
      : product.category || "-";

  const parentCategory =
    typeof product.category === "object" && product.category !== null
      ? product.category.parentCategory
      : null;

  const parentCategoryName =
    typeof parentCategory === "object" && parentCategory !== null
      ? parentCategory.name || ""
      : product.parentCategoryName || "";

  const images = [
    ...(Array.isArray(product.images) ? product.images : []),
    ...(product.image && !product.images?.includes(product.image)
      ? [product.image]
      : []),
  ].filter(Boolean);

  const nutrition = product.nutritionInformation || {};

  const hasNutrition = Object.entries(nutrition).some(
    ([key, value]) =>
      key !== "basis" &&
      value !== undefined &&
      value !== null &&
      value !== ""
  );

  const infoCardClass =
    "rounded-xl border border-gray-100 bg-white p-4 transition duration-200 hover:border-[#65C92E]/40 hover:shadow-sm";

  const formatValue = (value) =>
    value !== undefined && value !== null && value !== ""
      ? value
      : "Not provided";

  const formatNutrition = (value, unit) =>
    value !== undefined && value !== null && value !== ""
      ? `${value} ${unit}`
      : "Not provided";

  const highlights = Array.isArray(product.highlights)
    ? product.highlights
    : [];

  const ingredients = Array.isArray(product.ingredients)
    ? product.ingredients
    : [];

  const nutritionRows = [
    ["Energy", formatNutrition(nutrition.energyKcal, "kcal")],
    ["Protein", formatNutrition(nutrition.proteinG, "g")],
    ["Total Fat", formatNutrition(nutrition.fatG, "g")],
    ["Saturated Fat", formatNutrition(nutrition.saturatedFatG, "g")],
    ["Trans Fat", formatNutrition(nutrition.transFatG, "g")],
    ["Carbohydrates", formatNutrition(nutrition.carbohydratesG, "g")],
    ["Sugar", formatNutrition(nutrition.sugarG, "g")],
    ["Cholesterol", formatNutrition(nutrition.cholesterolMg, "mg")],
  ];

  const previousImage = () => {
    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    setActiveImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        className="my-5 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#EFF8E9] p-3 text-[#347F19]">
              <Package size={23} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#111111] sm:text-xl">
                Product Details
              </h2>
              <p className="text-xs text-gray-500">
                Complete product information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-500"
          >
            <X size={22} />
          </button>
        </div>

        {/* Main Content */}
        <div className="max-h-[75vh] space-y-6 overflow-y-auto p-5 sm:p-7">

          {/* Product Overview */}
          <div className="grid gap-6 md:grid-cols-[260px_1fr]">

            {/* Images */}
            <div>
              <div className="relative flex h-60 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-[#F7FAF5]">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[activeImage]}
                      alt={product.name || "Product image"}
                      className="h-full w-full object-contain"
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={previousImage}
                          aria-label="Previous image"
                          className="absolute left-2 rounded-full bg-white/90 p-2 text-gray-700 shadow hover:bg-white"
                        >
                          <ChevronLeft size={19} />
                        </button>

                        <button
                          type="button"
                          onClick={nextImage}
                          aria-label="Next image"
                          className="absolute right-2 rounded-full bg-white/90 p-2 text-gray-700 shadow hover:bg-white"
                        >
                          <ChevronRight size={19} />
                        </button>

                        <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                          {activeImage + 1} / {images.length}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <ImageIcon size={45} />
                    <span className="text-xs">No product image</span>
                  </div>
                )}

                {product.isNew && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#65C92E] px-3 py-1 text-[10px] font-bold uppercase text-white shadow">
                    New
                  </span>
                )}

                {product.featured && (
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-semibold text-white shadow">
                    <Star size={11} fill="currentColor" />
                    Featured
                  </span>
                )}
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      onClick={() => setActiveImage(index)}
                      className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 ${
                        activeImage === index
                          ? "border-[#65C92E]"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Basic Details */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    isActive
                      ? "bg-[#EFF8E9] text-[#347F19]"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {isActive ? (
                    <CheckCircle size={13} />
                  ) : (
                    <Ban size={13} />
                  )}
                  {product.status || "Unknown"}
                </span>

                {product.isNew && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    New Product
                  </span>
                )}

                {product.featured && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Featured
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-2xl font-bold text-[#111111] sm:text-3xl">
                {product.name || "Unnamed Product"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {product.description || "No description available."}
              </p>

              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Selling Price
                </p>
                <p className="mt-1 text-3xl font-bold text-[#347F19]">
                  {product.price !== undefined &&
                  product.price !== null &&
                  product.price !== ""
                    ? `₹${Number(product.price).toLocaleString("en-IN")}`
                    : "Not provided"}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      product.type === "veg"
                        ? "bg-green-600"
                        : product.type === "non-veg"
                        ? "bg-red-600"
                        : "bg-gray-400"
                    }`}
                  />
                  {product.type === "veg"
                    ? "Vegetarian"
                    : product.type === "non-veg"
                    ? "Non-Vegetarian"
                    : "Type not set"}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">
                  <Box size={14} />
                  {product.packSize || "Pack size not set"}
                </span>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <section>
            <h3 className="mb-3 text-base font-semibold text-[#111111]">
              Basic Information
            </h3>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className={infoCardClass}>
                <Tag size={19} className="mb-3 text-[#347F19]" />
                <p className="text-xs text-gray-400">Product SKU</p>
                <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                  {formatValue(product.sku)}
                </p>
              </div>

              <div className={infoCardClass}>
                <Box size={19} className="mb-3 text-[#347F19]" />
                <p className="text-xs text-gray-400">Pack Size</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatValue(product.packSize)}
                </p>
              </div>

              <div className={infoCardClass}>
                <FileText size={19} className="mb-3 text-[#347F19]" />
                <p className="text-xs text-gray-400">Product ID</p>
                <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                  {product._id || product.id || "-"}
                </p>
              </div>

              <div className={infoCardClass}>
                <Star size={19} className="mb-3 text-amber-500" />
                <p className="text-xs text-gray-400">Featured Product</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {product.featured ? "Yes" : "No"}
                </p>
              </div>

              <div className={infoCardClass}>
                <CalendarDays size={19} className="mb-3 text-[#347F19]" />
                <p className="text-xs text-gray-400">Product Status</p>
                <p
                  className={`mt-1 text-sm font-semibold ${
                    isActive ? "text-[#347F19]" : "text-red-600"
                  }`}
                >
                  {product.status || "-"}
                </p>
              </div>

              <div className={infoCardClass}>
                <Layers size={19} className="mb-3 text-[#347F19]" />
                <p className="text-xs text-gray-400">Product Type</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {product.type === "veg"
                    ? "Vegetarian"
                    : product.type === "non-veg"
                    ? "Non-Vegetarian"
                    : "-"}
                </p>
              </div>
            </div>
          </section>

          {/* Category Information */}
          <section className="rounded-xl border border-[#B9DDA8] bg-[#F7FAF5] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Layers size={19} className="text-[#347F19]" />
              <h3 className="font-semibold text-[#111111]">
                Category Information
              </h3>
            </div>

            {parentCategoryName && (
              <p className="text-sm text-gray-500">
                Main Category:{" "}
                <span className="font-semibold text-gray-800">
                  {parentCategoryName}
                </span>
              </p>
            )}

            <p className="mt-1 text-sm text-[#347F19]">
              Subcategory:{" "}
              <span className="font-semibold">{categoryName}</span>
            </p>

            <p className="mt-2 break-all text-xs text-gray-400">
              Category ID: {categoryId}
            </p>
          </section>

          {/* Product Information Tabs */}
          <section className="overflow-hidden rounded-xl border border-gray-100">
            <div className="flex flex-wrap border-b border-gray-100 bg-gray-50">
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`px-5 py-3 text-sm font-semibold transition ${
                  activeTab === "description"
                    ? "border-b-2 border-[#65C92E] bg-white text-[#347F19]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Description
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("additional")}
                className={`px-5 py-3 text-sm font-semibold transition ${
                  activeTab === "additional"
                    ? "border-b-2 border-[#65C92E] bg-white text-[#347F19]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Additional Information
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("nutrition")}
                className={`px-5 py-3 text-sm font-semibold transition ${
                  activeTab === "nutrition"
                    ? "border-b-2 border-[#65C92E] bg-white text-[#347F19]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Nutrition
              </button>
            </div>

            <div className="space-y-5 p-5">

              {/* Description Tab */}
              {activeTab === "description" && (
                <>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <FileText size={18} className="text-[#347F19]" />
                      <h4 className="font-semibold text-gray-900">
                        Product Description
                      </h4>
                    </div>

                    <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                      {product.description || "No description available."}
                    </p>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Star size={18} className="text-amber-500" />
                      <h4 className="font-semibold text-gray-900">
                        Product Highlights
                      </h4>
                    </div>

                    {highlights.length > 0 ? (
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {highlights.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 rounded-lg bg-[#F7FAF5] p-3 text-sm text-gray-700"
                          >
                            <CheckCircle
                              size={16}
                              className="mt-0.5 shrink-0 text-[#347F19]"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No highlights provided.
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Additional Information Tab */}
              {activeTab === "additional" && (
                <>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Utensils size={18} className="text-[#347F19]" />
                      <h4 className="font-semibold text-gray-900">
                        Ingredients
                      </h4>
                    </div>

                    {ingredients.length > 0 ? (
                      <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
                        {ingredients.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No ingredients provided.
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl bg-amber-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <AlertCircle size={18} className="text-amber-600" />
                      <h4 className="font-semibold text-gray-900">
                        Allergen Information
                      </h4>
                    </div>

                    <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
                      {product.allergenInformation ||
                        "No allergen information provided."}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F7FAF5] p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Utensils size={18} className="text-[#347F19]" />
                      <h4 className="font-semibold text-gray-900">
                        Recommended Use
                      </h4>
                    </div>

                    <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
                      {product.recommendedUse ||
                        "No recommended use provided."}
                    </p>
                  </div>
                </>
              )}

              {/* Nutrition Tab */}
              {activeTab === "nutrition" && (
                <>
                  <div className="flex items-center gap-2">
                    <Flame size={19} className="text-[#347F19]" />
                    <h4 className="font-semibold text-gray-900">
                      Nutrition Information
                    </h4>
                  </div>

                  {hasNutrition ? (
                    <>
                      <p className="text-xs text-gray-500">
                        Values: {nutrition.basis || "per 100g"}
                      </p>

                      <div className="overflow-hidden rounded-xl border border-gray-100">
                        {nutritionRows.map(([label, value]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-0"
                          >
                            <span className="text-sm text-gray-600">
                              {label}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-xl bg-gray-50 p-6 text-center">
                      <Info
                        size={28}
                        className="mx-auto mb-2 text-gray-400"
                      />
                      <p className="text-sm font-medium text-gray-600">
                        Nutrition information not provided.
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Add nutrition values from the actual product packaging.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-[#F7FAF5] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-6 py-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#58B925] hover:shadow-md"
          >
            <Pencil size={17} />
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
