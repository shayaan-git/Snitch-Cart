import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DashboardNavIcon,
  CreateNavIcon,
  StoreNavIcon,
  PlusIcon,
} from "./icons.jsx";

const navLinks = [
  { label: "Dashboard", href: "/seller/dashboard", icon: <DashboardNavIcon /> },
  { label: "Create Product", href: "/seller/create-product", icon: <CreateNavIcon /> },
  { label: "Store", href: "/", icon: <StoreNavIcon /> },
];

const SellerSidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
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
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
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
                <span className="uppercase tracking-widest text-xs">{link.label}</span>
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
  );
};

export default SellerSidebar;
