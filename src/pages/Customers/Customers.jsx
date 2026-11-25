
import { useMemo, useState } from "react";
import {
  Users,
  Search,
  Eye,
  Trash2,
  X,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ShoppingBag,
  IndianRupee,
  UserCheck,
  UserX,
  Filter,
  ChevronDown,
  Inbox,
  RefreshCw,
} from "lucide-react";

const initialCustomers = [
  {
    id: "CUS-1001",
    name: "Arun Kumar",
    email: "arun@gmail.com",
    phone: "+91 98765 43210",
    company: "Arun Traders",
    location: "Chennai, Tamil Nadu",
    joined: "2026-10-10",
    orders: 12,
    totalSpent: 48500,
    status: "Active",
    address: "Anna Nagar, Chennai, Tamil Nadu",
  },
  {
    id: "CUS-1002",
    name: "Priya Stores",
    email: "priyastores@gmail.com",
    phone: "+91 98765 12345",
    company: "Priya Supermarket",
    location: "Coimbatore, Tamil Nadu",
    joined: "2026-09-18",
    orders: 8,
    totalSpent: 32700,
    status: "Active",
    address: "Gandhipuram, Coimbatore, Tamil Nadu",
  },
  {
    id: "CUS-1003",
    name: "Rahul Enterprises",
    email: "rahul@gmail.com",
    phone: "+91 91234 56789",
    company: "Rahul Enterprises",
    location: "Bangalore, Karnataka",
    joined: "2026-08-25",
    orders: 5,
    totalSpent: 21900,
    status: "Active",
    address: "Whitefield, Bangalore, Karnataka",
  },
  {
    id: "CUS-1004",
    name: "Karthik",
    email: "karthik@gmail.com",
    phone: "+91 99887 66554",
    company: "Karthik Foods",
    location: "Madurai, Tamil Nadu",
    joined: "2026-07-12",
    orders: 2,
    totalSpent: 8400,
    status: "Inactive",
    address: "KK Nagar, Madurai, Tamil Nadu",
  },
  {
    id: "CUS-1005",
    name: "Meena Foods",
    email: "meena@gmail.com",
    phone: "+91 90000 11122",
    company: "Meena Foods",
    location: "Salem, Tamil Nadu",
    joined: "2026-10-28",
    orders: 15,
    totalSpent: 62500,
    status: "Active",
    address: "Fairlands, Salem, Tamil Nadu",
  },
  {
    id: "CUS-1006",
    name: "Suresh Kumar",
    email: "suresh@gmail.com",
    phone: "+91 94444 22211",
    company: "Suresh Wholesale",
    location: "Trichy, Tamil Nadu",
    joined: "2026-06-05",
    orders: 0,
    totalSpent: 0,
    status: "Inactive",
    address: "Thillai Nagar, Trichy, Tamil Nadu",
  },
];

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteCustomer, setDeleteCustomer] = useState(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch = [
        customer.id,
        customer.name,
        customer.email,
        customer.phone,
        customer.company,
        customer.location,
      ].some((value) =>
        String(value || "").toLowerCase().includes(searchText)
      );

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const totalSpent = customers.reduce(
    (total, customer) => total + customer.totalSpent,
    0
  );

  const stats = [
    {
      label: "Total Customers",
      value: customers.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Customers",
      value: customers.filter((item) => item.status === "Active").length,
      icon: UserCheck,
      color: "bg-[#EFF8E9] text-[#347F19]",
    },
    {
      label: "Inactive Customers",
      value: customers.filter((item) => item.status === "Inactive").length,
      icon: UserX,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalSpent),
      icon: IndianRupee,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const handleStatusChange = (id, status) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id ? { ...customer, status } : customer
      )
    );

    setSelectedCustomer((prev) =>
      prev?.id === id ? { ...prev, status } : prev
    );
  };

  const handleDelete = () => {
    if (!deleteCustomer) return;

    setCustomers((prev) =>
      prev.filter((customer) => customer.id !== deleteCustomer.id)
    );

    setDeleteCustomer(null);
    setSelectedCustomer(null);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  return (
    <div className="min-h-screen space-y-6 bg-[#F7FAF5] p-4 sm:p-6 lg:p-8">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Dashboard</span>
            <span>/</span>
            <span className="font-medium text-[#347F19]">
              Customers
            </span>
          </div>

          <h1 className="mt-3 text-[30px] font-semibold leading-tight text-[#111111]">
            Customers
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your customer profiles and purchase information.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#D9EDCC] bg-white px-4 py-3 text-sm font-semibold text-[#347F19] shadow-sm">
          <Users size={19} />
          Customer Management
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {item.label}
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold text-[#111111]">
                    {item.value}
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

      {/* Customer Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        {/* Table Header */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#111111]">
              All Customers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage registered customers.
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
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/20 sm:w-64"
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
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none transition focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/20 sm:w-40"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-[#F7FAF5] text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Contact</th>
                <th className="px-5 py-4 font-semibold">Orders</th>
                <th className="px-5 py-4 font-semibold">Total Spent</th>
                <th className="px-5 py-4 font-semibold">Joined Date</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition hover:bg-[#FAFCF8]"
                >
                  {/* Customer */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF8E9] font-semibold text-[#347F19]">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-[#111111]">
                          {customer.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {customer.company}
                        </p>

                        <p className="mt-1 text-xs font-medium text-[#347F19]">
                          {customer.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4">
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail size={14} className="text-gray-400" />
                      {customer.email}
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <Phone size={13} className="text-gray-400" />
                      {customer.phone}
                    </p>
                  </td>

                  {/* Orders */}
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                      {customer.orders}
                    </span>
                  </td>

                  {/* Total Spent */}
                  <td className="px-5 py-4 text-sm font-semibold text-gray-700">
                    {formatCurrency(customer.totalSpent)}
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {formatDate(customer.joined)}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        customer.status === "Active"
                          ? "border-[#D9EDCC] bg-[#EFF8E9] text-[#347F19]"
                          : "border-gray-200 bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
                      {customer.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(customer)}
                        title="View customer"
                        className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteCustomer(customer)}
                        title="Delete customer"
                        className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center">
                    <Inbox size={42} className="mx-auto text-gray-300" />

                    <p className="mt-3 font-semibold text-gray-700">
                      No customers found
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
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredCustomers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {customers.length}
            </span>{" "}
            customers
          </p>

          <p className="text-xs text-gray-400">
            RK Enterprises Admin Panel
          </p>
        </div>
      </div>

      {/* Customer View Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-[#111111]">
                  Customer Details
                </h2>

                <p className="mt-1 text-xs font-medium text-[#347F19]">
                  {selectedCustomer.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            <div className="space-y-6 p-6">

              {/* Profile */}
              <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-[#F7FAF5] p-6 text-center sm:flex-row sm:text-left">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFF8E9] text-3xl font-semibold text-[#347F19]">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>

                <div className="mt-4 sm:ml-5 sm:mt-0">
                  <h3 className="text-xl font-semibold text-[#111111]">
                    {selectedCustomer.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {selectedCustomer.company}
                  </p>

                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedCustomer.status === "Active"
                        ? "bg-[#EFF8E9] text-[#347F19]"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {selectedCustomer.status}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-[#111111]">
                  Contact Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-100 bg-[#FAFCF8] p-4">
                    <p className="text-xs text-gray-400">Email Address</p>

                    <p className="mt-2 flex items-center gap-2 break-all text-sm font-medium text-gray-700">
                      <Mail size={16} className="shrink-0 text-[#347F19]" />
                      {selectedCustomer.email}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-[#FAFCF8] p-4">
                    <p className="text-xs text-gray-400">Phone Number</p>

                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone size={16} className="text-[#347F19]" />
                      {selectedCustomer.phone}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-[#FAFCF8] p-4 sm:col-span-2">
                    <p className="text-xs text-gray-400">Address</p>

                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin size={16} className="shrink-0 text-[#347F19]" />
                      {selectedCustomer.address}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-[#FAFCF8] p-4">
                    <p className="text-xs text-gray-400">Joined Date</p>

                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <CalendarDays size={16} className="text-[#347F19]" />
                      {formatDate(selectedCustomer.joined)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-[#FAFCF8] p-4">
                    <p className="text-xs text-gray-400">Location</p>

                    <p className="mt-2 text-sm font-medium text-gray-700">
                      {selectedCustomer.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchase Summary */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-[#111111]">
                  Purchase Summary
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                    <ShoppingBag size={22} className="text-blue-600" />

                    <p className="mt-3 text-sm text-gray-500">
                      Total Orders
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-[#111111]">
                      {selectedCustomer.orders}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#D9EDCC] bg-[#EFF8E9] p-5">
                    <IndianRupee size={22} className="text-[#347F19]" />

                    <p className="mt-3 text-sm text-gray-500">
                      Total Spent
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-[#111111]">
                      {formatCurrency(selectedCustomer.totalSpent)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <label className="text-sm font-semibold text-[#111111]">
                  Customer Status
                </label>

                <select
                  value={selectedCustomer.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedCustomer.id,
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/20"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg bg-[#65C92E] px-6 py-2.5 text-sm font-semibold text-[#111111] transition hover:bg-[#55B522]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteCustomer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={25} />
            </div>

            <h2 className="mt-4 text-center text-xl font-semibold text-[#111111]">
              Delete Customer?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <strong className="text-gray-700">
                {deleteCustomer.name}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteCustomer(null)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
