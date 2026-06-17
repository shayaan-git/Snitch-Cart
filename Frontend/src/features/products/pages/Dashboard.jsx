import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link, useLocation } from "react-router";
import { useProduct } from "../hook/useProduct.js";

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

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─── SVG Icons ────────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
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

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.232 5.232l3.536 3.536M9 11l6.364-6.364a2.5 2.5 0 013.536 3.536L12.536 14.05A2 2 0 0111.12 14.6l-3.12.52.52-3.12a2 2 0 01.554-1.414L9 11z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18"
    />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
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
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const AlertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-10 h-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);

const BoxIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-16 h-16"
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

const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114.93-3.36M20 15a8 8 0 01-14.93 3.36"
    />
  </svg>
);

/* Sidebar nav icons */
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);
const CreateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const StoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016 2.993 2.993 0 002.25-1.016 3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
  </svg>
);

/* ─── Sidebar ──────────────────────────────────────────────────────── */
const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navLinks = [
    { label: "Dashboard", href: "/seller/dashboard", icon: <DashboardIcon /> },
    { label: "Create Product", href: "/seller/create-product", icon: <CreateIcon /> },
    { label: "Store", href: "/", icon: <StoreIcon /> },
  ];
  return (
    <aside
      className={`
        hidden lg:flex flex-col bg-white border-r border-gray-100 flex-shrink-0
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-14" : "w-56"}
      `}
    >
      {/* Brand + toggle row — same height as HeaderBar */}
      <div className={`flex items-center border-b border-gray-100 h-14 flex-shrink-0 ${collapsed ? "justify-center px-0" : "px-6 justify-between"}`}>
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
          <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">Seller Studio</p>
        </div>
      )}
    </aside>
  );
};

/* ─── Top Header Bar ───────────────────────────────────────────────── */
const HeaderBar = () => {
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

/* ─── Image Carousel ───────────────────────────────────────────────── */
const ImageCarousel = ({ images, title }) => {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-50 flex items-center justify-center">
        <span className="text-gray-300 text-xs uppercase tracking-widest">No image</span>
      </div>
    );
  }

  const prev = (e) => {
    e.stopPropagation();
    setActive((a) => (a === 0 ? images.length - 1 : a - 1));
  };
  const next = (e) => {
    e.stopPropagation();
    setActive((a) => (a === images.length - 1 ? 0 : a + 1));
  };

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden group/carousel bg-gray-50">
      {/* Main image */}
      <img
        src={images[active]?.url}
        alt={`${title} — image ${active + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="lazy"
      />

      {/* Gradient overlay bottom */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      {/* Navigation arrows — only show when multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 bg-white/80 hover:bg-white text-[#1A1A1A] rounded-full p-1.5"
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 bg-white/80 hover:bg-white text-[#1A1A1A] rounded-full p-1.5"
            aria-label="Next image"
          >
            <ChevronRightIcon />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(i);
                }}
                aria-label={`Image ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === active
                    ? "bg-[#C4A96B] scale-125"
                    : "bg-white/60 hover:bg-white/90"
                }`}
              />
            ))}
          </div>

          {/* Image counter badge */}
          <span className="absolute top-2 right-2 bg-white/80 text-[#9A9A9A] text-[10px] font-normal px-2 py-0.5">
            {active + 1}/{images.length}
          </span>
        </>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-0 inset-x-0 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 px-2 pb-2 flex gap-1 justify-center">
          {images.map((img, i) => (
            <button
              key={img._id ?? i}
              onClick={(e) => {
                e.stopPropagation();
                setActive(i);
              }}
              className={`w-8 h-8 overflow-hidden border-2 transition-all duration-150 flex-shrink-0 ${
                i === active
                  ? "border-[#C4A96B] scale-110"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Go to image ${i + 1}`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Product Card ─────────────────────────────────────────────────── */
const ProductCard = ({ product, onClick }) => {
  const { title, description, price, images, createdAt } = product;

  return (
    <article
      onClick={() => onClick(product)}
      id={`product-card-${product._id}`}
      className="
        group relative bg-white border border-gray-100 rounded-sm overflow-hidden
        hover:border-[#C4A96B]/40 hover:shadow-sm
        transition-all duration-300 cursor-pointer
        flex flex-col
      "
    >
      {/* Carousel */}
      <ImageCarousel images={images} title={title} />

      {/* Body */}
      <div className="flex flex-col gap-3 p-5 flex-grow">
        {/* Title */}
        <h3 className="text-[#1A1A1A] font-normal text-sm leading-snug line-clamp-2 group-hover:text-[#C4A96B] transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[#9A9A9A] text-xs leading-relaxed line-clamp-3 flex-grow">
          {description || "No description provided."}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span
            className="text-[#C4A96B] font-light text-base tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {formatPrice(price?.amount, price?.currency)}
          </span>
          <span className="text-[#9A9A9A] text-[10px] uppercase tracking-widest">
            Added {formatDate(createdAt)}
          </span>
        </div>
      </div>

      {/* Action buttons — revealed on hover */}
      <div
        className="
          absolute top-3 left-3 flex gap-1.5
          opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
          transition-all duration-200
        "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id={`edit-btn-${product._id}`}
          title="Edit product"
          className="
            flex items-center gap-1.5 px-2.5 py-1.5
            bg-white/95 border border-gray-200
            text-[#1A1A1A] hover:text-[#C4A96B] hover:border-[#C4A96B]/40
            text-[10px] font-normal uppercase tracking-widest
            transition-all duration-150
          "
        >
          <EditIcon />
          Edit
        </button>
        <button
          id={`delete-btn-${product._id}`}
          title="Delete product"
          className="
            flex items-center gap-1.5 px-2.5 py-1.5
            bg-white/95 border border-gray-200
            text-[#1A1A1A] hover:text-red-500 hover:border-red-200
            text-[10px] font-normal uppercase tracking-widest
            transition-all duration-150
          "
        >
          <TrashIcon />
          Delete
        </button>
      </div>
    </article>
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
        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  </div>
);

/* ─── Dashboard ────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct();
  const navigate = useNavigate();

  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-desc"); // date-desc | date-asc | price-asc | price-desc
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  const handleCardClick = useCallback(
    (product) => {
      // Navigate to detail/edit view — adjust path as needed
      navigate(`/seller/product/${product._id}`);
    },
    [navigate],
  );

  /* ── Derived / filtered list ── */
  const filtered = (sellerProducts ?? [])
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "date-desc")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "date-asc")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "price-asc")
        return (a.price?.amount ?? 0) - (b.price?.amount ?? 0);
      if (sortBy === "price-desc")
        return (b.price?.amount ?? 0) - (a.price?.amount ?? 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />

      {/* ── Page Content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* ── Top Header Bar ──────────────────────────────────────── */}
        <HeaderBar />

        {/* ── Main ─────────────────────────────────────────────────── */}
        <main className="flex-grow px-10 py-12 flex flex-col gap-8 overflow-y-auto">

          {/* ── Page Header ────────────────────────────────────────── */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-normal uppercase tracking-[0.25em] text-[#C4A96B]">
                Seller / Dashboard
              </span>
              <h1
                className="text-3xl font-light tracking-wide text-[#1A1A1A] leading-tight mt-1"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                My Products
              </h1>
              <p className="text-[#9A9A9A] text-xs uppercase tracking-widest mt-1">
                {loading
                  ? "Loading your inventory…"
                  : `${sellerProducts?.length ?? 0} product${(sellerProducts?.length ?? 0) !== 1 ? "s" : ""} in your collection`}
              </p>
            </div>
          </header>

          {/* ── Stats Row ──────────────────────────────────────────── */}
          {!loading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-100 px-8 py-6 rounded-sm">
                <p
                  className="text-5xl font-light text-[#1A1A1A]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {sellerProducts?.length ?? 0}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A] mt-2">
                  Total Products
                </p>
              </div>
              <div className="bg-white border border-gray-100 px-8 py-6 rounded-sm">
                <p
                  className="text-5xl font-light text-[#C4A96B]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {filtered.length}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A] mt-2">
                  {search ? "Matching" : "Listed"}
                </p>
              </div>
              <div className="bg-white border border-gray-100 px-8 py-6 rounded-sm hidden sm:block">
                <p
                  className="text-5xl font-light text-[#1A1A1A]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {sellerProducts?.length > 0
                    ? formatPrice(
                        Math.max(...(sellerProducts ?? []).map((p) => p.price?.amount ?? 0)),
                        (sellerProducts ?? [])[0]?.price?.currency ?? "INR",
                      )
                    : "—"}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A] mt-2">
                  Highest Price
                </p>
              </div>
            </div>
          )}

          {/* ── Search + Sort bar ──────────────────────────────────── */}
          {!loading && !error && (sellerProducts?.length ?? 0) > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-grow flex items-center">
                <span className="absolute left-0 text-gray-400 pointer-events-none">
                  <SearchIcon />
                </span>
                <input
                  id="product-search"
                  type="text"
                  placeholder="Search by title…"
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
              {/* Sort */}
              <select
                id="product-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="
                  bg-transparent border-0 border-b border-gray-300
                  py-2 px-1 text-[#1A1A1A] text-xs uppercase tracking-widest
                  outline-none transition-colors duration-200 cursor-pointer
                  focus:border-gray-800 appearance-none min-w-[180px]
                "
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="price-asc">Price: Low → High</option>
              </select>
            </div>
          )}

          {/* ── States ─────────────────────────────────────────────── */}

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <div className="text-red-300">
                <AlertIcon />
              </div>
              <div className="flex flex-col gap-2">
                <h2
                  className="text-[#1A1A1A] font-light text-2xl"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Something went wrong
                </h2>
                <p className="text-[#9A9A9A] text-xs uppercase tracking-widest max-w-sm">{error}</p>
              </div>
              <button
                id="retry-btn"
                onClick={() => handleGetSellerProduct()}
                className="
                  flex items-center gap-2 px-6 py-3
                  border border-gray-200 text-[#1A1A1A]
                  text-[10px] font-normal uppercase tracking-widest
                  hover:border-[#C4A96B] hover:text-[#C4A96B] transition-all duration-200
                  cursor-pointer
                "
              >
                <RefreshIcon />
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && (sellerProducts?.length ?? 0) === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <div className="text-gray-200">
                <BoxIcon />
              </div>
              <div className="flex flex-col gap-2">
                <h2
                  className="text-[#1A1A1A] font-light text-2xl"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  No products listed yet
                </h2>
                <p className="text-[#9A9A9A] text-xs uppercase tracking-widest max-w-xs">
                  Start building your collection by adding your first luxury item.
                </p>
              </div>
              <button
                id="empty-add-product-btn"
                onClick={() => navigate("/seller/create-product")}
                className="
                  flex items-center gap-2 px-8 py-4
                  bg-[#C4A96B] text-white
                  text-[10px] font-normal uppercase tracking-[0.2em]
                  rounded-none
                  hover:opacity-90 transition-opacity duration-200 cursor-pointer
                "
              >
                <PlusIcon />
                Add Your First Product
              </button>
            </div>
          )}

          {/* No search results */}
          {!loading &&
            !error &&
            (sellerProducts?.length ?? 0) > 0 &&
            filtered.length === 0 && (
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
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
