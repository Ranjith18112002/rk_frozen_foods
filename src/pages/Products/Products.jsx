
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  Boxes,
  CheckCircle,
  Ban,
  ImagePlus,
  Sparkles,
  Filter,
} from "lucide-react";

import ProductView from "./ProductView";

import {
  getProducts,
  deleteProduct as deleteProductApi,
} from "../../services/productService";

import { getCategories } from "../../services/categoryService";

const getResponseData = (response) =>
  response?.data?.data ?? response?.data ?? response;

const getId = (item) =>
  String(item?._id || item?.id || "");

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [labelFilter, setLabelFilter] = useState("All");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProductItem, setDeleteProductItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // NORMALIZE CATEGORY
  const normalizeCategory = (category) => {
    const parent = category?.parentCategory;

    return {
      ...category,
      id: getId(category),
      parentCategoryId:
        typeof parent === "object" && parent !== null
          ? getId(parent)
          : parent || null,
      parentCategoryName:
        typeof parent === "object" && parent !== null
          ? parent.name || ""
          : "",
    };
  };

  // NORMALIZE PRODUCT
  const normalizeProduct = (product, categoryList) => {
    const categoryId =
      typeof product.category === "object" &&
      product.category !== null
        ? getId(product.category)
        : String(product.category || product.categoryId || "");

    const categoryObject = categoryList.find(
      (category) => category.id === categoryId
    );

    const categoryName =
      typeof product.category === "object" &&
      product.category !== null
        ? product.category.name || ""
        : categoryObject?.name || "";

    const parentCategory =
      categoryObject?.parentCategoryName ||
      (categoryObject
        ? categoryList.find(
            (category) =>
              category.id === categoryObject.parentCategoryId
          )?.name || ""
        : "");

    return {
      ...product,
      id: getId(product),
      categoryId,
      categoryName,
      parentCategoryName: parentCategory,
      categoryLabel: parentCategory
        ? `${parentCategory} / ${categoryName}`
        : categoryName || "Unknown Category",
      images: Array.isArray(product.images)
        ? product.images
        : product.image
          ? [product.image]
          : [],
      image: product.images?.[0] || product.image || "",
      price: Number(product.price || 0),
      isNew:
        product.isNew === true ||
        product.isNew === "true",
      status: product.status || "Active",
    };
  };

  // FETCH PRODUCTS AND CATEGORIES
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsResponse, categoriesResponse] =
        await Promise.all([
          getProducts(),
          getCategories(),
        ]);

      const categoryData = getResponseData(categoriesResponse);
      const productData = getResponseData(productsResponse);

      const categoryList = Array.isArray(categoryData)
        ? categoryData
        : categoryData?.categories || [];

      const productList = Array.isArray(productData)
        ? productData
        : productData?.products || [];

      const normalizedCategories =
        categoryList.map(normalizeCategory);

      setCategories(normalizedCategories);

      setProducts(
        productList.map((product) =>
          normalizeProduct(product, normalizedCategories)
        )
      );
    } catch (err) {
      console.error("Products fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load products. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CATEGORY OPTIONS
  const subcategories = categories.filter(
    (category) => Boolean(category.parentCategoryId)
  );

  // SEARCH AND FILTER
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        product.name?.toLowerCase().includes(searchText) ||
        product.sku?.toLowerCase().includes(searchText) ||
        product.categoryName?.toLowerCase().includes(searchText) ||
        product.parentCategoryName?.toLowerCase().includes(searchText) ||
        product.description?.toLowerCase().includes(searchText);

      const matchesCategory =
        categoryFilter === "All" ||
        product.categoryId === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        product.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        product.type === typeFilter;

      // Only New Products filter
      const matchesLabel =
        labelFilter === "All" ||
        (labelFilter === "New" && product.isNew);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesType &&
        matchesLabel
      );
    });
  }, [
    products,
    search,
    categoryFilter,
    statusFilter,
    typeFilter,
    labelFilter,
  ]);

  // NAVIGATION
  const handleAddProduct = () => {
    navigate("/products/add");
  };

  const handleEditProduct = (product) => {
    if (!product) return;

    navigate(
      `/products/edit/${encodeURIComponent(product.id)}`,
      {
        state: { product },
      }
    );
  };

  // DELETE PRODUCT
  const handleDeleteProduct = async () => {
    if (!deleteProductItem) return;

    try {
      setDeleting(true);
      setError("");

      await deleteProductApi(deleteProductItem.id);

      setProducts((previous) =>
        previous.filter(
          (product) => product.id !== deleteProductItem.id
        )
      );

      if (selectedProduct?.id === deleteProductItem.id) {
        setSelectedProduct(null);
      }

      setDeleteProductItem(null);

      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Product delete error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete product."
      );
    } finally {
      setDeleting(false);
    }
  };

  // STATISTICS
  const activeCount = products.filter(
    (product) => product.status === "Active"
  ).length;

  const inactiveCount = products.filter(
    (product) => product.status === "Inactive"
  ).length;

  const statCards = [
    {
      title: "Total Products",
      value: products.length,
      icon: Boxes,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Products",
      value: activeCount,
      icon: CheckCircle,
      iconBg: "bg-[#EFF8E9]",
      iconColor: "text-[#347F19]",
    },
    {
      title: "Inactive Products",
      value: inactiveCount,
      icon: Ban,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  // IMAGE
  const getImage = (product) =>
    product.images?.[0] || product.image || "";

  // CLEAR FILTERS
  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
    setTypeFilter("All");
    setLabelFilter("All");
  };

  const hasActiveFilters =
    search ||
    categoryFilter !== "All" ||
    statusFilter !== "All" ||
    typeFilter !== "All" ||
    labelFilter !== "All";

  // UI
  return (
    <div className="min-h-screen bg-[#F7FAF5] p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Package size={16} />
            <span>Inventory Management</span>
            <span>/</span>
            <span className="font-medium text-[#347F19]">
              Products
            </span>
          </div>

          <h1 className="text-[30px] font-semibold leading-tight text-[#111111]">
            Products Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage, update and organize your frozen food products.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddProduct}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-5 py-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#55B522] active:scale-95"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={fetchData}
            className="text-sm font-semibold text-red-700 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* STATISTICS */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon size={23} className={stat.iconColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PRODUCTS TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* SEARCH AND FILTERS */}
        <div className="space-y-4 border-b border-gray-100 p-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-[#111111]">
                All Products
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                View and manage your product inventory
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 self-start text-xs font-semibold text-[#347F19] hover:underline"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {/* SEARCH */}
            <div className="relative sm:col-span-2 lg:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, SKU, category..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/20"
              />
            </div>

            {/* CATEGORY */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-9 text-sm outline-none focus:border-[#65C92E]"
              >
                <option value="All">All Categories</option>

                {subcategories.map((category) => {
                  const parent = categories.find(
                    (item) => item.id === category.parentCategoryId
                  );

                  return (
                    <option key={category.id} value={category.id}>
                      {parent ? `${parent.name} / ` : ""}
                      {category.name}
                    </option>
                  );
                })}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* STATUS */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-9 text-sm outline-none focus:border-[#65C92E]"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* TYPE */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-9 text-sm outline-none focus:border-[#65C92E]"
              >
                <option value="All">All Types</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* PRODUCT LABEL FILTER - NEW ONLY */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
              <Filter size={14} />
              Product Labels:
            </span>

            {[
              { value: "All", label: "All" },
              { value: "New", label: "New Products" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setLabelFilter(item.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  labelFilter === item.value
                    ? "bg-[#347F19] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-[#EFF8E9] hover:text-[#347F19]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-[#F7FAF5]">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">SKU</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Pack Size</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-14 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#EFF8E9] border-t-[#65C92E]" />

                    <p className="mt-3 text-sm text-gray-500">
                      Loading products...
                    </p>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-[#FAFCF8]"
                  >
                    {/* PRODUCT */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {getImage(product) ? (
                          <img
                            src={getImage(product)}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg border border-gray-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EFF8E9] text-[#347F19]">
                            <ImagePlus size={20} />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-[#111111]">
                            {product.name}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            {product.isNew && (
                              <span className="inline-flex items-center gap-1 rounded bg-[#EFF8E9] px-2 py-0.5 text-[10px] font-bold text-[#347F19]">
                                <Sparkles size={10} />
                                NEW
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.sku || "-"}
                    </td>

                    {/* CATEGORY */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.categoryLabel}
                    </td>

                    {/* PRICE */}
                    <td className="px-5 py-4 text-sm font-semibold text-[#111111]">
                      ₹
                      {product.price.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* TYPE */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
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
                          ? "Veg"
                          : product.type === "non-veg"
                            ? "Non-Veg"
                            : "-"}
                      </span>
                    </td>

                    {/* PACK SIZE */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.packSize || "-"}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.status === "Active"
                            ? "bg-[#EFF8E9] text-[#347F19]"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(product)}
                          title="View Product"
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditProduct(product)}
                          title="Edit Product"
                          className="rounded-lg p-2 text-[#347F19] transition hover:bg-[#EFF8E9]"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteProductItem(product)}
                          title="Delete Product"
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-5 py-14 text-center">
                    <Package
                      size={35}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="font-medium text-gray-600">
                      No products found
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Try changing your search or filter.
                    </p>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-3 text-sm font-semibold text-[#347F19] hover:underline"
                      >
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}
        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* PRODUCT VIEW MODAL */}
      {selectedProduct && (
        <ProductView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={() => {
            const product = selectedProduct;
            setSelectedProduct(null);
            handleEditProduct(product);
          }}
        />
      )}

      {/* DELETE CONFIRMATION */}
      {deleteProductItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#111111]">
                Delete Product
              </h2>

              <button
                type="button"
                onClick={() => setDeleteProductItem(null)}
                disabled={deleting}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#111111]">
                {deleteProductItem.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteProductItem(null)}
                disabled={deleting}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
