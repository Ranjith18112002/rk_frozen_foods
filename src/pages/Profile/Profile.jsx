
import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  Pencil,
  Save,
  X,
  MapPin,
  CheckCircle,
} from "lucide-react";

import {
  getAdminProfile,
  updateAdminProfile,
} from "../../services/adminProfileService";

const defaultProfile = {
  name: "",
  email: "",
  phone: "",
  role: "Super Administrator",
  location: "",
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [savedProfile, setSavedProfile] = useState(defaultProfile);
  const [success, setSuccess] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getAdminProfile();

        if (response?.data) {
          setProfile(response.data);
          setSavedProfile(response.data);

          localStorage.setItem(
            "adminProfile",
            JSON.stringify(response.data)
          );
        } else {
          setMessageType("error");
          setSuccess("Admin profile not found.");
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        setMessageType("error");
        setSuccess(
          error.response?.data?.message ||
            "Failed to load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Save profile
  const handleSaveProfile = async () => {
    if (!profile.name?.trim() || !profile.email?.trim()) {
      setMessageType("error");
      setSuccess("Name and email are required.");
      return;
    }

    try {
      setSaving(true);
      setSuccess("");

      const profileData = {
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: profile.phone?.trim() || "",
        location: profile.location?.trim() || "",
      };

      const response = await updateAdminProfile(profileData);

      if (response?.success && response.data) {
        const updatedProfile = response.data;

        setProfile(updatedProfile);
        setSavedProfile(updatedProfile);
        setIsEditing(false);

        localStorage.setItem(
          "adminProfile",
          JSON.stringify(updatedProfile)
        );

        setMessageType("success");
        setSuccess("Profile updated successfully!");
      } else {
        setMessageType("error");
        setSuccess(response?.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile Update Error:", error);

      setMessageType("error");
      setSuccess(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setProfile(savedProfile);
    setIsEditing(false);
    setSuccess("");
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/15 disabled:bg-[#F7FAF5] disabled:text-gray-500";

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-sm font-medium text-gray-500">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[30px] font-semibold leading-tight text-[#111111]">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and account details.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => {
              setIsEditing(true);
              setSuccess("");
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-5 py-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#55B522]"
          >
            <Pencil size={17} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <X size={17} />
              Cancel
            </button>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-[#65C92E] px-5 py-3 text-sm font-semibold text-[#111111] transition hover:bg-[#55B522] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Success / Error Message */}
      {success && (
        <div
          className={`flex items-center gap-2 rounded-lg border p-4 text-sm ${
            messageType === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {/* Profile Overview */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="h-36 bg-gradient-to-r from-[#111111] via-[#23451A] to-[#65C92E]" />

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-10 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#EFF8E9] text-[#347F19] shadow-md">
            <UserRound size={48} />
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold text-[#111111]">
              {profile.name || "Admin"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {profile.role || "Super Administrator"}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Personal Information */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md lg:col-span-2 sm:p-7">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#111111]">
                Personal Information
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Your basic account information
              </p>
            </div>

            <div className="rounded-lg bg-[#EFF8E9] p-2 text-[#347F19]">
              <UserRound size={22} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Full Name
              </label>

              <div className="relative">
                <UserRound
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />

                <input
                  name="name"
                  value={profile.name || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${inputClass} pl-10`}
                  placeholder="Enter full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />

                <input
                  name="email"
                  type="email"
                  value={profile.email || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${inputClass} pl-10`}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />

                <input
                  name="phone"
                  value={profile.phone || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${inputClass} pl-10`}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Account Role
              </label>

              <div className="relative">
                <ShieldCheck
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />

                <input
                  name="role"
                  value={profile.role || ""}
                  disabled
                  className={`${inputClass} pl-10`}
                  placeholder="Account role"
                />
              </div>
            </div>

            {/* Location */}
            {/* <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Location
              </label>

              <div className="relative">
                <MapPin
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />

                <input
                  name="location"
                  value={profile.location || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${inputClass} pl-10`}
                  placeholder="Enter location"
                />
              </div>
            </div> */}

          </div>
        </div>

        {/* Account Information */}
        <div className="space-y-6">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <h3 className="mb-5 text-lg font-semibold text-[#111111]">
              Account Information
            </h3>

            <div className="space-y-5">

              {/* Role */}
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#EFF8E9] p-2 text-[#347F19]">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Account Role
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {profile.role || "Not assigned"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                  <Mail size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    Registered Email
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-gray-700">
                    {profile.email || "Not available"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-green-50 p-2 text-green-600">
                  <Phone size={20} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Contact Number
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {profile.phone || "Not available"}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Security Card */}
          <div className="rounded-2xl border border-[#65C92E]/20 bg-[#111111] p-6 text-white shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#65C92E]/15 text-[#65C92E]">
              <ShieldCheck size={26} />
            </div>

            <h3 className="font-semibold">
              Account Security
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/60">
              Keep your profile information updated to maintain your admin account details.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#65C92E]">
              <CheckCircle size={17} />
              Profile Information
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
