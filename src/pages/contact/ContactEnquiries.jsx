
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  MessageSquare,
  Phone,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Send,
  CalendarDays,
} from "lucide-react";

import {
  getContactEnquiries,
  updateContactEnquiryStatus,
  deleteContactEnquiry,
} from "../../services/contactEnquiryService";

const statusOptions = ["New", "In Progress", "Replied", "Closed"];

const statusStyles = {
  New: "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Replied: "bg-[#EFF8E9] text-[#347F19]",
  Closed: "bg-gray-100 text-gray-600",
};

const ContactEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch enquiries
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getContactEnquiries();

      const data =
        response?.data?.data ??
        response?.data ??
        response;

      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Contact enquiry fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load contact enquiries. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Statistics
  const stats = useMemo(() => ({
    total: enquiries.length,
    new: enquiries.filter((item) => item.status === "New").length,
    inProgress: enquiries.filter(
      (item) => item.status === "In Progress"
    ).length,
    replied: enquiries.filter(
      (item) => item.status === "Replied"
    ).length,
    closed: enquiries.filter(
      (item) => item.status === "Closed"
    ).length,
  }), [enquiries]);

  // Search and filter
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch = [
        item.fullName,
        item.phoneNumber,
        item.message,
      ].some((value) =>
        String(value || "").toLowerCase().includes(searchText)
      );

      const matchesStatus =
        selectedStatus === "All" ||
        item.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [enquiries, search, selectedStatus]);

  // Update status
  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);

      const response = await updateContactEnquiryStatus(id, status);

      const updatedEnquiry =
        response?.data?.data ??
        response?.data;

      if (!updatedEnquiry) {
        throw new Error("Invalid server response");
      }

      setEnquiries((previous) =>
        previous.map((item) =>
          item._id === id ? updatedEnquiry : item
        )
      );

      setSelectedEnquiry((previous) =>
        previous?._id === id ? updatedEnquiry : previous
      );
    } catch (err) {
      console.error("Status update error:", err);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Unable to update enquiry status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete enquiry
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact enquiry?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteContactEnquiry(id);

      setEnquiries((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setSelectedEnquiry((previous) =>
        previous?._id === id ? null : previous
      );

      alert("Contact enquiry deleted successfully!");
    } catch (err) {
      console.error("Delete enquiry error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to delete contact enquiry."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Statistics cards
  const statCards = [
    {
      title: "Total Enquiries",
      value: stats.total,
      icon: MessageSquare,
      iconBg: "bg-[#EFF8E9]",
      iconColor: "text-[#347F19]",
    },
    {
      title: "New Enquiries",
      value: stats.new,
      icon: AlertCircle,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Replied",
      value: stats.replied,
      icon: CheckCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Closed",
      value: stats.closed,
      icon: XCircle,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAF5] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[36px] font-semibold leading-tight text-[#111111]">
            Contact Enquiries
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage and respond to customer contact enquiries.
          </p>

          <p className="mt-2 text-xs text-[#347F19]">
            Dashboard / Contact Enquiries
          </p>
        </div>

        <button
          type="button"
          onClick={fetchEnquiries}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-5 py-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#55B522] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Enquiries
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={fetchEnquiries}
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

      {/* Enquiry Section */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-[#111111]">
                All Contact Enquiries
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View customer messages and manage enquiry status.
              </p>
            </div>

            <span className="rounded-lg bg-[#EFF8E9] px-3 py-2 text-xs font-semibold text-[#347F19]">
              {filteredEnquiries.length} Results
            </span>
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone or message..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/20"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#65C92E] lg:w-48"
            >
              <option value="All">All Status</option>

              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#EFF8E9] border-t-[#65C92E]" />

            <p className="mt-3 text-sm text-gray-500">
              Loading contact enquiries...
            </p>
          </div>
        ) : filteredEnquiries.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAFCF8] text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Phone Number</th>
                    <th className="px-5 py-4">Message</th>
                    <th className="px-5 py-4">Submitted Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredEnquiries.map((item) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-[#FAFCF8]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF8E9] text-[#347F19]">
                            <User size={17} />
                          </div>

                          <span className="font-semibold text-[#242124]">
                            {item.fullName}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <a
                          href={`tel:${item.phoneNumber}`}
                          className="inline-flex items-center gap-2 text-gray-600 transition hover:text-[#347F19]"
                        >
                          <Phone size={15} />
                          {item.phoneNumber}
                        </a>
                      </td>

                      <td className="max-w-xs px-5 py-4 text-gray-600">
                        <p className="line-clamp-2">
                          {item.message}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={item.status}
                          disabled={updatingId === item._id}
                          onChange={(e) =>
                            handleStatusChange(
                              item._id,
                              e.target.value
                            )
                          }
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${statusStyles[item.status] || "bg-gray-100 text-gray-700"}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        {updatingId === item._id && (
                          <Loader2
                            size={13}
                            className="ml-2 inline animate-spin text-[#347F19]"
                          />
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedEnquiry(item)}
                            title="View Enquiry"
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item._id)}
                            disabled={deletingId === item._id}
                            title="Delete Enquiry"
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === item._id ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 p-4 md:hidden">
              {filteredEnquiries.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-gray-100 bg-white p-4 transition hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFF8E9] text-[#347F19]">
                        <User size={19} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-[#111111]">
                          {item.fullName}
                        </h3>

                        <a
                          href={`tel:${item.phoneNumber}`}
                          className="mt-1 flex items-center gap-1.5 text-sm text-gray-500"
                        >
                          <Phone size={13} />
                          {item.phoneNumber}
                        </a>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[item.status] || "bg-gray-100 text-gray-700"}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                    {item.message}
                  </p>

                  <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                    <CalendarDays size={13} />
                    {formatDate(item.createdAt)}
                  </p>

                  <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                    <select
                      value={item.status}
                      disabled={updatingId === item._id}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                      className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#65C92E]"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setSelectedEnquiry(item)}
                      title="View Enquiry"
                      className="rounded-lg p-2.5 text-blue-600 transition hover:bg-blue-50"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      title="Delete Enquiry"
                      className="rounded-lg p-2.5 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === item._id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="px-5 py-16 text-center">
            <MessageSquare
              size={42}
              className="mx-auto mb-3 text-gray-300"
            />

            <h3 className="font-semibold text-gray-600">
              No contact enquiries found
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Try changing your search or status filter.
            </p>

            {enquiries.length === 0 && (
              <button
                type="button"
                onClick={fetchEnquiries}
                className="mt-4 rounded-lg bg-[#65C92E] px-4 py-2 text-sm font-semibold text-[#111111] transition hover:bg-[#55B522]"
              >
                <RefreshCw size={15} className="mr-1 inline" />
                Refresh Enquiries
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredEnquiries.length} of {enquiries.length} Enquiries
          </span>

          <span>
            {stats.new} New · {stats.inProgress} In Progress · {stats.replied} Replied · {stats.closed} Closed
          </span>
        </div>
      </div>

      {/* View Enquiry Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-xl font-semibold text-[#111111]">
                  Contact Enquiry Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  View customer enquiry information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-5 p-5">

              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
                  Full Name
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF8E9] text-[#347F19]">
                    <User size={19} />
                  </div>

                  <p className="font-semibold text-[#242124]">
                    {selectedEnquiry.fullName}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
                  Phone Number
                </p>

                <a
                  href={`tel:${selectedEnquiry.phoneNumber}`}
                  className="inline-flex items-center gap-2 font-medium text-[#347F19] hover:underline"
                >
                  <Phone size={17} />
                  {selectedEnquiry.phoneNumber}
                </a>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
                  Customer Message
                </p>

                <div className="rounded-xl border border-gray-100 bg-[#FAFCF8] p-4 text-sm leading-7 text-gray-700">
                  <MessageSquare
                    size={17}
                    className="mb-2 text-[#347F19]"
                  />

                  <p className="whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
                  Submitted On
                </p>

                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays size={16} className="text-[#347F19]" />
                  {formatDate(selectedEnquiry.createdAt)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
                  Update Enquiry Status
                </p>

                <select
                  value={selectedEnquiry.status}
                  disabled={updatingId === selectedEnquiry._id}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedEnquiry._id,
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/20"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 p-5">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="w-full rounded-lg bg-[#65C92E] px-4 py-3 text-sm font-semibold text-[#111111] transition hover:bg-[#55B522] active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactEnquiries;
