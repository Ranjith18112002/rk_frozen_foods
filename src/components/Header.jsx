
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Bell,
  UserRound,
  ChevronDown,
  LogOut,
  CheckCheck,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationService";

const Header = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const adminName = localStorage.getItem("adminName") || "Admin";
  const adminEmail =
    localStorage.getItem("adminEmail") || "Administrator";

  // Fetch notifications and unread count
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const [notificationResult, countResult] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);

      setNotifications(notificationResult.data || []);
      setUnreadCount(countResult.count || 0);
    } catch (error) {
      console.error("Notification Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and refresh every 20 seconds
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 20000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Profile dropdown
  const handleProfileToggle = () => {
    setProfileOpen((prev) => !prev);
    setNotificationOpen(false);
  };

  // Notification dropdown
  const handleNotificationToggle = () => {
    setNotificationOpen((prev) => !prev);
    setProfileOpen(false);
    fetchNotifications();
  };

  // Mark single notification as read
  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationRead(notification._id);

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id
              ? { ...item, isRead: true }
              : item
          )
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      setNotificationOpen(false);

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error("Mark Notification Read Error:", error);
    }
  };

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Mark All Read Error:", error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    window.location.href = "/login";
  };

  // Format notification date
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-gray-100 bg-white px-4 shadow-sm sm:px-6 lg:px-8">

      {/* Left Section */}
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold tracking-tight text-[#111111] sm:text-xl">
          Welcome, {adminName}!
        </h2>

        <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
          Welcome to RK Enterprises Admin Panel
        </p>
      </div>

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">

        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-[#F7FAF5] px-3 py-2 transition focus-within:border-[#65C92E] focus-within:ring-2 focus-within:ring-[#65C92E]/15 md:flex">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search here..."
            className="w-36 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 lg:w-48"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={handleNotificationToggle}
            className={`relative rounded-xl p-2.5 transition ${ 
              notificationOpen
                ? "bg-[#EFF8E9] text-[#347F19]"
                : "text-gray-500 hover:bg-[#F7FAF5] hover:text-[#347F19]"
            }`}
            aria-label="Notifications"
            aria-expanded={notificationOpen}
          >
            <Bell size={21} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl sm:w-[380px]">

              {/* Dropdown Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notifications
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {unreadCount} unread notification
                    {unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-xs font-semibold text-[#347F19] hover:text-[#65C92E]"
                  >
                    <CheckCheck size={15} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-[380px] overflow-y-auto">
                {loading && notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-7 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF8E9] text-[#347F19]">
                      <Bell size={21} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-gray-800">
                      All caught up!
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      You don't have any notifications right now.
                    </p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() =>
                        handleNotificationClick(notification)
                      }
                      className={`flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-[#F7FAF5] ${
                        !notification.isRead ? "bg-[#EFF8E9]/60" : ""
                      }`}
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFF8E9] text-[#347F19]">
                        <Bell size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-800">
                            {notification.title}
                          </p>

                          {!notification.isRead && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#65C92E]" />
                          )}
                        </div>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600">
                          {notification.message}
                        </p>

                        <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock size={11} />
                          {formatDate(notification.createdAt)}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-2 text-center">
                  <p className="text-[11px] text-gray-400">
                    Showing latest 10 notifications
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Admin Profile */}



       {/* <div className="relative">
          <button
            type="button"
            onClick={handleProfileToggle}
            className={`flex items-center gap-2 rounded-xl p-1.5 transition sm:gap-3 ${
              profileOpen ? "bg-[#F7FAF5]" : "hover:bg-[#F7FAF5]"
            }`}
            aria-expanded={profileOpen}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF8E9] text-[#347F19]">
              <UserRound size={19} />
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-28 truncate text-sm font-semibold text-gray-900">
                {adminName}
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`hidden text-gray-400 transition-transform sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">

         
              <div className="border-b border-gray-100 px-3 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFF8E9] text-[#347F19]">
                    <UserRound size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {adminName}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {adminEmail}
                    </p>
                  </div>
                </div>
              </div>

             
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/profile");
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-[#F7FAF5] hover:text-[#347F19]"
              >
                <UserRound size={16} />
                My Profile
              </button>

            
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>  */}
        



      </div>
    </header>
  );
};

export default Header;
