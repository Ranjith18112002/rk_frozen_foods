
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Layers,
  CheckCircle,
  XCircle,
  X,
  FolderOpen,
  Folder,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import CategoryView from "./CategoryView";

import {
  getCategories,
  deleteCategory as deleteCategoryApi,
} from "../../services/categoryService";

const Category = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteCategoryItem, setDeleteCategoryItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Normalize API response
  const normalizeCategory = (category) => {
    const parent =
      category.parentCategory &&
      typeof category.parentCategory === "object"
        ? category.parentCategory
        : null;

    const parentId =
      parent?._id ||
      (typeof category.parentCategory === "string"
        ? category.parentCategory
        : null);

    return {
      ...category,
      id: category._id || category.id,
      parentCategoryId: parentId,
      parentCategoryName: parent?.name || "",
      categoryType: parentId ? "Subcategory" : "Main Category",
      productCount:
        typeof category.productCount === "number"
          ? category.productCount
          : null,
      status: category.status || "Active",
    };
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      const categoryData =
        response?.data?.data ??
        response?.data ??
        response;

      const list = Array.isArray(categoryData)
        ? categoryData
        : categoryData?.categories || [];

      const normalized = list.map(normalizeCategory);

      setCategories(normalized);

      // Expand all main categories by default
      const expanded = {};

      normalized
        .filter((category) => !category.parentCategoryId)
        .forEach((category) => {
          expanded[category.id] = true;
        });

      setExpandedCategories(expanded);
    } catch (err) {
      console.error("Category fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load categories. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Category search matching
  const matchesSearch = (category) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return true;

    return [
      category.name,
      category.slug,
      category.description,
      category.parentCategoryName,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );
  };

  // Build main category and subcategory hierarchy
  const groupedCategories = useMemo(() => {
    const mainCategories = categories.filter(
      (category) => !category.parentCategoryId
    );

    return mainCategories
      .map((mainCategory) => {
        const children = categories.filter(
          (category) =>
            category.parentCategoryId === mainCategory.id
        );

        const matchingChildren = children.filter((child) => {
          const matchesStatus =
            statusFilter === "All" ||
            child.status === statusFilter;

          const matchesType =
            typeFilter === "All" ||
            typeFilter === "Subcategory";

          return (
            matchesStatus &&
            matchesType &&
            matchesSearch(child)
          );
        });

        const mainMatchesStatus =
          statusFilter === "All" ||
          mainCategory.status === statusFilter;

        const mainMatchesType =
          typeFilter === "All" ||
          typeFilter === "Main Category";

        const mainMatchesSearch = matchesSearch(mainCategory);

        const shouldShowMain =
          mainMatchesStatus &&
          mainMatchesType &&
          mainMatchesSearch;

        // When searching for a subcategory, keep its parent visible
        if (
          !shouldShowMain &&
          matchingChildren.length === 0
        ) {
          return null;
        }

        return {
          ...mainCategory,
          children:
            shouldShowMain && !search.trim()
              ? matchingChildren
              : shouldShowMain
                ? matchingChildren
                : matchingChildren,
          showMain: shouldShowMain,
        };
      })
      .filter(Boolean);
  }, [categories, search, statusFilter, typeFilter]);

  // Statistics
  const mainCategoryCount = categories.filter(
    (category) => !category.parentCategoryId
  ).length;

  const subcategoryCount = categories.filter(
    (category) => Boolean(category.parentCategoryId)
  ).length;

  const activeCount = categories.filter(
    (category) => category.status === "Active"
  ).length;

  const inactiveCount = categories.filter(
    (category) => category.status === "Inactive"
  ).length;

  // Expand / collapse
  const toggleCategory = (categoryId) => {
    setExpandedCategories((previous) => ({
      ...previous,
      [categoryId]: !previous[categoryId],
    }));
  };

  const expandAll = () => {
    const expanded = {};

    categories
      .filter((category) => !category.parentCategoryId)
      .forEach((category) => {
        expanded[category.id] = true;
      });

    setExpandedCategories(expanded);
  };

  const collapseAll = () => {
    setExpandedCategories({});
  };

  // Add category
  const handleAddCategory = () => {
    navigate("/categories/add");
  };

  // Edit category
  const handleEditCategory = (category) => {
    if (!category) return;

    const categoryId = category._id || category.id;

    navigate(
      `/categories/edit/${encodeURIComponent(categoryId)}`,
      {
        state: {
          category: {
            ...category,
            id: categoryId,
          },
        },
      }
    );
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!deleteCategoryItem) return;

    try {
      setDeleting(true);

      const categoryId =
        deleteCategoryItem._id || deleteCategoryItem.id;

      await deleteCategoryApi(categoryId);

      setCategories((previous) =>
        previous.filter(
          (category) => category.id !== categoryId
        )
      );

      setSelectedCategory((previous) =>
        previous?.id === categoryId ||
        previous?._id === categoryId
          ? null
          : previous
      );

      setDeleteCategoryItem(null);

      alert("Category deleted successfully!");
    } catch (err) {
      console.error("Category delete error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to delete category. Please check whether it has subcategories or linked products."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Reusable category actions
  const renderActions = (category) => (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => setSelectedCategory(category)}
        title="View Category"
        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
      >
        <Eye size={17} />
      </button>

      <button
        type="button"
        onClick={() => handleEditCategory(category)}
        title="Edit Category"
        className="rounded-lg p-2 text-[#347F19] transition hover:bg-[#EFF8E9]"
      >
        <Pencil size={17} />
      </button>

      <button
        type="button"
        onClick={() => setDeleteCategoryItem(category)}
        title="Delete Category"
        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );

  const statCards = [
    {
      title: "Total Categories",
      value: categories.length,
      icon: Layers,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Main Categories",
      value: mainCategoryCount,
      icon: FolderOpen,
      iconBg: "bg-[#EFF8E9]",
      iconColor: "text-[#347F19]",
    },
    {
      title: "Subcategories",
      value: subcategoryCount,
      icon: Folder,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Active Categories",
      value: activeCount,
      icon: CheckCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Inactive Categories",
      value: inactiveCount,
      icon: XCircle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAF5] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[36px] font-semibold leading-tight text-[#111111]">
            Categories
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Organize your frozen food products into categories.
          </p>

          <p className="mt-2 text-xs text-[#347F19]">
            Dashboard / Categories
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddCategory}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-5 py-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#55B522] active:scale-95"
        >
          <Plus size={18} />
          Add New Category
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={fetchCategories}
            className="text-sm font-semibold text-red-700 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon
                    size={23}
                    className={stat.iconColor}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Section */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-[#111111]">
                Category Structure
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Main categories contain their related subcategories.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Expand All
              </button>

              <button
                type="button"
                onClick={collapseAll}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search category or subcategory..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/20"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#65C92E] lg:w-48"
            >
              <option value="All">All Categories</option>
              <option value="Main Category">Main Categories</option>
              <option value="Subcategory">Subcategories</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#65C92E] lg:w-40"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Hierarchy Guide */}
        <div className="flex flex-wrap items-center gap-5 border-b border-gray-100 bg-[#FAFCF8] px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FolderOpen size={16} className="text-[#347F19]" />
            Main Category
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Folder size={16} className="text-purple-600" />
            Subcategory
          </div>

          <p className="text-xs text-gray-400">
            Select the arrow to view or hide subcategories.
          </p>
        </div>

        {/* Hierarchy List */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#EFF8E9] border-t-[#65C92E]" />

              <p className="mt-3 text-sm text-gray-500">
                Loading categories...
              </p>
            </div>
          ) : groupedCategories.length > 0 ? (
            groupedCategories.map((mainCategory) => {
              const isExpanded =
                Boolean(expandedCategories[mainCategory.id]);

              return (
                <div key={mainCategory.id}>

                  {/* Main Category Row */}
                  {mainCategory.showMain && (
                    <div className="flex flex-col gap-3 bg-white px-4 py-4 transition hover:bg-[#FAFCF8] sm:flex-row sm:items-center sm:justify-between sm:px-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            toggleCategory(mainCategory.id)
                          }
                          disabled={mainCategory.children.length === 0}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-default disabled:opacity-30"
                          title={
                            isExpanded
                              ? "Hide subcategories"
                              : "Show subcategories"
                          }
                        >
                          {isExpanded ? (
                            <ChevronDown size={19} />
                          ) : (
                            <ChevronRight size={19} />
                          )}
                        </button>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF8E9] text-[#347F19]">
                          <FolderOpen size={22} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-[#111111]">
                              {mainCategory.name}
                            </h3>

                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                              MAIN CATEGORY
                            </span>
                          </div>

                          <p className="mt-1 truncate text-xs text-gray-500">
                            {mainCategory.description ||
                              "No description added"}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {mainCategory.children.length}{" "}
                            {mainCategory.children.length === 1
                              ? "subcategory"
                              : "subcategories"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">
                            {mainCategory.status}
                          </span>

                          {mainCategory.status === "Active" ? (
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                          )}
                        </div>

                        {renderActions(mainCategory)}
                      </div>
                    </div>
                  )}

                  {/* Subcategories */}
                  {isExpanded &&
                    mainCategory.children.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="flex flex-col gap-3 border-t border-dashed border-gray-100 bg-[#FAFCF8] px-4 py-3 pl-8 sm:flex-row sm:items-center sm:justify-between sm:pl-16"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                            <Folder size={18} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-medium text-[#242124]">
                                {subcategory.name}
                              </h4>

                              <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                                SUBCATEGORY
                              </span>
                            </div>

                            <p className="mt-1 truncate text-xs text-gray-500">
                              {subcategory.description ||
                                "No description added"}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              Under: {mainCategory.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              subcategory.status === "Active"
                                ? "bg-[#EFF8E9] text-[#347F19]"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {subcategory.status}
                          </span>

                          {renderActions(subcategory)}
                        </div>
                      </div>
                    ))}
                </div>
              );
            })
          ) : (
            <div className="px-5 py-16 text-center">
              <FolderOpen
                size={42}
                className="mx-auto mb-3 text-gray-300"
              />

              <h3 className="font-semibold text-gray-600">
                No categories found
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Try changing your search or filters.
              </p>

              {categories.length === 0 && (
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="mt-4 rounded-lg bg-[#65C92E] px-4 py-2 text-sm font-semibold text-[#111111] hover:bg-[#55B522]"
                >
                  <Plus size={16} className="mr-1 inline" />
                  Add First Category
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {mainCategoryCount} Main Categories ·{" "}
            {subcategoryCount} Subcategories
          </span>

          <span>
            {activeCount} Active · {inactiveCount} Inactive
          </span>
        </div>
      </div>

      {/* View Modal */}
      {selectedCategory && (
        <CategoryView
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onEdit={() => {
            const category = selectedCategory;
            setSelectedCategory(null);
            handleEditCategory(category);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteCategoryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#111111]">
                Delete Category
              </h2>

              <button
                type="button"
                onClick={() => setDeleteCategoryItem(null)}
                disabled={deleting}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 rounded-xl bg-red-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  {deleteCategoryItem.parentCategoryId ? (
                    <Folder size={20} />
                  ) : (
                    <FolderOpen size={20} />
                  )}
                </div>

                <div>
                  <p className="font-semibold text-[#111111]">
                    {deleteCategoryItem.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {deleteCategoryItem.categoryType}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              Are you sure you want to delete this category?
              This action cannot be undone.

              {!deleteCategoryItem.parentCategoryId && (
                <span className="mt-2 block text-xs text-amber-700">
                  Make sure all subcategories and linked products
                  are removed before deleting this main category.
                </span>
              )}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteCategoryItem(null)}
                disabled={deleting}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteCategory}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
