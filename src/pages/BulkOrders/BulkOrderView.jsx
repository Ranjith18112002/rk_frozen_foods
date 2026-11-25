
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Calendar,
  Building2,
  LoaderCircle,
  Save,
} from "lucide-react";

import {
  getBulkOrderById,
  updateBulkOrderStatus,
} from "../../services/bulkOrderService";

const getResponseData = (response) =>
  response?.data?.data ?? response?.data ?? response;

const BulkOrderView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("New");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getBulkOrderById(id);
        const data = getResponseData(response);

        if (!data || !data._id) {
          throw new Error("Bulk order details not found");
        }

        setOrder(data);
        setStatus(data.status || "New");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load bulk order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      setSaving(true);

      const response = await updateBulkOrderStatus(id, status);
      const updatedOrder = getResponseData(response);

      if (updatedOrder?._id) {
        setOrder((prev) => ({ ...prev, ...updatedOrder }));
      } else {
        setOrder((prev) => ({ ...prev, status }));
      }

      alert("Bulk order status updated successfully");
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update status"
      );
    } finally {
      setSaving(false);
    }
  };

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

  const statusColors = {
    New: "bg-blue-50 text-blue-700",
    "In Progress": "bg-yellow-50 text-yellow-700",
    Replied: "bg-purple-50 text-purple-700",
    Closed: "bg-gray-100 text-gray-700",
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#65C92E]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">
          {error || "Bulk order not found"}
        </p>
        <button
          onClick={() => navigate("/bulk-orders")}
          className="mt-4 rounded-lg bg-[#347F19] px-5 py-2 text-white"
        >
          Back to Bulk Orders
        </button>
      </div>
    );
  }

  const detailItems = [
    {
      label: "Customer Name",
      value: order.name,
      icon: User,
    },
    {
      label: "Email Address",
      value: order.email,
      icon: Mail,
    },
    {
      label: "Phone Number",
      value: order.phone,
      icon: Phone,
    },
    {
      label: "City",
      value: order.city || "-",
      icon: MapPin,
    },
    {
      label: "How Did You Hear About Us?",
      value: order.source || "-",
      icon: Building2,
    },
    {
      label: "Submitted Date",
      value: formatDate(order.createdAt),
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => navigate("/bulk-orders")}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-[#777078] hover:text-[#347F19]"
          >
            <ArrowLeft size={17} />
            Back to Bulk Orders
          </button>

          <h1 className="text-2xl font-bold text-[#242124]">
            Bulk Order Details
          </h1>
          <p className="mt-1 text-sm text-[#777078]">
            View customer enquiry and manage order status.
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
            statusColors[order.status] || statusColors.New
          }`}
        >
          {order.status || "New"}
        </span>
      </div>

      {/* Customer Details */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-5 text-lg font-bold text-[#242124]">
          Customer Information
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {detailItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFF8E9] text-[#347F19]">
                  <Icon size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#777078]">
                    {item.label}
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#242124]">
                    {item.value || "-"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF8E9] text-[#347F19]">
            <MessageSquare size={19} />
          </div>

          <h2 className="text-lg font-bold text-[#242124]">
            Customer Message
          </h2>
        </div>

        <div className="min-h-24 rounded-lg bg-[#F7FAF5] p-4">
          <p className="whitespace-pre-wrap text-sm leading-7 text-[#555]">
            {order.message || "No message provided."}
          </p>
        </div>
      </div>

      {/* Status Update */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-[#242124]">
          Update Enquiry Status
        </h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-[#555]">
              Select Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/20"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Replied">Replied</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <button
            onClick={handleStatusUpdate}
            disabled={saving || status === order.status}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#347F19] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#286314] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}
            {saving ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderView;
