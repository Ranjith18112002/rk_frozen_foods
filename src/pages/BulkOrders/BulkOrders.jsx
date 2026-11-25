
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Search,
  Eye,
  Trash2,
  X,
  MapPin,
  ChevronDown,
  Inbox,
  RefreshCw,
  Clock3,
  Building2,
  AlertCircle,
  CheckCircle,
  Filter,
} from "lucide-react";

import {
  getBulkOrders,
  deleteBulkOrder,
} from "../../services/bulkOrderService";

const statusStyles = {
  New: "bg-blue-50 text-blue-700 border-blue-100",
  "In Progress": "bg-amber-50 text-amber-700 border-amber-100",
  Replied: "bg-[#EFF8E9] text-[#347F19] border-[#D9EDCC]",
  Closed: "bg-gray-100 text-gray-600 border-gray-200",
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getResponseData = (response) =>
  response?.data?.data ?? response?.data ?? response;

const BulkOrders = () => {
  const navigate = useNavigate();

  const [bulkOrders, setBulkOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedDeleteOrder, setSelectedDeleteOrder] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // FETCH BULK ORDERS
  const fetchBulkOrders = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getBulkOrders();
      const data = getResponseData(response);

      const orderList = Array.isArray(data)
        ? data
        : Array.isArray(data?.bulkOrders)
          ? data.bulkOrders
          : [];

      setBulkOrders(orderList);
    } catch (err) {
      console.error("Fetch Bulk Orders Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load bulk orders. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBulkOrders();
  }, []);

  // SEARCH AND FILTER
  const filteredOrders = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return bulkOrders.filter((item) => {
      const matchesSearch = [
        item._id,
        item.name,
        item.email,
        item.phone,
        item.city,
        item.source,
      ].some((value) =>
        String(value || "").toLowerCase().includes(searchText)
      );

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bulkOrders, search, statusFilter]);

  // SUMMARY CARDS
  const stats = [
    {
      label: "Total Bulk Orders",
      value: bulkOrders.length,
      icon: MessageSquare,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "New Requests",
      value: bulkOrders.filter((item) => item.status === "New").length,
      icon: AlertCircle,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "In Progress",
      value: bulkOrders.filter((item) => item.status === "In Progress").length,
      icon: Clock3,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Replied",
      value: bulkOrders.filter((item) => item.status === "Replied").length,
      icon: CheckCircle,
      color: "bg-[#EFF8E9] text-[#347F19]",
    },
  ];

  // DELETE BULK ORDER
  const handleDelete = async () => {
    if (!selectedDeleteOrder || isDeleting) return;

    const orderId = selectedDeleteOrder._id;

    try {
      setIsDeleting(true);
      setError("");

      await deleteBulkOrder(orderId);

      setBulkOrders((prev) =>
        prev.filter((item) => item._id !== orderId)
      );

      setSelectedDeleteOrder(null);
    } catch (err) {
      console.error("Delete Bulk Order Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete bulk order."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // RESET FILTERS
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  return (
    <div className="min-h-screen space-y-6 bg-[#F7FAF5] p-4 sm:p-6 lg:p-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Dashboard</span>
            <span>/</span>
            <span className="font-medium text-[#347F19]">Bulk Order</span>
          </div>

          <h1 className="mt-3 text-[30px] font-semibold leading-tight text-[#111111]">
            Bulk Order
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage and track all bulk order enquiries.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#D9EDCC] bg-white px-4 py-3 text-sm font-semibold text-[#347F19] shadow-sm">
          <Building2 size={19} />
          Bulk Orders
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchBulkOrders}
            className="shrink-0 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {item.label}
                  </p>

                  <h2 className="mt-3 text-3xl font-semibold text-[#111111]">
                    {isLoading ? "..." : item.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${item.color}`}>
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        {/* TABLE HEADER */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#111111]">
              All Bulk Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Customer details and bulk order request status.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* SEARCH */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search bulk orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/20 sm:w-64"
              />
            </div>

            {/* STATUS FILTER */}
            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none transition focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/20 sm:w-44"
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Replied">Replied</option>
                <option value="Closed">Closed</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-[#F7FAF5] text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Phone</th>
                <th className="px-5 py-4 font-semibold">City</th>
                <th className="px-5 py-4 font-semibold">Source</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center">
                    <RefreshCw
                      size={30}
                      className="mx-auto animate-spin text-[#65C92E]"
                    />

                    <p className="mt-3 text-sm text-gray-500">
                      Loading bulk orders...
                    </p>
                  </td>
                </tr>
              ) : (
                <>
                  {filteredOrders.map((item) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-[#FAFCF8]"
                    >
                      {/* CUSTOMER */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF8E9] font-semibold text-[#347F19]">
                            {item.name?.charAt(0).toUpperCase() || "?"}
                          </div>

                          <div>
                            <p className="font-semibold text-[#111111]">
                              {item.name || "N/A"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {item.email || "N/A"}
                            </p>

                            <p className="mt-1 text-xs font-medium text-[#347F19]">
                              {item._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* PHONE */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.phone || "N/A"}
                      </td>

                      {/* CITY */}
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={15} className="text-[#347F19]" />
                          {item.city || "N/A"}
                        </span>
                      </td>

                      {/* SOURCE */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.source || "N/A"}
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            statusStyles[item.status] || statusStyles.New
                          }`}
                        >
                          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
                          {item.status || "New"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/bulk-orders/view/${item._id}`)
                            }
                            title="View bulk order"
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedDeleteOrder(item)}
                            title="Delete bulk order"
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* EMPTY STATE */}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-5 py-16 text-center">
                        <Inbox
                          size={42}
                          className="mx-auto text-gray-300"
                        />

                        <p className="mt-3 font-semibold text-gray-700">
                          No bulk orders found
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                          Try changing your search or status filter.
                        </p>

                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#347F19] hover:underline"
                        >
                          <RefreshCw size={15} />
                          Reset Filters
                        </button>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}
        <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {bulkOrders.length}
            </span>{" "}
            bulk orders
          </p>

          <p className="text-xs text-gray-400">
            RK Enterprises Admin Panel
          </p>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {selectedDeleteOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={25} />
            </div>

            <h2 className="mt-4 text-center text-xl font-semibold text-[#111111]">
              Delete Bulk Order?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-gray-500">
              Are you sure you want to delete the bulk order from{" "}
              <strong className="text-gray-700">
                {selectedDeleteOrder.name}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setSelectedDeleteOrder(null)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOrders;
