
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Layers,
  MessageSquare,
  Settings,
  LogOut,
  Megaphone,
  X,
  ChevronDown,
  Plus,
  List,
  Building2,
  Phone,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Categories",
    icon: Layers,
    children: [
      { name: "All Categories", path: "/categories", icon: List },
      { name: "Add Category", path: "/categories/add", icon: Plus },
    ],
  },
  {
    name: "Products",
    icon: Package,
    children: [
      { name: "All Products", path: "/products", icon: List },
      { name: "Add Product", path: "/products/add", icon: Plus },
    ],
  },
  {
    name: "Banners",
    icon: Megaphone,
    children: [
      { name: "All Banners", path: "/banners", icon: List },
      { name: "Add Banner", path: "/banners/add", icon: Plus },
    ],
  },
  {
    name: "Product Enquiry",
    path: "/enquiries",
    icon: MessageSquare,
  },
  {
    name: "Bulk Order",
    path: "/bulk-orders",
    icon: Building2,
  },
  {
    name: "Contact Enquiries",
    path: "/contact-enquiries",
    icon: Phone,
  },
  {
    name: "Customer Reviews",
    path: "/reviews",
    icon: MessageSquare,
  },
  {
    name: "Announcements",
    icon: Megaphone,
    children: [
      {
        name: "All Announcements",
        path: "/announcements",
        icon: List,
      },
      {
        name: "Add Announcement",
        path: "/announcements/add",
        icon: Plus,
      },
    ],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState("");

  const isPathActive = (path) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const activeDropdown = menuItems.find((item) =>
    item.children?.some((child) => isPathActive(child.path))
  );

  useEffect(() => {
    setOpenDropdown(activeDropdown?.name || "");
  }, [location.pathname]);

  const handleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? "" : name));
  };

  const handleLogout = () => {
    onClose?.();
    onLogout?.();
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] flex-col overflow-hidden bg-[#111111] text-white shadow-xl transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex min-h-[90px] shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
              <img
                src="/images/rklogo.jpeg"
                alt="RK Enterprises Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold tracking-wide text-white">
                RK ENTERPRISES
              </h2>

              <p className="mt-1 text-[11px] font-medium text-white/60">
                Nourishing Lives
              </p>

              <span className="mt-2 inline-block rounded-md bg-[#65C92E]/15 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#65C92E]">
                Admin Panel
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-[#65C92E] lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav flex-1 space-y-2 overflow-y-auto overflow-x-hidden px-4 py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-white/40">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = Boolean(item.children);
            const isDropdownOpen = openDropdown === item.name;

            if (hasChildren) {
              return (
                <div key={item.name}>
                  <button
                    type="button"
                    onClick={() => handleDropdown(item.name)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isDropdownOpen
                        ? "border-[#65C92E] bg-[#65C92E] text-[#111111] shadow-md shadow-[#65C92E]/10"
                        : "border-transparent bg-transparent text-white/70 hover:bg-white/5 hover:text-[#65C92E]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={19} strokeWidth={2} />
                      {item.name}
                    </span>

                    <ChevronDown
                      size={17}
                      className={`transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isDropdownOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-5 mt-2 space-y-1 border-l border-white/15 pl-4">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;

                          return (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              end
                              onClick={onClose}
                              className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                                  isActive
                                    ? "bg-[#65C92E]/15 text-[#65C92E]"
                                    : "text-white/55 hover:bg-white/5 hover:text-[#65C92E]"
                                }`
                              }
                            >
                              <ChildIcon size={16} />
                              <span>{child.name}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-[#65C92E] bg-[#65C92E] text-[#111111] shadow-md shadow-[#65C92E]/10"
                      : "border-transparent text-white/70 hover:bg-white/5 hover:text-[#65C92E]"
                  }`
                }
              >
                <Icon size={19} strokeWidth={2} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="shrink-0 border-t border-white/10 bg-[#111111] p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-red-500/15 hover:text-red-400"
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

          <div className="mt-4 border-t border-white/10 pt-4 text-center">
            <p className="text-[10px] font-medium text-white/50">
              RK Enterprises
            </p>

            <p className="mt-1 text-[10px] text-white/30">
              © 2026 All Rights Reserved
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
