
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FolderOpen,
  ArrowLeft,
  Save,
  X,
  Tag,
  FileText,
  CheckCircle,
  Layers,
} from "lucide-react";

import {
  createCategory,
  updateCategory,
  getCategoryById,
  getCategories,
} from "../../services/categoryService";

const CategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEdit = Boolean(id);
  const existingCategory = location.state?.category;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentCategory: "",
    status: "Active",
  });

  const [categoryType, setCategoryType] = useState("main");
  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getResponseData = (response) =>
    response?.data?.data ?? response?.data ?? response;

  // Load main categories for the parent dropdown
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await getCategories();
        const categories = getResponseData(response);

        const list = Array.isArray(categories)
          ? categories
          : categories?.categories || [];

        setMainCategories(
          list.filter((category) => {
            const parentCategory = category.parentCategory;
            const isMainCategory =
              !parentCategory ||
              (typeof parentCategory === "string" &&
                parentCategory.trim() === "");

            const categoryId = category._id || category.id;
            const categoryStatus = category.status || "Active";

            return (
              isMainCategory &&
              categoryStatus === "Active" &&
              String(categoryId) !== String(id || "")
            );
          })
        );
      } catch (err) {
        console.error("Main Categories Error:", err);
      }
    };

    fetchMainCategories();
  }, [id]);

  // Load category while editing
  useEffect(() => {
    const fetchCategory = async () => {
      if (!isEdit) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        let category = existingCategory;

        if (!category) {
          const response = await getCategoryById(id);
          category = getResponseData(response);
        }

        if (!category) {
          throw new Error("Category details not found.");
        }

        const parentId =
          typeof category.parentCategory === "object"
            ? category.parentCategory?._id || ""
            : category.parentCategory || "";

        setFormData({
          name: category.name || "",
          slug: category.slug || "",
          description: category.description || "",
          parentCategory: parentId,
          status: category.status || "Active",
        });

        setCategoryType(parentId ? "subcategory" : "main");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load category details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, isEdit, existingCategory]);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" && {
        slug: value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      }),
    }));
  };

  // Category type change
  const handleCategoryTypeChange = (type) => {
    setCategoryType(type);

    setFormData((prev) => ({
      ...prev,
      parentCategory:
        type === "main"
          ? ""
          : prev.parentCategory ||
            mainCategories[0]?._id ||
            mainCategories[0]?.id ||
            "",
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter category name.");
      return;
    }

    if (!formData.slug.trim()) {
      setError("Please enter category slug.");
      return;
    }

    if (
      categoryType === "subcategory" &&
      !formData.parentCategory
    ) {
      setError("Please select an active main category.");
      return;
    }

    if (
      categoryType === "subcategory" &&
      !mainCategories.some(
        (category) =>
          String(category._id || category.id) ===
          String(formData.parentCategory)
      )
    ) {
      setError("Only active main categories can be selected as a parent.");
      return;
    }

    const categoryData = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      parentCategory:
        categoryType === "subcategory"
          ? formData.parentCategory
          : null,
      status: formData.status,
    };

    try {
      setSaving(true);

      if (isEdit) {
        await updateCategory(id, categoryData);
        alert("Category updated successfully!");
      } else {
        await createCategory(categoryData);
        alert("Category created successfully!");
      }

      navigate("/categories", { replace: true });
    } catch (err) {
      console.error("Category Save Error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#111111] outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/15";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#333333]";

  const cardClass =
    "rounded-xl border border-gray-100 bg-white p-5 shadow-sm";

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#EFF8E9] border-t-[#65C92E]" />
          <p className="mt-3 text-sm text-gray-500">
            Loading category details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/categories")}
          className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#347F19]"
        >
          <ArrowLeft size={17} />
          Back to Categories
        </button>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#EFF8E9] p-3 text-[#347F19]">
            <FolderOpen size={25} />
          </div>

          <div>
            <h1 className="text-[28px] font-semibold leading-tight text-[#111111]">
              {isEdit ? "Edit Category" : "Add New Category"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "Update your category information."
                : "Create a main category or subcategory."}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Side */}
          <div className="space-y-6 lg:col-span-1">
            {/* Category Type */}
            <div className={cardClass}>
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-[#111111]">
                <Layers size={18} className="text-[#347F19]" />
                Category Type
              </h2>

              <label className="mb-3 flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 p-3 transition hover:border-[#65C92E]">
                <input
                  type="radio"
                  name="categoryType"
                  checked={categoryType === "main"}
                  onChange={() => handleCategoryTypeChange("main")}
                  className="mt-1 h-4 w-4 accent-[#65C92E]"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Main Category
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Create a parent category.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 p-3 transition hover:border-[#65C92E]">
                <input
                  type="radio"
                  name="categoryType"
                  checked={categoryType === "subcategory"}
                  onChange={() =>
                    handleCategoryTypeChange("subcategory")
                  }
                  className="mt-1 h-4 w-4 accent-[#65C92E]"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Subcategory
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Add under an existing main category.
                  </p>
                </div>
              </label>
            </div>

            {/* Status */}
            <div className={cardClass}>
              <h2 className="mb-4 font-semibold text-[#111111]">
                Category Status
              </h2>

              <label className="mb-3 flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 p-3 transition hover:border-[#65C92E]/50 hover:bg-[#F7FAF5]">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === "Active"}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#65C92E]"
                />

                <CheckCircle size={18} className="text-[#347F19]" />
                <span className="text-sm font-semibold text-gray-700">
                  Active
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 p-3 transition hover:border-amber-200 hover:bg-amber-50">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === "Inactive"}
                  onChange={handleChange}
                  className="h-4 w-4 accent-amber-500"
                />

                <X size={18} className="text-amber-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Inactive
                </span>
              </label>
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-2">
            <div className={`${cardClass} sm:p-7`}>
              <h2 className="mb-6 font-semibold text-[#111111]">
                Category Information
              </h2>

              <div className="space-y-5">
                {/* Parent Category */}
                {categoryType === "subcategory" && (
                  <div>
                    <label className={labelClass}>
                      Parent Category *
                    </label>

                    <select
                      name="parentCategory"
                      value={formData.parentCategory}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">
                        Select Main Category
                      </option>

                      {mainCategories.map((category) => {
                        const categoryId = category._id || category.id;

                        return (
                          <option
                            key={categoryId}
                            value={categoryId}
                          >
                            {category.name}
                          </option>
                        );
                      })}
                    </select>

                    {mainCategories.length === 0 && (
                      <p className="mt-2 text-xs text-amber-600">
                        No active main categories available. Please activate a main category first.
                      </p>
                    )}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className={labelClass}>
                    Category Name *
                  </label>

                  <div className="relative">
                    <Tag
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      placeholder="Example: Momos"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                {/* Slug */}
                <div>
                  <label className={labelClass}>
                    Category Slug *
                  </label>

                  <input
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    placeholder="momos"
                    className={`${inputClass} bg-[#F7FAF5]`}
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Automatically generated from category name.
                    You can edit it.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-[#333333]">
                      Category Description
                    </label>

                    <span className="text-xs text-gray-400">
                      {formData.description.length}/500
                    </span>
                  </div>

                  <div className="relative">
                    <FileText
                      size={18}
                      className="absolute left-3 top-4 text-gray-400"
                    />

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      maxLength={500}
                      placeholder="Enter category description..."
                      className={`${inputClass} resize-none pl-10`}
                    />
                  </div>
                </div>

                {/* Category ID */}
                {isEdit && (
                  <div className="rounded-lg border border-gray-100 bg-[#F7FAF5] p-4">
                    <p className="text-xs text-gray-400">
                      Category ID
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-[#347F19]">
                      #{id}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col-reverse gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/categories")}
            disabled={saving}
            className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              saving ||
              (categoryType === "subcategory" &&
                mainCategories.length === 0)
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-6 py-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#58B925] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#111111]/30 border-t-[#111111]" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                {isEdit ? "Update Category" : "Save Category"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
