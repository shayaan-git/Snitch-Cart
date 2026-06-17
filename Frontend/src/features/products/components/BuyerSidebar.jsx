import React from "react";
import { Link, useLocation } from "react-router";
import { ChevronLeftIcon, ChevronRightIcon, StoreNavIcon } from "./icons.jsx";

const navLinks = [{ label: "Store", href: "/", icon: <StoreNavIcon /> }];

const BuyerSidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

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

      {/* Nav */}
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

      {/* Sub-label */}
      {!collapsed && (
        <div className="px-6 pb-6">
          <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">Store</p>
        </div>
      )}
    </aside>
  );
};

export default BuyerSidebar;
