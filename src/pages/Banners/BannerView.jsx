
import {
  X,
  Image,
  FileText,
  CheckCircle,
  Ban,
  Pencil,
  CalendarDays,
  Link2,
  MousePointerClick,
  Megaphone,
  ExternalLink,
} from "lucide-react";

const BannerView = ({ banner, onClose, onEdit }) => {
  if (!banner) return null;

  const isActive = banner.status === "Active";
  const bannerImage = banner.image || banner.images?.[0] || "";

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

  const infoCardClass =
    "rounded-xl border border-gray-100 bg-white p-4 transition duration-200 hover:border-[#65C92E]/40 hover:shadow-sm";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-6 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#EFF8E9] p-3 text-[#347F19]">
              <Megaphone size={23} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#111111] sm:text-xl">
                Banner Details
              </h2>
              <p className="text-xs text-gray-500">
                View complete banner information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition duration-200 hover:bg-red-50 hover:text-red-500 active:scale-95"
            aria-label="Close banner details"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] space-y-6 overflow-y-auto p-5 sm:p-7">

          {/* Banner Preview */}
          <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-[#F7FAF5] p-5">
            <div className="relative h-48 w-full overflow-hidden rounded-xl border border-gray-200 bg-white sm:h-64">
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt={banner.title || "Banner"}
                  className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-300">
                  <Image size={50} />
                </div>
              )}

              <span
                className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
                  isActive
                    ? "bg-[#EFF8E9] text-[#347F19]"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {isActive ? (
                  <CheckCircle size={14} />
                ) : (
                  <Ban size={14} />
                )}
                {banner.status || "Unknown"}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Banner Title
              </span>

              <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                {banner.title || "-"}
              </h2>

              <p className="mt-2 text-base font-medium text-[#347F19]">
                {banner.subtitle || "-"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isActive
                      ? "bg-[#EFF8E9] text-[#347F19]"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isActive ? (
                    <CheckCircle size={14} />
                  ) : (
                    <Ban size={14} />
                  )}
                  {banner.status || "Unknown"}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">
                  <MousePointerClick size={14} />
                  {banner.buttonText || "Shop Now"}
                </span>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Banner ID */}
            <div className={infoCardClass}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                <FileText size={20} />
              </div>

              <p className="text-xs text-gray-400">Banner ID</p>

              <p className="mt-1 break-all text-sm font-semibold text-[#111111]">
                #{banner._id || banner.id || "-"}
              </p>
            </div>

            {/* Button Text */}
            <div className={infoCardClass}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF8E9] text-[#347F19]">
                <MousePointerClick size={20} />
              </div>

              <p className="text-xs text-gray-400">Button Text</p>

              <p className="mt-1 text-sm font-semibold text-[#111111]">
                {banner.buttonText || "Shop Now"}
              </p>
            </div>

            {/* Button Link */}
            <div className={infoCardClass}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Link2 size={20} />
              </div>

              <p className="text-xs text-gray-400">Button Link</p>

              <p className="mt-1 break-all text-sm font-semibold text-[#111111]">
                {banner.buttonLink || "/products"}
              </p>
            </div>

            {/* Created Date */}
            <div className={infoCardClass}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <CalendarDays size={20} />
              </div>

              <p className="text-xs text-gray-400">Created Date</p>

              <p className="mt-1 text-sm font-semibold text-[#111111]">
                {formatDate(banner.createdAt)}
              </p>
            </div>

            {/* Banner Status */}
            <div className={infoCardClass}>
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${
                  isActive
                    ? "bg-[#EFF8E9] text-[#347F19]"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {isActive ? (
                  <CheckCircle size={20} />
                ) : (
                  <Ban size={20} />
                )}
              </div>

              <p className="text-xs text-gray-400">Banner Status</p>

              <p
                className={`mt-1 text-sm font-semibold ${
                  isActive ? "text-[#347F19]" : "text-amber-700"
                }`}
              >
                {banner.status || "-"}
              </p>
            </div>

            {/* Updated Date */}
            <div className={infoCardClass}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <CalendarDays size={20} />
              </div>

              <p className="text-xs text-gray-400">Last Updated</p>

              <p className="mt-1 text-sm font-semibold text-[#111111]">
                {formatDate(banner.updatedAt)}
              </p>
            </div>
          </div>

          {/* Banner Action */}
          <div className="rounded-xl border border-dashed border-[#B9DDA8] bg-[#F7FAF5] p-5">
            <div className="mb-3 flex items-center gap-2">
              <ExternalLink size={18} className="text-[#347F19]" />
              <h3 className="font-semibold text-[#111111]">
                Banner Action
              </h3>
            </div>

            <p className="text-sm text-gray-500">
              Visitors clicking the banner button will be directed to:
            </p>

            <p className="mt-2 break-all text-sm font-semibold text-[#347F19]">
              {banner.buttonLink || "/products"}
            </p>

            <span className="mt-3 inline-flex rounded-lg bg-[#65C92E] px-4 py-2 text-sm font-semibold text-[#111111]">
              {banner.buttonText || "Shop Now"}
            </span>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <FileText size={18} className="text-[#347F19]" />
              <h3 className="font-semibold text-[#111111]">
                Banner Description
              </h3>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
              {banner.description || "No description available."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-[#F7FAF5] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition duration-200 hover:bg-gray-100 active:scale-95"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-6 py-3 text-sm font-semibold text-[#111111] shadow-sm transition duration-200 hover:bg-[#58B925] hover:shadow-md active:scale-95"
          >
            <Pencil size={17} />
            Edit Banner
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerView;
