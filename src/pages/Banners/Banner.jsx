
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Image as ImageIcon,
  CalendarDays,
  Megaphone,
  CheckCircle2,
  Clock3,
  Filter,
} from "lucide-react";

import {
  getBanners,
  deleteBanner as deleteBannerAPI,
} from "../../services/bannerService";

import BannerView from "./BannerView";

const Banner = () => {
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // FETCH ALL BANNERS
  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getBanners();

      setBanners(
        Array.isArray(response?.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error fetching banners:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load banners. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // SEARCH AND STATUS FILTER
  const filteredBanners = useMemo(() => {
    return banners.filter((banner) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        (banner.title || "").toLowerCase().includes(searchValue) ||
        (banner.subtitle || "").toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        banner.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [banners, search, statusFilter]);

  // SUMMARY COUNTS
  const activeCount = banners.filter(
    (banner) => banner.status === "Active"
  ).length;

  const inactiveCount = banners.filter(
    (banner) => banner.status === "Inactive"
  ).length;

  // VIEW BANNER - OPEN MODAL
  const handleView = (banner) => {
    if (!banner) return;
    setSelectedBanner(banner);
  };

  // EDIT BANNER
  const handleEdit = (banner) => {
    if (!banner) return;

    const bannerId = banner._id || banner.id;

    navigate(`/banners/edit/${encodeURIComponent(bannerId)}`, {
      state: { banner },
    });
  };

  // DELETE BANNER API
  const handleDelete = async () => {
    const bannerId = bannerToDelete?._id || bannerToDelete?.id;

    if (!bannerId) return;

    try {
      setIsDeleting(true);

      await deleteBannerAPI(bannerId);

      setBanners((prev) =>
        prev.filter(
          (banner) =>
            (banner._id || banner.id) !== bannerId
        )
      );

      setBannerToDelete(null);
      setSelectedBanner(null);

      alert("Banner deleted successfully!");
    } catch (error) {
      console.error("Error deleting banner:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete banner. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5] p-4 sm:p-6 lg:p-8">

      {/* Page Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-[#111111]">
            Banners
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Dashboard <span className="mx-2">/</span>
            <span className="font-medium text-[#347F19]">
              Banners
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/banners/add")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-5 py-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#58B526] hover:shadow-md"
        >
          <Plus size={18} />
          Add New Banner
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {/* Total */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Banners
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                {banners.length}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Megaphone size={23} />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Banners
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                {activeCount}
              </h2>
            </div>

            <div className="rounded-xl bg-[#EFF8E9] p-3 text-[#347F19]">
              <CheckCircle2 size={23} />
            </div>
          </div>
        </div>

        {/* Inactive */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Inactive Banners
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                {inactiveCount}
              </h2>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock3 size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Banner List */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        {/* Search and Filter */}
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-[#111111]">
              All Banners
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your website promotional banners
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search banners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-[#F7FAF5] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/20 sm:w-60"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-[#F7FAF5] py-2.5 pl-9 pr-9 text-sm text-gray-700 outline-none transition focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/20 sm:w-40"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading / Error / Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#DDF1D1] border-t-[#65C92E]" />

            <p className="mt-4 text-sm font-medium text-gray-500">
              Loading banners...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <p className="font-semibold text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchBanners}
              className="mt-4 rounded-lg bg-[#65C92E] px-5 py-2.5 text-sm font-semibold text-[#111111] transition hover:bg-[#58B526]"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#F7FAF5]">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4">Banner</th>
                    <th className="px-5 py-4">Title</th>
                    <th className="px-5 py-4">Button</th>
                    <th className="px-5 py-4">Created Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredBanners.length > 0 ? (
                    filteredBanners.map((banner) => (
                      <tr
                        key={banner._id || banner.id}
                        className="transition hover:bg-[#FAFCF8]"
                      >

                        {/* Image */}
                        <td className="px-5 py-4">
                          <div className="flex h-16 w-28 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-[#EFF8E9]">
                            {banner.image ? (
                              <img
                                src={banner.image}
                                alt={banner.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <ImageIcon
                                size={25}
                                className="text-[#347F19]"
                              />
                            )}
                          </div>
                        </td>

                        {/* Title */}
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#111111]">
                            {banner.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {banner.subtitle}
                          </p>
                        </td>

                        {/* Button */}
                        <td className="px-5 py-4">
                          <span className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                            {banner.buttonText || "-"}
                          </span>
                        </td>

                        {/* Created Date */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CalendarDays size={15} />
                            {formatDate(banner.createdAt)}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              banner.status === "Active"
                                ? "bg-[#EFF8E9] text-[#347F19]"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {banner.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">

                            {/* View - Modal */}
                            <button
                              type="button"
                              onClick={() => handleView(banner)}
                              title="View Banner"
                              className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                            >
                              <Eye size={17} />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleEdit(banner)}
                              title="Edit Banner"
                              className="rounded-lg bg-[#EFF8E9] p-2 text-[#347F19] transition hover:bg-[#DDF1D1]"
                            >
                              <Pencil size={17} />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setBannerToDelete(banner)}
                              title="Delete Banner"
                              className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 size={17} />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-14 text-center"
                      >
                        <div className="flex flex-col items-center">
                          <div className="mb-3 rounded-full bg-[#EFF8E9] p-4 text-[#347F19]">
                            <ImageIcon size={28} />
                          </div>

                          <p className="font-semibold text-[#111111]">
                            No banners found
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {banners.length === 0
                              ? "Add your first banner to get started."
                              : "Try changing your search or filter."}
                          </p>

                          {banners.length === 0 && (
                            <button
                              type="button"
                              onClick={() => navigate("/banners/add")}
                              className="mt-4 rounded-lg bg-[#65C92E] px-5 py-2.5 text-sm font-semibold text-[#111111] transition hover:bg-[#58B526]"
                            >
                              Add New Banner
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-500">
              Showing {filteredBanners.length} of {banners.length} banners
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={23} />
            </div>

            <h2 className="text-lg font-semibold text-[#111111]">
              Delete Banner?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {bannerToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setBannerToDelete(null)}
                disabled={isDeleting}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete Banner"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BANNER VIEW MODAL */}
      {selectedBanner && (
        <BannerView
          banner={selectedBanner}
          onClose={() => setSelectedBanner(null)}
          onEdit={() => {
            const banner = selectedBanner;
            setSelectedBanner(null);
            handleEdit(banner);
          }}
        />
      )}
    </div>
  );
};

export default Banner;
