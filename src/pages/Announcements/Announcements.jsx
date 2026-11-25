
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Megaphone,
  Tag,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

import {
  getAnnouncements,
  deleteAnnouncement,
} from "../../services/announcementService";

const Announcements = () => {
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAnnouncements();

      const data =
        response?.data?.data ??
        response?.data ??
        response;

      setAnnouncements(
        Array.isArray(data)
          ? data
          : data?.announcements || []
      );
    } catch (err) {
      console.error("FETCH ANNOUNCEMENTS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load announcements. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Delete announcement
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAnnouncement(id);

      setAnnouncements((prev) =>
        prev.filter((item) => item._id !== id)
      );

      alert("Announcement deleted successfully!");
    } catch (err) {
      console.error("DELETE ANNOUNCEMENT ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete announcement."
      );
    }
  };

  // Search filter
  const filteredAnnouncements = announcements.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.title?.toLowerCase().includes(searchText) ||
      item.offer?.toLowerCase().includes(searchText) ||
      item.buttonText?.toLowerCase().includes(searchText) ||
      item.buttonLink?.toLowerCase().includes(searchText)
    );
  });

  // Statistics
  const activeCount = announcements.filter(
    (item) => item.status === "Active"
  ).length;

  const inactiveCount = announcements.length - activeCount;

  const cardClass =
    "rounded-xl border border-gray-100 bg-white p-5 shadow-sm";

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold leading-tight text-[#111111]">
            Announcements
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your website promotional announcements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/announcements/add")}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-5 py-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#58B925]"
        >
          <Plus size={19} />
          Add Announcement
        </button>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Total */}
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Announcements
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#111111]">
                {announcements.length}
              </h2>
            </div>

            <div className="rounded-xl bg-[#EFF8E9] p-3 text-[#347F19]">
              <Megaphone size={23} />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Announcements
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#347F19]">
                {activeCount}
              </h2>
            </div>

            <div className="rounded-xl bg-[#EFF8E9] p-3 text-[#347F19]">
              <CheckCircle size={23} />
            </div>
          </div>
        </div>

        {/* Inactive */}
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Inactive Announcements
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-500">
                {inactiveCount}
              </h2>
            </div>

            <div className="rounded-xl bg-gray-100 p-3 text-gray-500">
              <XCircle size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* ANNOUNCEMENT LIST */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        {/* TABLE HEADER */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#111111]">
              All Announcements
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage your promotional announcements.
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-3 transition focus-within:border-[#65C92E] sm:w-72">
            <Search size={18} className="shrink-0 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full bg-transparent text-sm text-[#111111] outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center">
            <RefreshCw
              size={30}
              className="animate-spin text-[#65C92E]"
            />

            <p className="mt-3 text-sm text-gray-500">
              Loading announcements...
            </p>
          </div>

        ) : error ? (

          /* ERROR */
          <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">
            <div className="rounded-full bg-red-50 p-3 text-red-500">
              <AlertCircle size={28} />
            </div>

            <p className="mt-3 text-sm font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchAnnouncements}
              className="mt-4 rounded-lg bg-[#65C92E] px-5 py-2.5 text-sm font-semibold text-[#111111] transition hover:bg-[#58B925]"
            >
              Try Again
            </button>
          </div>

        ) : filteredAnnouncements.length === 0 ? (

          /* EMPTY STATE */
          <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">
            <div className="rounded-full bg-[#EFF8E9] p-4 text-[#347F19]">
              <Megaphone size={34} />
            </div>

            <h3 className="mt-4 font-semibold text-[#111111]">
              {search
                ? "No matching announcements"
                : "No announcements found"}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {search
                ? "Try searching with another keyword."
                : "Create your first announcement to get started."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={() => navigate("/announcements/add")}
                className="mt-4 flex items-center gap-2 rounded-lg bg-[#65C92E] px-5 py-2.5 text-sm font-semibold text-[#111111] transition hover:bg-[#58B925]"
              >
                <Plus size={17} />
                Add Announcement
              </button>
            )}
          </div>

        ) : (

          /* TABLE */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">

              <thead className="bg-[#F7FAF5]">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4">Announcement</th>
                  <th className="px-5 py-4">Offer</th>
                  <th className="px-5 py-4">Button</th>
                  <th className="px-5 py-4">Link</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredAnnouncements.map((item) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-[#F7FAF5]"
                  >

                    {/* ANNOUNCEMENT */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 rounded-lg bg-[#EFF8E9] p-3 text-[#347F19]">
                          <Megaphone size={19} />
                        </div>

                        <div className="max-w-[300px]">
                          <p className="text-sm font-semibold text-[#111111]">
                            {item.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            ID: {item._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* OFFER */}
                    <td className="px-5 py-4">
                      {item.offer ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#65C92E]/20 bg-[#F7FAF5] px-3 py-1.5 text-xs font-bold text-[#347F19]">
                          <Tag size={13} />
                          {item.offer}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">
                          —
                        </span>
                      )}
                    </td>

                    {/* BUTTON */}
                    <td className="px-5 py-4 text-sm font-medium text-[#111111]">
                      {item.buttonText || "—"}
                    </td>

                    {/* LINK */}
                    <td className="px-5 py-4">
                      {item.buttonLink ? (
                        <a
                          href={item.buttonLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex max-w-[180px] items-center gap-1 text-sm text-[#347F19] hover:underline"
                        >
                          <span className="truncate">
                            {item.buttonLink}
                          </span>

                          <ExternalLink size={13} className="shrink-0" />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">
                          —
                        </span>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          item.status === "Active"
                            ? "bg-[#EFF8E9] text-[#347F19]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.status === "Active" ? (
                          <CheckCircle size={13} />
                        ) : (
                          <XCircle size={13} />
                        )}

                        {item.status || "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/announcements/edit/${item._id}`)
                          }
                          title="Edit Announcement"
                          className="rounded-lg bg-[#EFF8E9] p-2.5 text-[#347F19] transition hover:bg-[#65C92E] hover:text-[#111111]"
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          title="Delete Announcement"
                          className="rounded-lg bg-[#F7FAF5] p-2.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
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
        )}

        {/* FOOTER */}
        {!loading && !error && filteredAnnouncements.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing{" "}
              <span className="font-semibold text-[#111111]">
                {filteredAnnouncements.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#111111]">
                {announcements.length}
              </span>{" "}
              announcements
            </p>

            <button
              type="button"
              onClick={fetchAnnouncements}
              className="flex items-center gap-2 font-semibold text-[#347F19] transition hover:text-[#65C92E]"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
