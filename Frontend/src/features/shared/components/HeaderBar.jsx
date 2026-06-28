import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../auth/hook/useAuth.js";
import {
  HamburgerIcon,
  LogoutIcon,
  CartIcon,
  AccountIcon,
} from "../../products/components/icons.jsx";

const HeaderBar = ({ onMenuClick }) => {
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart?.items || []);
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
      {/* Navigation hamburger & brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="text-gray-400 hover:text-[#1A1A1A] transition-colors duration-200 p-1 cursor-pointer lg:hidden"
        >
          <HamburgerIcon />
        </button>
        <Link
          to="/"
          className="text-lg font-light tracking-widest text-[#1A1A1A]"
          style={{ fontFamily: "'Nib Pro', serif" }}
        >
          Elevate
        </Link>
      </div>

      {user ? (
        /* ── Logged-in controls ─────────────────────────────────────────── */
        <div className="flex items-center gap-6">
          {user.role !== "seller" && (
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative text-[#1A1A1A] hover:text-[#C4A96B] transition-colors duration-200 cursor-pointer p-1 flex items-center"
            >
              <CartIcon />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C4A96B] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              aria-label="User Account"
              className="text-[#1A1A1A] hover:text-[#C4A96B] transition-colors duration-200 cursor-pointer p-1 flex items-center"
            >
              <AccountIcon />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 shadow-sm min-w-[150px] z-50">
                {user.fullname && (
                  <div className="px-4 py-3 border-b border-gray-100 text-left">
                    <span className="block tracking-widest text-xs text-[#1A1A1A] truncate">
                      {user.fullname}
                    </span>
                  </div>
                )}
                <button
                  onClick={async () => {
                    await handleLogout();
                    setDropdownOpen(false);
                    navigate("/login", { replace: true });
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 tracking-widest text-xs text-[#1A1A1A] hover:bg-gray-50 hover:text-[#C4A96B] transition-colors duration-200 cursor-pointer text-left"
                >
                  <LogoutIcon />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── Guest controls ─────────────────────────────────────────────── */
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            id="header-login-btn"
            className="text-[10px] uppercase tracking-widest text-[#1A1A1A] hover:text-[#C4A96B] transition-colors duration-200 px-2 py-1"
          >
            Login
          </Link>
          <Link
            to="/register"
            id="header-signup-btn"
            className="text-[10px] uppercase tracking-widest px-4 py-2 border border-[#C4A96B] text-[#C4A96B] hover:bg-[#C4A96B] hover:text-white transition-all duration-200"
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default HeaderBar;
