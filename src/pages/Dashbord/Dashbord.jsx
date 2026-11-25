
import {
  Package,
  Layers,
  MessageSquare,
  Users,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle,
  ShoppingBasket,
  CalendarDays,
  RefreshCw,
  BarChart3,
  Boxes,
  Activity,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboardService";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboardStats();

      if (!response?.success || !response?.data) {
        throw new Error("Invalid dashboard response");
      }

      setDashboard(response.data);
    } catch (err) {
      console.error("Dashboard API Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const statistics = dashboard?.statistics;
  const enquirySummary = dashboard?.enquirySummary;

  const recentEnquiries = dashboard?.recentEnquiries ?? [];
  const popularProducts = dashboard?.popularProducts ?? [];
  const monthlyEnquiries = dashboard?.monthlyEnquiries ?? [];

  const stats = [
    {
      title: "Total Products",
      value: statistics?.totalProducts ?? 0,
      icon: Package,
      path: "/products",
      description: "Products available",
    },
    {
      title: "Categories",
      value: statistics?.totalCategories ?? 0,
      icon: Layers,
      path: "/categories",
      description: "Product categories",
    },
    {
      title: "Total Enquiries",
      value: statistics?.totalEnquiries ?? 0,
      icon: MessageSquare,
      path: "/enquiries",
      description: "Customer enquiries",
    },
    {
      title: "Customers",
      value: statistics?.totalCustomers ?? 0,
      icon: Users,
      path: "/customers",
      description: "Registered customers",
    },
  ];

  const enquiryCards = [
    {
      title: "New Enquiries",
      value: enquirySummary?.new ?? 0,
      icon: MessageSquare,
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      title: "In Progress",
      value: enquirySummary?.inProgress ?? 0,
      icon: Clock,
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      title: "Replied",
      value: enquirySummary?.replied ?? 0,
      icon: CheckCircle,
      color: "text-[#347F19]",
      bg: "bg-[#EFF8E9]",
    },
    {
      title: "Closed",
      value: enquirySummary?.closed ?? 0,
      icon: CheckCircle,
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
  ];

  const quickActions = [
    {
      title: "Add Product",
      icon: Package,
      path: "/products",
    },
    {
      title: "Manage Categories",
      icon: Layers,
      path: "/categories",
    },
    {
      title: "View Enquiries",
      icon: MessageSquare,
      path: "/enquiries",
    },
    {
      title: "Manage Banners",
      icon: Boxes,
      path: "/banners",
    },
  ];

  const maxEnquiries = Math.max(
    ...popularProducts.map((item) => Number(item.enquiries) || 0),
    1
  );

  const maxMonthlyEnquiries = Math.max(
    ...monthlyEnquiries.map((item) => Number(item.enquiries) || 0),
    1
  );

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

  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700";

      case "In Progress":
        return "bg-amber-50 text-amber-700";

      case "Replied":
        return "bg-[#EFF8E9] text-[#347F19]";

      case "Closed":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen space-y-6 bg-[#F7FAF5]">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-1 rounded-full bg-[#65C92E]" />
            <h1 className="text-2xl font-semibold text-[#111111] sm:text-[30px]">
              Dashboard Overview
            </h1>
          </div>

          <p className="mt-2 text-sm text-[#777078]">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#242124]">
            <CalendarDays size={17} className="text-[#347F19]" />

            {new Date().toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </div>

          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-[#65C92E] px-4 py-3 text-sm font-semibold text-[#111111] transition hover:bg-[#55b525] disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-700">{error}</p>

          <button
            onClick={fetchDashboard}
            className="text-sm font-semibold text-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className="group rounded-2xl border border-gray-100 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#65C92E]/40 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-[#EFF8E9] p-3 text-[#347F19] transition group-hover:bg-[#65C92E] group-hover:text-white">
                  <Icon size={23} />
                </div>

                <ArrowUpRight
                  size={19}
                  className="text-gray-300 transition group-hover:text-[#347F19]"
                />
              </div>

              <h2 className="mt-5 text-[28px] font-semibold text-[#111111]">
                {loading
                  ? "..."
                  : item.value.toLocaleString("en-IN")}
              </h2>

              <p className="mt-1 text-sm font-semibold text-[#242124]">
                {item.title}
              </p>

              <p className="mt-1 text-xs text-[#777078]">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* ENQUIRY OVERVIEW */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#111111]">
            Enquiry Overview
          </h2>

          <p className="mt-1 text-xs text-[#777078]">
            Monitor your customer enquiry activities
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {enquiryCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition hover:shadow-md"
              >
                <div className={`rounded-xl p-3 ${item.bg} ${item.color}`}>
                  <Icon size={23} />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-[#111111]">
                    {loading ? "..." : item.value}
                  </h3>

                  <p className="mt-1 text-sm text-[#777078]">
                    {item.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MONTHLY CHART */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-[#EFF8E9] p-3 text-[#347F19]">
            <BarChart3 size={23} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#111111]">
              Monthly Enquiries
            </h2>

            <p className="mt-1 text-xs text-[#777078]">
              Last 6 months customer enquiry overview
            </p>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-gray-500">
            Loading monthly enquiries...
          </p>
        ) : monthlyEnquiries.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">
            No monthly enquiry data available
          </p>
        ) : (
          <div className="flex h-60 items-end justify-between gap-2 sm:gap-5">
            {monthlyEnquiries.map((item, index) => {
              const value = Number(item.enquiries) || 0;

              const height =
                value === 0
                  ? 2
                  : Math.max(
                      (value / maxMonthlyEnquiries) * 100,
                      5
                    );

              return (
                <div
                  key={`${item.year}-${item.month}-${index}`}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs font-semibold text-[#347F19]">
                    {value}
                  </span>

                  <div className="flex h-44 w-full items-end justify-center rounded-t-lg bg-[#F7FAF5]">
                    <div
                      className="w-full max-w-12 rounded-t-lg bg-[#65C92E] transition-all duration-700 hover:bg-[#347F19]"
                      style={{ height: `${height}%` }}
                      title={`${item.month} ${item.year}: ${value} enquiries`}
                    />
                  </div>

                  <span className="text-xs text-[#777078]">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* RECENT ENQUIRIES */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-[#111111]">
              Recent Enquiries
            </h2>

            <p className="mt-1 text-xs text-[#777078]">
              Latest customer product enquiries
            </p>
          </div>

          <button
            onClick={() => navigate("/enquiries")}
            className="flex items-center gap-1 text-sm font-semibold text-[#347F19] hover:text-[#65C92E]"
          >
            View All
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-[#F7FAF5]">
              <tr className="text-xs uppercase tracking-wide text-[#777078]">
                <th className="px-5 py-4 font-semibold">Enquiry ID</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Product</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-sm text-gray-500">
                    Loading enquiries...
                  </td>
                </tr>
              ) : recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-sm text-gray-500">
                    No enquiries found
                  </td>
                </tr>
              ) : (
                recentEnquiries.map((item) => (
                  <tr
                    key={item._id}
                    className="text-sm transition hover:bg-[#F7FAF5]"
                  >
                    <td className="px-5 py-4 font-semibold text-[#347F19]">
                      {item._id?.slice(0, 8) || "-"}
                    </td>

                    <td className="px-5 py-4 font-medium text-[#242124]">
                      {item.name || "-"}
                    </td>

                    <td className="px-5 py-4 text-[#777078]">
                      {item.product || "-"}
                    </td>

                    <td className="px-5 py-4 text-[#777078]">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(item.status)}`}>
                        {item.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* POPULAR PRODUCTS + ADDITIONAL INFO */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* POPULAR PRODUCTS */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-[#EFF8E9] p-3 text-[#347F19]">
              <ShoppingBasket size={23} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#111111]">
                Popular Products
              </h2>

              <p className="mt-1 text-xs text-[#777078]">
                Products receiving the most enquiries
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <p className="text-sm text-gray-500">
                Loading popular products...
              </p>
            ) : popularProducts.length === 0 ? (
              <p className="text-sm text-gray-500">
                No product enquiries found
              </p>
            ) : (
              popularProducts.map((product, index) => {
                const count = Number(product.enquiries) || 0;

                return (
                  <div key={product._id || index}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-[#242124]">
                        {product._id || "Unknown Product"}
                      </p>

                      <p className="whitespace-nowrap text-xs font-semibold text-[#347F19]">
                        {count} Enquiries
                      </p>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-[#EFF8E9]">
                      <div
                        className="h-full rounded-full bg-[#65C92E] transition-all duration-700"
                        style={{
                          width: `${Math.min(
                            (count / maxEnquiries) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ADDITIONAL INFORMATION */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-[#EFF8E9] p-3 text-[#347F19]">
              <Activity size={23} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#111111]">
                Additional Information
              </h2>

              <p className="mt-1 text-xs text-[#777078]">
                More details about your products
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#F7FAF5] p-5">
              <div className="mb-3 flex items-center justify-between">
                <Package size={21} className="text-[#347F19]" />
                <TrendingUp size={17} className="text-[#65C92E]" />
              </div>

              <p className="text-sm text-[#777078]">
                Active Products
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-[#111111]">
                {loading ? "..." : statistics?.activeProducts ?? 0}
              </h3>
            </div>

            <div className="rounded-xl bg-[#F7FAF5] p-5">
              <div className="mb-3 flex items-center justify-between">
                <Layers size={21} className="text-[#347F19]" />
                <TrendingUp size={17} className="text-[#65C92E]" />
              </div>

              <p className="text-sm text-[#777078]">
                Subcategories
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-[#111111]">
                {loading ? "..." : statistics?.totalSubcategories ?? 0}
              </h3>
            </div>
          </div>
        </section>
      </div>

      {/* QUICK ACTIONS */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-[#111111]">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-[#777078]">
            Quickly access your admin management pages
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="group flex items-center justify-between rounded-xl border border-gray-100 bg-[#F7FAF5] p-4 text-left transition-all hover:border-[#65C92E]/50 hover:bg-[#EFF8E9]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white p-2.5 text-[#347F19] transition group-hover:bg-[#65C92E] group-hover:text-white">
                    <Icon size={20} />
                  </div>

                  <span className="text-sm font-semibold text-[#242124]">
                    {action.title}
                  </span>
                </div>

                <ArrowUpRight
                  size={17}
                  className="text-[#347F19]"
                />
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
