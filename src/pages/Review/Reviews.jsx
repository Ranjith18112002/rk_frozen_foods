
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  RefreshCw,
  Star,
} from "lucide-react";

import {
  getReviews,
  updateReviewStatus,
  deleteReview,
} from "../../services/reviewService";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch Reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getReviews();
      setReviews(response.data || []);
    } catch (err) {
      console.error("Fetch Reviews Error:", err);
      setError(
        err.response?.data?.message || "Failed to load customer reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Status Counts
  const pendingCount = reviews.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = reviews.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = reviews.filter(
    (item) => item.status === "Rejected"
  ).length;

  // Search and Filter
  const filteredReviews = useMemo(() => {
    return reviews.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        item.name?.toLowerCase().includes(searchValue) ||
        item.email?.toLowerCase().includes(searchValue) ||
        item.review?.toLowerCase().includes(searchValue);

      const matchesStatus =
        filterStatus === "All" || item.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [reviews, search, filterStatus]);

  // Update Status
  const handleStatusChange = async (id, status) => {
    try {
      await updateReviewStatus(id, status);

      setReviews((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      );
    } catch (err) {
      console.error("Update Review Status Error:", err);
      alert(
        err.response?.data?.message || "Failed to update review status."
      );
    }
  };

  // Delete Review
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    try {
      await deleteReview(id);

      setReviews((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete Review Error:", err);
      alert(err.response?.data?.message || "Failed to delete review.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold text-[#111111] sm:text-3xl">
            Customer Reviews
          </h1>

          <p className="mt-2 text-sm text-[#777078]">
            Manage and review customer feedback from your website.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReviews}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE8D5] bg-white px-5 py-3 text-sm font-semibold text-[#347F19] transition hover:bg-[#EFF8E9] disabled:opacity-50"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>

      </div>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-[#E7EDE3] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#777078]">Total Reviews</p>
              <h2 className="mt-2 text-3xl font-bold text-[#111111]">
                {reviews.length}
              </h2>
            </div>
            <div className="rounded-xl bg-[#EFF8E9] p-3 text-[#347F19]">
              <MessageSquare size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E7EDE3] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#777078]">Pending</p>
              <h2 className="mt-2 text-3xl font-bold text-amber-600">
                {pendingCount}
              </h2>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E7EDE3] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#777078]">Approved</p>
              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {approvedCount}
              </h2>
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CheckCircle size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E7EDE3] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#777078]">Rejected</p>
              <h2 className="mt-2 text-3xl font-bold text-red-600">
                {rejectedCount}
              </h2>
            </div>
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <XCircle size={23} />
            </div>
          </div>
        </div>

      </div>

      {/* Reviews Container */}
      <div className="overflow-hidden rounded-2xl border border-[#E7EDE3] bg-white shadow-sm">

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 border-b border-[#EAEFE7] p-5 md:flex-row md:items-center md:justify-between">

          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or review..."
              className="w-full rounded-xl border border-[#E1E9DC] bg-[#FAFCF8] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                  filterStatus === status
                    ? "bg-[#347F19] text-white"
                    : "border border-[#E1E9DC] bg-white text-[#68756b] hover:bg-[#EFF8E9]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="animate-spin text-[#65C92E]" size={30} />
            <p className="mt-4 text-sm text-[#777078]">
              Loading customer reviews...
            </p>
          </div>
        ) : error ? (
          <div className="px-5 py-16 text-center">
            <p className="font-semibold text-red-600">{error}</p>
            <button
              type="button"
              onClick={fetchReviews}
              className="mt-4 rounded-lg bg-[#347F19] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
            <div className="rounded-full bg-[#EFF8E9] p-5 text-[#347F19]">
              <Star size={30} />
            </div>
            <h3 className="mt-5 font-bold text-[#242124]">
              No Reviews Found
            </h3>
            <p className="mt-2 text-sm text-[#777078]">
              Customer reviews will appear here when submitted.
            </p>
          </div>
        ) : (

          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">

                <thead className="bg-[#F7FAF5]">
                  <tr className="text-xs uppercase tracking-wider text-[#777078]">
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Review</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EDF1E9]">

                  {filteredReviews.map((item) => (
                    <tr key={item._id} className="transition hover:bg-[#FAFCF8]">

                      <td className="px-6 py-5">
                        <p className="font-semibold text-[#242124]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-[#899389]">
                          {item.email}
                        </p>
                      </td>

                      <td className="max-w-md px-6 py-5">
                        <p className="line-clamp-3 text-sm leading-6 text-[#555555]">
                          {item.review}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-sm text-[#777078]">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            statusStyles[item.status] || ""
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">

                          {item.status !== "Approved" && (
                            <button
                              type="button"
                              title="Approve"
                              onClick={() =>
                                handleStatusChange(item._id, "Approved")
                              }
                              className="rounded-lg bg-green-50 p-2.5 text-green-700 transition hover:bg-green-100"
                            >
                              <CheckCircle size={17} />
                            </button>
                          )}

                          {item.status !== "Rejected" && (
                            <button
                              type="button"
                              title="Reject"
                              onClick={() =>
                                handleStatusChange(item._id, "Rejected")
                              }
                              className="rounded-lg bg-amber-50 p-2.5 text-amber-700 transition hover:bg-amber-100"
                            >
                              <XCircle size={17} />
                            </button>
                          )}

                          {item.status !== "Pending" && (
                            <button
                              type="button"
                              title="Set Pending"
                              onClick={() =>
                                handleStatusChange(item._id, "Pending")
                              }
                              className="rounded-lg bg-gray-100 p-2.5 text-gray-600 transition hover:bg-gray-200"
                            >
                              <Clock size={17} />
                            </button>
                          )}

                          <button
                            type="button"
                            title="Delete"
                            onClick={() => handleDelete(item._id)}
                            className="rounded-lg bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 p-4 md:hidden">

              {filteredReviews.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-[#E7EDE3] p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3 className="font-bold text-[#242124]">
                        {item.name}
                      </h3>
                      <p className="mt-1 break-all text-xs text-[#899389]">
                        {item.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
                        statusStyles[item.status] || ""
                      }`}
                    >
                      {item.status}
                    </span>

                  </div>

                  <p className="mt-4 text-sm leading-6 text-[#555555]">
                    {item.review}
                  </p>

                  <p className="mt-3 text-xs text-[#899389]">
                    {formatDate(item.createdAt)}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-[#EDF1E9] pt-4">

                    {item.status !== "Approved" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(item._id, "Approved")
                        }
                        className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700"
                      >
                        <CheckCircle size={15} />
                        Approve
                      </button>
                    )}

                    {item.status !== "Rejected" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(item._id, "Rejected")
                        }
                        className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700"
                      >
                        <XCircle size={15} />
                        Reject
                      </button>
                    )}

                    {item.status !== "Pending" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(item._id, "Pending")
                        }
                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700"
                      >
                        <Clock size={15} />
                        Pending
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>

          </>

        )}

        {/* Footer */}
        {!loading && !error && filteredReviews.length > 0 && (
          <div className="border-t border-[#EAEFE7] px-5 py-4">
            <p className="text-xs text-[#899389]">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default Reviews;
