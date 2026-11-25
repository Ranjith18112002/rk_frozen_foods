
import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  Share2,
  Save,
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";

import {
  createFooterContact,
  getFooterContact,
  updateFooterContact,
} from "../../services/footerContactService";

import {
  createCompanySettings,
  getCompanySettings,
  updateCompanySettings,
} from "../../services/companySettingsService";

// Default company name
const DEFAULT_COMPANY_NAME = "RK Enterprises";

const emptyCompany = {
  name: DEFAULT_COMPANY_NAME,
  businessHours: "",
  phone: "",
  email: "",
};

const emptyFooter = {
  tagline: "",
  description: "",
  phone: "",
  email: "",
  address: "",
  followDescription: "",
  instagram: "",
  facebook: "",
  youtube: "",
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Company Details");

  const [company, setCompany] = useState({ ...emptyCompany });
  const [footer, setFooter] = useState({ ...emptyFooter });

  const [logoPreview, setLogoPreview] = useState("");

  const [savedCompany, setSavedCompany] = useState({
    ...emptyCompany,
  });

  const [savedFooter, setSavedFooter] = useState({
    ...emptyFooter,
  });

  const [savedLogo, setSavedLogo] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [companyExists, setCompanyExists] = useState(false);
  const [contactExists, setContactExists] = useState(false);

  const [companyLoading, setCompanyLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const tabs = [
    { name: "Company Details", icon: Building2 },
    { name: "Footer & Social", icon: Share2 },
  ];

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/15";

  const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

  const showFeedback = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const updateCompany = (field, value) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const updateFooter = (field, value) => {
    setFooter((prev) => ({ ...prev, [field]: value }));
  };

  // Load Company Settings
  useEffect(() => {
    let isMounted = true;

    const loadCompanySettings = async () => {
      setCompanyLoading(true);

      try {
        const response = await getCompanySettings();

        if (!isMounted) return;

        const data = response?.data;

        if (response?.success && data) {
          const companyData = {
            name: data.name || DEFAULT_COMPANY_NAME,
            businessHours: data.businessHours || "",
            phone: data.phone || "",
            email: data.email || "",
          };

          setCompany(companyData);
          setSavedCompany(companyData);

          setLogoPreview(data.logo || "");
          setSavedLogo(data.logo || "");

          setCompanyExists(true);
        } else {
          setCompany({ ...emptyCompany });
          setSavedCompany({ ...emptyCompany });
          setLogoPreview("");
          setSavedLogo("");
          setCompanyExists(false);
        }
      } catch (error) {
        console.error("Company Settings Load Error:", error);

        if (isMounted) {
          showFeedback(
            error.response?.data?.message ||
              error.message ||
              "Unable to load company settings.",
            "error"
          );
        }
      } finally {
        if (isMounted) {
          setCompanyLoading(false);
        }
      }
    };

    loadCompanySettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load Footer Settings
  useEffect(() => {
    let isMounted = true;

    const loadFooterSettings = async () => {
      setContactLoading(true);

      try {
        const response = await getFooterContact();

        if (!isMounted) return;

        if (response?.success && response?.data) {
          const data = response.data;

          const footerData = {
            tagline: data.tagline || "",
            description: data.description || "",
            phone: data.contact?.phone || "",
            email: data.contact?.email || "",
            address: data.contact?.address || "",
            followDescription: data.followDescription || "",
            instagram: data.socialLinks?.instagram || "",
            facebook: data.socialLinks?.facebook || "",
            youtube: data.socialLinks?.youtube || "",
          };

          setFooter(footerData);
          setSavedFooter(footerData);
          setContactExists(true);
        } else {
          setFooter({ ...emptyFooter });
          setSavedFooter({ ...emptyFooter });
          setContactExists(false);
        }
      } catch (error) {
        console.error("Footer Settings Load Error:", error);

        if (isMounted) {
          const status = error.response?.status;

          if (status === 404) {
            setContactExists(false);
            setFooter({ ...emptyFooter });
            setSavedFooter({ ...emptyFooter });
          } else {
            showFeedback(
              error.response?.data?.message ||
                error.message ||
                "Unable to load footer settings.",
              "error"
            );
          }
        }
      } finally {
        if (isMounted) {
          setContactLoading(false);
        }
      }
    };

    loadFooterSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      showFeedback(
        "Please select a PNG, JPG or WEBP image.",
        "error"
      );
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showFeedback("Logo image must be smaller than 5MB.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setLogoPreview(reader.result);
      showFeedback("Logo preview updated. Save to apply changes.");
    };

    reader.onerror = () => {
      showFeedback("Unable to read the selected image.", "error");
    };

    reader.readAsDataURL(file);
  };

  // Save Company Details
  const handleSaveCompany = async () => {
    if (!company.name.trim()) {
      showFeedback("Please enter company name.", "error");
      return;
    }

    const companyData = {
      name: company.name.trim(),
      businessHours: company.businessHours.trim(),
      phone: company.phone.trim(),
      email: company.email.trim(),
      logo: logoPreview || "",
    };

    setSaving(true);
    setMessage("");

    try {
      const response = companyExists
        ? await updateCompanySettings(companyData)
        : await createCompanySettings(companyData);

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to save company details."
        );
      }

      const savedData = response.data;

      const updatedCompany = {
        name: savedData?.name ?? companyData.name,
        businessHours:
          savedData?.businessHours ?? companyData.businessHours,
        phone: savedData?.phone ?? companyData.phone,
        email: savedData?.email ?? companyData.email,
      };

      const updatedLogo = savedData?.logo ?? companyData.logo;

      setCompany(updatedCompany);
      setSavedCompany(updatedCompany);
      setLogoPreview(updatedLogo);
      setSavedLogo(updatedLogo);
      setCompanyExists(true);

      showFeedback(
        response.message || "Company details saved successfully.",
        "success"
      );
    } catch (error) {
      console.error("Company Settings Save Error:", error);

      showFeedback(
        error.response?.data?.message ||
          error.message ||
          "Failed to save company details.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // Save Footer Settings
  const handleSaveFooter = async () => {
    if (!company.name.trim()) {
      showFeedback(
        "Please save Company Details before saving Footer Settings.",
        "error"
      );
      return;
    }

    const footerData = {
      brandName: company.name.trim(),
      tagline: footer.tagline.trim(),
      description: footer.description.trim(),

      contact: {
        phone: footer.phone.trim(),
        email: footer.email.trim(),
        address: footer.address.trim(),
      },

      followDescription: footer.followDescription.trim(),

      socialLinks: {
        instagram: footer.instagram.trim(),
        facebook: footer.facebook.trim(),
        youtube: footer.youtube.trim(),
      },

      isActive: true,
    };

    setSaving(true);
    setMessage("");

    try {
      const response = contactExists
        ? await updateFooterContact(footerData)
        : await createFooterContact(footerData);

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to save footer settings."
        );
      }

      setContactExists(true);
      setSavedFooter({ ...footer });

      showFeedback(
        response.message || "Footer settings saved successfully.",
        "success"
      );
    } catch (error) {
      console.error("Footer Settings Save Error:", error);

      showFeedback(
        error.response?.data?.message ||
          error.message ||
          "Failed to save footer settings.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // Main Save Handler
  const handleSave = async (e) => {
    e.preventDefault();

    if (activeTab === "Company Details") {
      await handleSaveCompany();
    } else {
      await handleSaveFooter();
    }
  };

  // Reset Form
  const handleReset = () => {
    if (activeTab === "Company Details") {
      setCompany({ ...savedCompany });
      setLogoPreview(savedLogo);
    } else {
      setFooter({ ...savedFooter });
    }

    showFeedback("Form restored to saved values.", "success");
  };

  // Company Details UI
  const renderCompanyDetails = () => (
    <div className="space-y-6">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5">
        <div>
          <h4 className="font-semibold text-gray-900">
            Company Information
          </h4>

          <p className="mt-1 text-xs text-gray-500">
            Manage your company profile and contact information.
          </p>
        </div>

        {companyLoading && (
          <p className="text-sm text-[#347F19]">
            Loading company details...
          </p>
        )}

        <div>
          <label className={labelClass}>Company Name</label>

          <input
            type="text"
            value={company.name}
            onChange={(e) => updateCompany("name", e.target.value)}
            className={inputClass}
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label className={labelClass}>Business Hours</label>

          <div className="relative">
            <Clock
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={company.businessHours}
              onChange={(e) =>
                updateCompany("businessHours", e.target.value)
              }
              className={`${inputClass} pl-11`}
              placeholder="Enter business hours"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Contact Phone</label>

          <div className="relative">
            <Phone
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="tel"
              value={company.phone}
              onChange={(e) =>
                updateCompany("phone", e.target.value)
              }
              className={`${inputClass} pl-11`}
              placeholder="Enter contact phone"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Contact Email</label>

          <div className="relative">
            <Mail
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              value={company.email}
              onChange={(e) =>
                updateCompany("email", e.target.value)
              }
              className={`${inputClass} pl-11`}
              placeholder="Enter contact email"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Footer Settings UI
  const renderFooterSettings = () => (
    <div className="space-y-7">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Footer Content
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Edit the information displayed in your website footer.
        </p>
      </div>

      {/* Brand Information */}
      <div className="space-y-5 rounded-2xl border border-gray-100 p-5">
        <h4 className="font-semibold text-gray-900">
          Brand Information
        </h4>

        <div>
          <label className={labelClass}>Brand Name</label>

          <input
            type="text"
            value={company.name || DEFAULT_COMPANY_NAME}
            readOnly
            className={`${inputClass} bg-gray-50`}
          />

          <p className="mt-1 text-xs text-gray-400">
            Brand name is automatically synced with Company Details.
          </p>
        </div>

        <div>
          <label className={labelClass}>Footer Tagline</label>

          <input
            value={footer.tagline}
            onChange={(e) =>
              updateFooter("tagline", e.target.value)
            }
            className={inputClass}
            placeholder="Enter footer tagline"
          />
        </div>

        <div>
          <label className={labelClass}>Footer Description</label>

          <textarea
            rows={3}
            value={footer.description}
            onChange={(e) =>
              updateFooter("description", e.target.value)
            }
            className={`${inputClass} resize-none`}
            placeholder="Enter footer description"
          />
        </div>
      </div>

      {/* Footer Contact */}
      <div className="space-y-5 rounded-2xl border border-gray-100 p-5">
        <div>
          <h4 className="font-semibold text-gray-900">
            Footer Contact Information
          </h4>

          <p className="mt-1 text-xs text-gray-500">
            Edit the contact details displayed in your website footer.
          </p>

          {contactLoading && (
            <p className="mt-2 text-xs text-[#347F19]">
              Loading footer settings...
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Phone Number</label>

          <input
            type="tel"
            value={footer.phone}
            onChange={(e) =>
              updateFooter("phone", e.target.value)
            }
            className={inputClass}
            placeholder="Enter footer phone number"
          />
        </div>

        <div>
          <label className={labelClass}>Business Email</label>

          <input
            type="email"
            value={footer.email}
            onChange={(e) =>
              updateFooter("email", e.target.value)
            }
            className={inputClass}
            placeholder="Enter footer email"
          />
        </div>

        <div>
          <label className={labelClass}>Business Address</label>

          <textarea
            rows={3}
            value={footer.address}
            onChange={(e) =>
              updateFooter("address", e.target.value)
            }
            className={`${inputClass} resize-none`}
            placeholder="Enter footer address"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-5 rounded-2xl border border-gray-100 p-5">
        <h4 className="font-semibold text-gray-900">
          Follow Us
        </h4>

        <div>
          <label className={labelClass}>
            Follow Us Description
          </label>

          <textarea
            rows={2}
            value={footer.followDescription}
            onChange={(e) =>
              updateFooter("followDescription", e.target.value)
            }
            className={`${inputClass} resize-none`}
            placeholder="Enter follow us description"
          />
        </div>

        <div>
          <label className={labelClass}>Instagram URL</label>

          <input
            type="url"
            value={footer.instagram}
            onChange={(e) =>
              updateFooter("instagram", e.target.value)
            }
            className={inputClass}
            placeholder="https://www.instagram.com/yourpage"
          />
        </div>

        <div>
          <label className={labelClass}>Facebook URL</label>

          <input
            type="url"
            value={footer.facebook}
            onChange={(e) =>
              updateFooter("facebook", e.target.value)
            }
            className={inputClass}
            placeholder="https://www.facebook.com/yourpage"
          />
        </div>

        <div>
          <label className={labelClass}>YouTube URL</label>

          <input
            type="url"
            value={footer.youtube}
            onChange={(e) =>
              updateFooter("youtube", e.target.value)
            }
            className={inputClass}
            placeholder="https://www.youtube.com/@yourchannel"
          />
        </div>
      </div>

      {/* Footer Preview */}
      <div className="space-y-4 rounded-2xl border border-[#DCEFD2] bg-[#F7FAF5] p-5">
        <div>
          <h4 className="font-semibold text-gray-900">
            Website Footer Preview
          </h4>

          <p className="mt-1 text-xs text-gray-500">
            Preview updates while you edit the fields above.
          </p>
        </div>

        <div className="rounded-xl bg-[#111111] p-6 text-white">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold">
                {company.name || DEFAULT_COMPANY_NAME}
              </h3>

              <p className="mt-2 text-sm font-medium text-[#65C92E]">
                {footer.tagline}
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-300">
                {footer.description}
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Contact Us</h4>

              <div className="mt-3 space-y-3 text-sm text-gray-300">
                <p className="flex items-center gap-2">
                  <Phone size={15} />
                  <span>{footer.phone}</span>
                </p>

                <p className="flex items-center gap-2 break-all">
                  <Mail size={15} />
                  <span>{footer.email}</span>
                </p>

                <p className="flex items-center gap-2">
                  <MapPin size={15} />
                  <span>{footer.address}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-700 pt-5">
            <h4 className="font-semibold">Follow Us</h4>

            <p className="mt-2 text-sm text-gray-300">
              {footer.followDescription}
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {[
                { label: "Instagram", url: footer.instagram },
                { label: "Facebook", url: footer.facebook },
                { label: "YouTube", url: footer.youtube },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.url || undefined}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    if (!social.url) e.preventDefault();
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-3 py-2 text-gray-200 transition hover:border-[#65C92E] hover:text-[#65C92E]"
                >
                  {social.label}
                  <ExternalLink size={13} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Dashboard</span>
          <span>/</span>
          <span className="font-medium text-[#347F19]">
            Settings
          </span>
        </div>

        <h1 className="mt-2 text-[30px] font-semibold tracking-tight text-[#111111]">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your business and website footer information.
        </p>
      </div>

      {/* Settings Layout */}
      <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* Sidebar */}
        <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="px-3 py-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Settings Menu
            </h3>
          </div>

          <div className="flex gap-2 overflow-x-auto lg:flex-col">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;

              return (
                <button
                  key={tab.name}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.name);
                    setMessage("");
                  }}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#EFF8E9] text-[#285D18] shadow-sm"
                      : "text-gray-600 hover:bg-[#F7FAF5] hover:text-gray-900"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive ? "text-[#347F19]" : "text-gray-400"
                    }
                  />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <form
          onSubmit={handleSave}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#EFF8E9] p-3 text-[#347F19]">
                <SettingsIcon size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  {activeTab}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Manage your {activeTab.toLowerCase()} information.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {activeTab === "Company Details" &&
              renderCompanyDetails()}

            {activeTab === "Footer & Social" &&
              renderFooterSettings()}
          </div>

          {/* Feedback */}
          {message && (
            <div
              role="status"
              className={`mx-5 mb-4 rounded-xl px-4 py-3 text-sm font-medium sm:mx-6 ${
                messageType === "error"
                  ? "border border-red-100 bg-red-50 text-red-700"
                  : "border border-[#DCEFD2] bg-[#F2FAED] text-[#347F19]"
              }`}
            >
              {message}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-[#FAFBF9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                (activeTab === "Company Details" && companyLoading) ||
                (activeTab === "Footer & Social" && contactLoading)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#65C92E] px-6 py-2.5 text-sm font-semibold text-[#17230F] shadow-sm transition hover:bg-[#56B824] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {saving
                ? "Saving..."
                : activeTab === "Footer & Social"
                  ? contactExists
                    ? "Update Footer"
                    : "Create Footer"
                  : companyExists
                    ? "Update Company"
                    : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
