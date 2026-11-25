
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ImagePlus,
  Upload,
  X,
  Save,
  Eye,
  Megaphone,
  Link as LinkIcon,
  Type,
  CheckCircle2,
} from "lucide-react";

import {
  createBanner,
  updateBanner,
  getBannerById,
} from "../../services/bannerService";

const BannerForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const existingBanner = location.state?.banner;
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    status: "Active",
  });

  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  // LOAD BANNER DETAILS FOR EDIT
  useEffect(() => {
    let isMounted = true;

    const loadBanner = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        let banner = existingBanner;

        if (!banner) {
          const response = await getBannerById(id);
          banner = response.data;
        }

        if (!banner) {
          throw new Error("Banner not found.");
        }

        if (!isMounted) return;

        setFormData({
          title: banner.title || "",
          subtitle: banner.subtitle || "",
          description: banner.description || "",
          buttonText: banner.buttonText || "",
          buttonLink: banner.buttonLink || "",
          status: banner.status || "Active",
        });

        setImage(banner.image || "");
      } catch (error) {
        console.error("Error loading banner:", error);

        if (isMounted) {
          alert(
            error.response?.data?.message ||
              error.message ||
              "Failed to load banner."
          );
          navigate("/banners");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBanner();

    return () => {
      isMounted = false;
    };
  }, [id, existingBanner, navigate]);

  // HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // HANDLE IMAGE UPLOAD
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Please upload JPG, PNG or WEBP image.",
      }));

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size should be less than 5MB.",
      }));

      e.target.value = "";
      return;
    }

    if (image && image.startsWith("blob:")) {
      URL.revokeObjectURL(image);
    }

    setImageFile(file);
    setImage(URL.createObjectURL(file));

    setErrors((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // REMOVE IMAGE
  const handleRemoveImage = () => {
    if (image && image.startsWith("blob:")) {
      URL.revokeObjectURL(image);
    }

    setImage("");
    setImageFile(null);

    const fileInput = document.getElementById("bannerImage");

    if (fileInput) {
      fileInput.value = "";
    }

    setErrors((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // CLEANUP IMAGE PREVIEW URL
  useEffect(() => {
    return () => {
      if (image && image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  // FORM VALIDATION
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Banner title is required.";
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = "Subtitle is required.";
    }

    if (!image) {
      newErrors.image = "Please upload a banner image.";
    }

    if (
      formData.buttonLink &&
      !/^\/|^https?:\/\//i.test(formData.buttonLink)
    ) {
      newErrors.buttonLink =
        "Enter a valid link, e.g. /products or https://example.com";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // CREATE / UPDATE BANNER API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const bannerFormData = new FormData();

      bannerFormData.append("title", formData.title.trim());
      bannerFormData.append("subtitle", formData.subtitle.trim());
      bannerFormData.append("description", formData.description);
      bannerFormData.append("buttonText", formData.buttonText);
      bannerFormData.append("buttonLink", formData.buttonLink);
      bannerFormData.append("status", formData.status);

      // Upload image only when a new file is selected
      if (imageFile) {
        bannerFormData.append("image", imageFile);
      }

      if (isEdit) {
        await updateBanner(id, bannerFormData);
        alert("Banner updated successfully!");
      } else {
        await createBanner(bannerFormData);
        alert("Banner created successfully!");
      }

      navigate("/banners");
    } catch (error) {
      console.error("Banner save error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while saving the banner."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border ${
      errors[field] ? "border-red-400" : "border-gray-200"
    } bg-white px-4 py-3 text-sm text-[#111111] outline-none transition placeholder:text-gray-400 focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/20`;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAF5]">
        <p className="text-sm font-medium text-[#347F19]">
          Loading banner details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAF5] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-[#111111]">
            {isEdit ? "Edit Banner" : "Add New Banner"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Dashboard
            <span className="mx-2">/</span>

            <button
              type="button"
              onClick={() => navigate("/banners")}
              className="transition hover:text-[#347F19]"
            >
              Banners
            </button>

            <span className="mx-2">/</span>

            <span className="font-medium text-[#347F19]">
              {isEdit ? "Edit Banner" : "Add Banner"}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/banners")}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-[#65C92E] hover:text-[#347F19]"
        >
          <ArrowLeft size={17} />
          Back to Banners
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
          {/* Main Form */}
          <div className="space-y-6 xl:col-span-2">
            {/* Banner Information */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="rounded-lg bg-[#EFF8E9] p-2.5 text-[#347F19]">
                  <Megaphone size={21} />
                </div>

                <div>
                  <h2 className="font-semibold text-[#111111]">
                    Banner Information
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Add the main details of your banner
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Banner Title <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter banner title"
                    className={inputClass("title")}
                  />

                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.title}
                    </p>
                  )}
                </div>

        

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Write a short description for your banner..."
                    className={`${inputClass("description")} resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* Banner Image */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="rounded-lg bg-[#EFF8E9] p-2.5 text-[#347F19]">
                  <ImagePlus size={21} />
                </div>

                <div>
                  <h2 className="font-semibold text-[#111111]">
                    Banner Image
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Upload your promotional banner image
                  </p>
                </div>
              </div>

              {image ? (
                <div className="relative overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={image}
                    alt="Banner preview"
                    className="h-56 w-full object-cover sm:h-72"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-3 top-3 rounded-lg bg-white p-2 text-red-600 shadow-md transition hover:bg-red-50"
                    title="Remove Image"
                  >
                    <X size={18} />
                  </button>

                  <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
                    Banner Preview
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="bannerImage"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#B9DCA8] bg-[#F7FAF5] px-5 py-12 text-center transition hover:border-[#65C92E] hover:bg-[#EFF8E9]"
                >
                  <div className="mb-4 rounded-full bg-[#EFF8E9] p-4 text-[#347F19]">
                    <Upload size={27} />
                  </div>

                  <p className="text-sm font-semibold text-[#111111]">
                    Click to upload banner image
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    JPG, PNG or WEBP (Maximum 5MB)
                  </p>
                </label>
              )}

              <input
                id="bannerImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              {errors.image && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.image}
                </p>
              )}

              <p className="mt-3 text-xs text-gray-400">
                Recommended: Use a high-quality wide image for the website banner.
              </p>
            </div>

            {/* Button Details */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="rounded-lg bg-[#EFF8E9] p-2.5 text-[#347F19]">
                  <LinkIcon size={21} />
                </div>

                <div>
                  <h2 className="font-semibold text-[#111111]">
                    Banner Button Details
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Configure the call-to-action button
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Button Text
                  </label>

                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleChange}
                    placeholder="Example: Explore Products"
                    className={inputClass("buttonText")}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Button Link
                  </label>

                  <input
                    type="text"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleChange}
                    placeholder="/products"
                    className={inputClass("buttonLink")}
                  />

                  {errors.buttonLink && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.buttonLink}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-[#111111]">
                Banner Settings
              </h2>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Banner Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass("status")}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div
                className={`mt-4 flex items-center gap-2 rounded-lg p-3 text-sm ${
                  formData.status === "Active"
                    ? "bg-[#EFF8E9] text-[#347F19]"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                <CheckCircle2 size={17} />

                {formData.status === "Active"
                  ? "This banner is marked as active."
                  : "This banner is currently inactive."}
              </div>
            </div>

            {/* Live Preview */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 p-5">
                <Eye size={19} className="text-[#347F19]" />

                <h2 className="font-semibold text-[#111111]">
                  Banner Preview
                </h2>
              </div>

              <div className="p-4">
                <div className="overflow-hidden rounded-xl bg-[#EFF8E9]">
                  {image ? (
                    <img
                      src={image}
                      alt="Preview"
                      className="h-36 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-36 flex-col items-center justify-center text-[#347F19]">
                      <ImagePlus size={30} />

                      <p className="mt-2 text-xs">
                        Image preview
                      </p>
                    </div>
                  )}

                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#347F19]">
                      {formData.subtitle || "Banner Subtitle"}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-[#111111]">
                      {formData.title || "Your Banner Title"}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-gray-600">
                      {formData.description ||
                        "Your banner description will appear here."}
                    </p>

                    {formData.buttonText && (
                      <span className="mt-4 inline-flex rounded-lg bg-[#65C92E] px-4 py-2 text-xs font-semibold text-[#111111]">
                        {formData.buttonText}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Helpful Note */}
            <div className="rounded-xl border border-[#DDEED3] bg-[#EFF8E9] p-4">
              <div className="flex gap-3">
                <div className="text-[#347F19]">
                  <Type size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#245B16]">
                    Banner Tip
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#527447]">
                    Use a short title, clear subtitle and attractive image to make your website banner stand out.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex flex-col-reverse justify-end gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/banners")}
            className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-7 py-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#58B526] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {isSaving
              ? "Saving..."
              : isEdit
              ? "Update Banner"
              : "Save Banner"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BannerForm;
