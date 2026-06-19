import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hook/useAuth.js";
import { HamburgerIcon } from "./icons.jsx";

const HeaderBar = ({ onMenuClick }) => {
  const user = useSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  /* Close on outside click */
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
      {/* ── Mobile hamburger (hidden on desktop) ── */}
      <button
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="lg:hidden text-gray-400 hover:text-[#1A1A1A] transition-colors duration-200 p-1 cursor-pointer"
      >
        <HamburgerIcon />
      </button>

      {/* Spacer so user name stays right-aligned on desktop */}
      <div className="hidden lg:block" />

      {user?.fullname && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="uppercase tracking-widest text-xs text-[#1A1A1A] hover:text-[#C4A96B] transition-colors duration-200 cursor-pointer"
          >
            {user.fullname}
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 shadow-sm min-w-[140px] z-50">
              <button
                onClick={async () => {
                  await handleLogout();
                  setDropdownOpen(false);
                  navigate("/login", {replace: true});
                }}
                className="w-full text-left px-4 py-3 uppercase tracking-widest text-xs text-[#C4A96B] hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default HeaderBar;
