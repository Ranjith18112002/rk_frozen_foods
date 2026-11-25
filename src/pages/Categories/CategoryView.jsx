
import {
  X,
  FolderOpen,
  Folder,
  Tag,
  Package,
  FileText,
  CheckCircle,
  Ban,
  Pencil,
  CalendarDays,
  Layers,
  Hash,
  Clock,
} from "lucide-react";

const CategoryView = ({ category, onClose, onEdit }) => {
  if (!category) return null;

  const isActive = category.status === "Active";

  const categoryId = category._id || category.id || "-";

  const parentCategory =
    typeof category.parentCategory === "object" &&
    category.parentCategory !== null
      ? category.parentCategory
      : null;

  const parentCategoryId =
    parentCategory?._id ||
    parentCategory?.id ||
    category.parentCategoryId ||
    (typeof category.parentCategory === "string"
      ? category.parentCategory
      : "");

  const parentCategoryName =
    parentCategory?.name ||
    category.parentCategoryName ||
    "";

  const isSubcategory = Boolean(parentCategoryId);

  const categoryType = isSubcategory
    ? "Subcategory"
    : "Main Category";

  const productCount = category.productCount;

  const subcategoryCount = category.subcategoryCount;

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const infoCardClass =
    "rounded-xl border border-gray-100 bg-white p-4 transition duration-200 hover:border-[#65C92E]/40 hover:shadow-sm";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-6 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#EFF8E9] p-3 text-[#347F19]">
              {isSubcategory ? (
                <Folder size={23} />
              ) : (
                <FolderOpen size={23} />
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#111111] sm:text-xl">
                Category Details
              </h2>

              <p className="text-xs text-gray-500">
                View complete category information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close category details"
            className="rounded-lg p-2 text-gray-500 transition duration-200 hover:bg-red-50 hover:text-red-500 active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] space-y-6 overflow-y-auto p-5 sm:p-7">

          {/* Category Overview */}
          <div className="rounded-2xl border border-gray-100 bg-[#F7FAF5] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#EFF8E9] text-[#347F19]">
                {isSubcategory ? (
                  <Folder size={38} />
                ) : (
                  <FolderOpen size={38} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#E8F5DF] px-3 py-1 text-xs font-semibold text-[#347F19]">
                    {categoryType}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      isActive
                        ? "bg-[#EFF8E9] text-[#347F19]"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {isActive ? (
                      <CheckCircle size={13} />
                    ) : (
                      <Ban size={13} />
                    )}

                    {category.status || "Unknown"}
                  </span>
                </div>

                <h2 className="mt-3 break-words text-2xl font-semibold text-[#111111]">
                  {category.name || "Unnamed Category"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {category.description || "No description available."}
                </p>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <section>
            <h3 className="mb-3 text-base font-semibold text-[#111111]">
              Basic Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Category ID */}
              <div className={infoCardClass}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                  <Tag size={20} />
                </div>

                <p className="text-xs text-gray-400">
                  Category ID
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-[#111111]">
                  #{categoryId}
                </p>
              </div>

              {/* Category Slug */}
              <div className={infoCardClass}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Hash size={20} />
                </div>

                <p className="text-xs text-gray-400">
                  Category Slug
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-[#111111]">
                  {category.slug || "-"}
                </p>
              </div>

              {/* Category Type */}
              <div className={infoCardClass}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF8E9] text-[#347F19]">
                  <Layers size={20} />
                </div>

                <p className="text-xs text-gray-400">
                  Category Type
                </p>

                <p className="mt-1 text-sm font-semibold text-[#111111]">
                  {categoryType}
                </p>
              </div>

              {/* Status */}
              <div className={infoCardClass}>
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${
                    isActive
                      ? "bg-[#EFF8E9] text-[#347F19]"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  <CalendarDays size={20} />
                </div>

                <p className="text-xs text-gray-400">
                  Category Status
                </p>

                <p
                  className={`mt-1 text-sm font-semibold ${
                    isActive ? "text-[#347F19]" : "text-amber-700"
                  }`}
                >
                  {category.status || "-"}
                </p>
              </div>
            </div>
          </section>

          {/* Parent Category */}
          {isSubcategory && (
            <section className="rounded-xl border border-[#B9DDA8] bg-[#F7FAF5] p-5">
              <div className="mb-3 flex items-center gap-2">
                <FolderOpen size={19} className="text-[#347F19]" />

                <h3 className="font-semibold text-[#111111]">
                  Parent Category
                </h3>
              </div>

              <p className="text-sm font-semibold text-[#347F19]">
                {parentCategoryName || "Parent category name unavailable"}
              </p>

              <p className="mt-2 break-all text-xs text-gray-400">
                Parent Category ID: {parentCategoryId}
              </p>
            </section>
          )}

          {/* Product / Subcategory Counts */}
          <section>
            <h3 className="mb-3 text-base font-semibold text-[#111111]">
              Category Overview
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Product Count */}
              <div className={infoCardClass}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF8E9] text-[#347F19]">
                  <Package size={20} />
                </div>

                <p className="text-xs text-gray-400">
                  Total Products
                </p>

                <p className="mt-1 text-xl font-bold text-[#111111]">
                  {productCount !== undefined && productCount !== null
                    ? productCount
                    : "-"}
                </p>
              </div>

              {/* Subcategory Count */}
              {!isSubcategory && (
                <div className={infoCardClass}>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <Layers size={20} />
                  </div>

                  <p className="text-xs text-gray-400">
                    Total Subcategories
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#111111]">
                    {subcategoryCount !== undefined &&
                    subcategoryCount !== null
                      ? subcategoryCount
                      : "-"}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Description */}
          <section className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <FileText size={18} className="text-[#347F19]" />

              <h3 className="font-semibold text-[#111111]">
                Category Description
              </h3>
            </div>

            <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
              {category.description || "No description available."}
            </p>
          </section>

          {/* Date Information */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className={infoCardClass}>
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <CalendarDays size={17} />
                <p className="text-xs">Created Date</p>
              </div>

              <p className="text-sm font-semibold text-[#111111]">
                {formatDate(category.createdAt)}
              </p>
            </div>

            <div className={infoCardClass}>
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <Clock size={17} />
                <p className="text-xs">Last Updated</p>
              </div>

              <p className="text-sm font-semibold text-[#111111]">
                {formatDate(category.updatedAt)}
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-[#F7FAF5] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition duration-200 hover:bg-gray-100 active:scale-95"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-6 py-3 text-sm font-semibold text-[#111111] shadow-sm transition duration-200 hover:bg-[#58B925] hover:shadow-md active:scale-95"
          >
            <Pencil size={17} />
            Edit Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
