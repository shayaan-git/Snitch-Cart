import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import { Link, useLocation, useNavigate } from "react-router";

/* ─── Currency symbol map ─────────────────────────────────────────── */
const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

function formatPrice(amount, currency) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency + " ";
  return `${symbol}${Number(amount).toLocaleString("en-IN")}`;
}

/* ─── SVG Icons ────────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
    />
  </svg>
);

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
    />
  </svg>
);

const BoxIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
    />
  </svg>
);

const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2l2.09 6.26L20 10l-6 3.5L12 22l-2-8.5L4 10l5.91-1.74L12 2z" />
  </svg>
);

/* Chevron icons for sidebar toggle */
const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

/* Store nav icon */
const StoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016 2.993 2.993 0 002.25-1.016 3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
    />
  </svg>
);

/* ─── Sidebar ──────────────────────────────────────────────────────── */
const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navLinks = [{ label: "Store", href: "/", icon: <StoreIcon /> }];
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
        className={`flex items-center border-b border-gray-100 h-14 flex-shrink-0 ${collapsed ? "justify-center px-0" : "px-6 justify-between"}`}
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
          className="text-gray-400 hover:text-[#1A1A1A] transition-colors duration-200 p-1 flex-shrink-0"
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
                <span className="uppercase tracking-widest text-xs">
                  {link.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sub-label at bottom (expanded only) */}
      {!collapsed && (
        <div className="px-6 pb-6">
          <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
            Store
          </p>
        </div>
      )}
    </aside>
  );
};

/* ─── Top Header Bar ───────────────────────────────────────────────── */
const HeaderBar = ({ sidebarCollapsed }) => {
  const user = useSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-gray-100 flex items-center justify-end px-8 flex-shrink-0">
      {user?.fullname && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="uppercase tracking-widest text-xs text-[#1A1A1A] hover:text-[#C4A96B] transition-colors duration-200"
          >
            {user.fullname}
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 shadow-sm min-w-[140px] z-50">
              <button
                onClick={() => {
                  // TODO: wire up logout handler
                }}
                className="w-full text-left px-4 py-3 uppercase tracking-widest text-xs text-[#C4A96B] hover:bg-gray-50 transition-colors duration-200"
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

/* ─── Skeleton Loader ──────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-sm overflow-hidden animate-pulse">
    <div className="w-full aspect-[4/3] bg-gray-100" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="space-y-1.5">
        <div className="h-2.5 bg-gray-100 rounded w-full" />
        <div className="h-2.5 bg-gray-100 rounded w-5/6" />
        <div className="h-2.5 bg-gray-100 rounded w-2/3" />
      </div>
      <div className="flex justify-between pt-3 border-t border-gray-100">
        <div className="h-4 bg-gray-100 rounded w-1/4" />
        <div className="h-7 bg-gray-100 rounded w-20" />
      </div>
    </div>
  </div>
);

/* ─── Product Card ─────────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const { title, description, price, images } = product;
  const firstImage = images?.[0]?.url;
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/product/${product._id}`)}
      id={`product-card-${product._id}`}
      className="
        group relative bg-white border border-gray-100 rounded-sm overflow-hidden
        hover:border-[#C4A96B]/40 hover:shadow-sm
        hover:-translate-y-0.5
        transition-all duration-300 cursor-pointer
        flex flex-col
      "
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
        {firstImage ? (
          <img
            src={firstImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">
            No image
          </div>
        )}
        {/* Currency badge */}
        <span className="absolute top-3 left-3 bg-white/90 border border-gray-100 text-[#9A9A9A] text-[9px] font-normal uppercase tracking-widest px-2 py-0.5">
          {price?.currency}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 p-5 flex-grow">
        {/* Title */}
        <h3 className="text-[#1A1A1A] font-normal text-sm leading-snug line-clamp-2 group-hover:text-[#C4A96B] transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[#9A9A9A] text-xs leading-relaxed line-clamp-3 flex-grow">
          {description || "No description provided."}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span
            className="text-[#C4A96B] font-light text-base tracking-tight"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {formatPrice(price?.amount, price?.currency)}
          </span>
          <button
            id={`add-to-cart-${product._id}`}
            className="
              flex items-center gap-1.5 px-3 py-1.5
              border border-[#C4A96B] text-[#C4A96B]
              text-[9px] font-normal uppercase tracking-widest
              hover:bg-[#C4A96B] hover:text-white
              transition-all duration-200
            "
            onClick={(e) => e.stopPropagation()}
          >
            <CartIcon />
            Add
          </button>
        </div>
      </div>
    </article>
  );
};

/* ─── Homepage ─────────────────────────────────────────────────────── */
const Homepage = () => {
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await handleGetAllProducts();
      setLoading(false);
    })();
  }, []);

  /* ── Filtered list ── */
  const filtered = (products ?? []).filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen bg-[#FAF8F5] flex"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      {/* ── Page Content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* ── Top Header Bar ──────────────────────────────────────── */}
        <HeaderBar sidebarCollapsed={sidebarCollapsed} />

        {/* ── Hero Banner ─────────────────────────────────────────── */}
        <section className="w-full px-10 py-16 border-b border-gray-100 bg-white">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-[#C4A96B] text-[10px] font-normal uppercase tracking-[0.25em] mb-6">
              <SparkleIcon />
              New Arrivals
            </span>
            <h1
              className="text-5xl md:text-6xl font-light text-[#1A1A1A] leading-tight tracking-wide mb-5"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Discover Premium Products
            </h1>
            <p className="text-[#9A9A9A] text-sm leading-relaxed max-w-lg mb-8">
              Explore our curated collection of high-quality items, handpicked
              just for you.
            </p>
            {/* Search bar */}
            <div className="relative flex items-center max-w-sm">
              <span className="absolute left-0 text-gray-400 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                id="homepage-search"
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full pl-7 pr-4 py-2
                  bg-transparent border-0 border-b border-gray-300
                  text-[#1A1A1A] text-sm placeholder:text-gray-300
                  outline-none transition-colors duration-200
                  focus:border-gray-800
                "
              />
            </div>
          </div>
        </section>

        {/* ── Main Content ────────────────────────────────────────── */}
        <main className="flex-grow px-10 py-12 flex flex-col gap-6 overflow-y-auto">
          {/* Results count */}
          {!loading && (
            <p className="text-[#9A9A9A] text-xs uppercase tracking-widest">
              {search
                ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
                : `${products?.length ?? 0} product${(products?.length ?? 0) !== 1 ? "s" : ""} available`}
            </p>
          )}

          {/* Mobile search */}
          <div className="relative flex lg:hidden items-center w-full">
            <span className="absolute left-0 text-gray-400 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              id="homepage-search-mobile"
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full pl-7 pr-4 py-2
                bg-transparent border-0 border-b border-gray-300
                text-[#1A1A1A] text-sm placeholder:text-gray-300
                outline-none transition-colors duration-200
                focus:border-gray-800
              "
            />
          </div>

          {/* Loading skeleton grid */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty state – no products at all */}
          {!loading && (products?.length ?? 0) === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <div className="text-gray-200">
                <BoxIcon />
              </div>
              <div className="flex flex-col gap-2">
                <h2
                  className="text-[#1A1A1A] font-light text-2xl"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  No products available
                </h2>
                <p className="text-[#9A9A9A] text-xs uppercase tracking-widest max-w-xs">
                  Check back soon — new items are added regularly.
                </p>
              </div>
            </div>
          )}

          {/* No search results */}
          {!loading && (products?.length ?? 0) > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <span className="text-4xl">🔍</span>
              <h2
                className="text-[#1A1A1A] font-light text-xl"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                No products match &ldquo;{search}&rdquo;
              </h2>
              <button
                onClick={() => setSearch("")}
                className="text-[#C4A96B] text-xs uppercase tracking-widest hover:underline cursor-pointer"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Product grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className="border-t border-gray-100 px-10 py-6 flex items-center justify-between bg-white">
          <span className="text-[#9A9A9A] text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} Elevate Store
          </span>
          <span
            className="text-[#C4A96B] font-light text-lg tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Elevate
          </span>
        </footer>
      </div>
    </div>
  );
};

export default Homepage;
