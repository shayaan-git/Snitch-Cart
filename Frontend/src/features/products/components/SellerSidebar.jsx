import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DashboardNavIcon,
  CreateNavIcon,
  StoreNavIcon,
  PlusIcon,
  XIcon,
} from "./icons.jsx";

const navLinks = [
  { label: "Dashboard", href: "/seller/dashboard", icon: <DashboardNavIcon /> },
  {
    label: "Create Product",
    href: "/seller/create-product",
    icon: <CreateNavIcon />,
  },
  { label: "Store", href: "/", icon: <StoreNavIcon /> },
];

const SellerSidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* ── Desktop sidebar (unchanged) ─────────────────────────── */}
      <aside
        className={`
          hidden lg:flex flex-col bg-white border-r border-gray-100 flex-shrink-0
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-14" : "w-56"}
        `}
      >
        {/* Brand + toggle row */}
        <div
          className={`flex items-center border-b border-gray-100 h-14 flex-shrink-0 ${
            collapsed ? "justify-center px-0" : "px-6 justify-between"
          }`}
        >
          {!collapsed && (
            <span
              className="text-lg font-light tracking-widest text-[#1A1A1A] truncate"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Elevate
            </span>
          )}
          <button
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="text-gray-400 hover:text-[#1A1A1A] transition-colors duration-200 p-1 flex-shrink-0 cursor-pointer"
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col py-6 gap-1 flex-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                title={collapsed ? link.label : undefined}
                className={`
                  flex items-center gap-3 py-2.5 transition-colors duration-200
                  ${collapsed ? "justify-center px-0" : "px-6"}
                  ${isActive ? "text-[#C4A96B]" : "text-gray-400 hover:text-[#1A1A1A]"}
                `}
              >
                {link.icon}
                {!collapsed && (
                  <span className="uppercase tracking-widest text-xs">
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Add Product CTA */}
        <div className={`pb-8 ${collapsed ? "px-2" : "px-6"}`}>
          <button
            id="nav-add-product-btn"
            onClick={() => navigate("/seller/create-product")}
            className={`
              w-full py-3
              bg-[#C4A96B] text-white
              uppercase tracking-[0.2em] text-[10px]
              rounded-none cursor-pointer
              transition-opacity duration-200
              hover:opacity-90
              flex items-center justify-center gap-2
            `}
            title={collapsed ? "Add Product" : undefined}
          >
            <PlusIcon />
            {!collapsed && "Add Product"}
          </button>
        </div>

        {/* Sub-label */}
        {!collapsed && (
          <div className="px-6 pb-6">
            <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
              Seller Studio
            </p>
          </div>
        )}
      </aside>

      {/* ── Mobile drawer (only on < lg) ─────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={onMobileClose}
        className={`
          fixed inset-0 bg-black/40 z-40 lg:hidden
          transition-opacity duration-300
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white z-50 lg:hidden
          flex flex-col shadow-xl
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-14 border-b border-gray-100 flex-shrink-0">
          <span
            className="text-lg font-light tracking-widest text-[#1A1A1A]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Elevate
          </span>
          <button
            onClick={onMobileClose}
            aria-label="Close navigation menu"
            className="text-gray-400 hover:text-[#1A1A1A] transition-colors duration-200 p-1 cursor-pointer"
          >
            <XIcon />
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex flex-col py-6 gap-1 flex-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={onMobileClose}
                className={`
                  flex items-center gap-3 px-6 py-3 transition-colors duration-200
                  ${isActive ? "text-[#C4A96B]" : "text-gray-400 hover:text-[#1A1A1A]"}
                `}
              >
                {link.icon}
                <span className="uppercase tracking-widest text-xs">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Drawer Add Product CTA */}
        <div className="px-6 pb-8">
          <button
            onClick={() => {
              navigate("/seller/create-product");
              onMobileClose();
            }}
            className="
              w-full py-3
              bg-[#C4A96B] text-white
              uppercase tracking-[0.2em] text-[10px]
              rounded-none cursor-pointer
              transition-opacity duration-200
              hover:opacity-90
              flex items-center justify-center gap-2
            "
          >
            <PlusIcon />
            Add Product
          </button>
        </div>

        {/* Drawer sub-label */}
        <div className="px-6 pb-6">
          <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
            Seller Studio
          </p>
        </div>
      </div>
    </>
  );
};

export default SellerSidebar;
