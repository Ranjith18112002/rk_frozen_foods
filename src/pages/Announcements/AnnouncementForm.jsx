
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Megaphone,
  Save,
  Eye,
  Tag,
  Link2,
} from "lucide-react";

import {
  createAnnouncement,
  getAnnouncementById,
  updateAnnouncement,
} from "../../services/announcementService";

const getResponseData = (response) =>
  response?.data?.data ?? response?.data ?? response;

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#111111] outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/15";

const labelClass = "mb-2 block text-sm font-semibold text-[#333333]";

const AnnouncementForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    offer: "",
    title: "",
    buttonText: "SHOP NOW",
    buttonLink: "/shop",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const fetchAnnouncement = async () => {
      try {
        setFetching(true);
        setError("");

        const response = await getAnnouncementById(id);
        const announcement = getResponseData(response);

        if (!announcement) {
          throw new Error("Announcement not found");
        }

        setFormData({
          offer: announcement.offer || "",
          title: announcement.title || "",
          buttonText: announcement.buttonText || "SHOP NOW",
          buttonLink: announcement.buttonLink || "/shop",
          status: announcement.status || "Active",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load announcement"
        );
      } finally {
        setFetching(false);
      }
    };

    fetchAnnouncement();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Announcement message is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        offer: formData.offer.trim(),
        title: formData.title.trim(),
        buttonText: formData.buttonText.trim() || "SHOP NOW",
        buttonLink: formData.buttonLink.trim() || "/shop",
        status: formData.status,
      };

      if (isEdit) {
        await updateAnnouncement(id, payload);
      } else {
        await createAnnouncement(payload);
      }

      navigate("/announcements");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save announcement. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#EFF8E9] border-t-[#65C92E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAF5] p-4 md:p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate("/announcements")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#777078] transition hover:text-[#347F19]"
            >
              <ArrowLeft size={17} />
              Back to Announcements
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF8E9] text-[#347F19]">
                <Megaphone size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#111111]">
                  {isEdit ? "Edit Announcement" : "Create Announcement"}
                </h1>
                <p className="mt-1 text-sm text-[#777078]">
                  Manage your promotional announcement bar
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Form Fields */}
            <div className="space-y-6 lg:col-span-2">

              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-6 flex items-center gap-2">
                  <Megaphone size={19} className="text-[#347F19]" />
                  <h2 className="text-base font-bold text-[#111111]">
                    Announcement Details
                  </h2>
                </div>

                <div className="space-y-5">

                  {/* Offer Text */}
                  <div>
                    <label className={labelClass}>
                      Offer Text
                    </label>

                    <div className="relative">
                      <Tag
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777078]"
                      />

                      <input
                        type="text"
                        name="offer"
                        value={formData.offer}
                        onChange={handleChange}
                        placeholder="30% OFF / SPECIAL OFFER / NEW ARRIVAL"
                        className={`${inputClass} pl-11`}
                      />
                    </div>

                    <p className="mt-2 text-xs text-[#777078]">
                      Optional. Enter any offer or promotional text.
                    </p>
                  </div>

                  {/* Announcement Message */}
                  <div>
                    <label className={labelClass}>
                      Announcement Message <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter your announcement message"
                      className={inputClass}
                      rows={3}
                      required
                    />

                    <p className="mt-2 text-xs text-[#777078]">
                      This is the main message displayed in the announcement bar.
                    </p>
                  </div>

                  {/* Button Details */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Button Text
                      </label>

                      <input
                        type="text"
                        name="buttonText"
                        value={formData.buttonText}
                        onChange={handleChange}
                        placeholder="SHOP NOW"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Button Link
                      </label>

                      <div className="relative">
                        <Link2
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777078]"
                        />

                        <input
                          type="text"
                          name="buttonLink"
                          value={formData.buttonLink}
                          onChange={handleChange}
                          placeholder="/shop"
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Status */}
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
                <h2 className="mb-4 text-base font-bold text-[#111111]">
                  Announcement Status
                </h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {["Active", "Inactive"].map((status) => (
                    <label
                      key={status}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                        formData.status === status
                          ? "border-[#65C92E] bg-[#EFF8E9]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={formData.status === status}
                        onChange={handleChange}
                        className="accent-[#347F19]"
                      />

                      <span className="text-sm font-semibold text-[#242124]">
                        {status}
                      </span>

                      <span
                        className={`ml-auto h-2.5 w-2.5 rounded-full ${
                          status === "Active"
                            ? "bg-[#65C92E]"
                            : "bg-gray-400"
                        }`}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <Eye size={19} className="text-[#347F19]" />
                  <h2 className="text-base font-bold text-[#111111]">
                    Live Preview
                  </h2>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-100">
                  <div className="bg-[#111111] px-4 py-5 text-center text-white">

                    {formData.offer && (
                      <p className="mb-2 text-sm font-bold text-[#65C92E]">
                        {formData.offer}
                      </p>
                    )}

                    <p className="text-sm font-medium leading-relaxed">
                      {formData.title || "Your announcement message"}
                    </p>

                    {formData.buttonText && (
                      <span className="mt-3 inline-block rounded-md bg-[#65C92E] px-4 py-2 text-xs font-bold text-white">
                        {formData.buttonText}
                      </span>
                    )}

                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-[#777078]">
                  This is a preview of your announcement bar.
                </p>
              </div>

              <div className="rounded-xl border border-[#DCEED2] bg-[#EFF8E9] p-5">
                <h3 className="mb-2 text-sm font-bold text-[#347F19]">
                  <Tag size={16} className="mr-2 inline" />
                  Quick Tip
                </h3>

                <p className="text-xs leading-relaxed text-[#45633A]">
                  You can enter any offer, announcement message and button
                  details. Coupon codes are not required.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/announcements")}
              className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#242124] transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#347F19] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Announcement"
                : "Save Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm;
