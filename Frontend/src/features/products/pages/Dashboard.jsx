import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router";
import { useProduct } from "../hook/useProduct.js";
import { formatPrice } from "../utils/formatters.js";
import {
  SearchIcon,
  PlusIcon,
  AlertIcon,
  BoxIcon,
  RefreshIcon,
} from "../components/icons.jsx";
import SellerSidebar from "../components/SellerSidebar.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import SellerProductCard from "../components/SellerProductCard.jsx";

/* ─── Dashboard ────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct();
  const navigate = useNavigate();

  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { mobileSidebarOpen, setMobileSidebarOpen } = useOutletContext();

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  const handleCardClick = useCallback(
    (product) => {
      navigate(`/seller/product/${product._id}`);
    },
    [navigate],
  );

  /* ── Derived / filtered list ── */
  const filtered = (sellerProducts ?? [])
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
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

  /* ── Highest price (rounded to 2dp to prevent float overflow) ── */
  const highestPrice =
    sellerProducts?.length > 0
      ? formatPrice(
          parseFloat(
            Math.max(
              ...(sellerProducts ?? []).map((p) => p.price?.amount ?? 0),
            ).toFixed(2),
          ),
          (sellerProducts ?? [])[0]?.price?.currency ?? "INR",
        )
      : "—";

  return (
    <div
      className="h-screen bg-[#FAF8F5] flex overflow-hidden"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <SellerSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── Page Content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Main ─────────────────────────────────────────────────── */}
        <main className="flex-1 px-4 sm:px-8 lg:px-10 py-6 sm:py-10 flex flex-col gap-6 sm:gap-8 overflow-y-auto">

          {/* ── Page Header ────────────────────────────────────────── */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6 sm:pb-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-normal uppercase tracking-[0.25em] text-[#C4A96B]">
                Seller / Dashboard
              </span>
              <h1
                className="text-2xl sm:text-3xl font-light tracking-wide text-[#1A1A1A] leading-tight mt-1"
                style={{ fontFamily: "'Nib Pro', serif" }}
              >
                My Products
              </h1>
              <p className="text-[#9A9A9A] text-xs uppercase tracking-widest mt-1">
                {loading
                  ? "Loading your inventory…"
                  : `${sellerProducts?.length ?? 0} product${(sellerProducts?.length ?? 0) !== 1 ? "s" : ""} in your collection`}
              </p>
            </div>
            {/* Add product CTA — always visible in header */}
            <button
              id="add-product-btn"
              onClick={() => navigate("/seller/create-product")}
              className="
                self-start sm:self-auto
                flex items-center gap-2 px-5 py-2.5
                bg-[#C4A96B] text-white
                text-[10px] font-normal uppercase tracking-[0.2em]
                hover:opacity-90 transition-opacity duration-200 cursor-pointer
              "
            >
              <PlusIcon />
              New Product
            </button>
          </header>

          {/* ── Stats Row ──────────────────────────────────────────── */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
              {/* Total products */}
              <div className="bg-white border border-gray-100 px-4 sm:px-8 py-4 sm:py-6 rounded-sm">
                <p
                  className="text-3xl sm:text-5xl font-light text-[#1A1A1A] leading-none"
                  style={{ fontFamily: "'Nib Pro', serif" }}
                >
                  {sellerProducts?.length ?? 0}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A] mt-2">
                  Total Products
                </p>
              </div>

              {/* Matching / listed */}
              <div className="bg-white border border-gray-100 px-4 sm:px-8 py-4 sm:py-6 rounded-sm">
                <p
                  className="text-3xl sm:text-5xl font-light text-[#C4A96B] leading-none"
                  style={{ fontFamily: "'Nib Pro', serif" }}
                >
                  {filtered.length}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A] mt-2">
                  {search ? "Matching" : "Listed"}
                </p>
              </div>

              {/* Highest price — shown on all sizes, truncates if float is long */}
              <div className="bg-white border border-gray-100 px-4 sm:px-8 py-4 sm:py-6 rounded-sm min-w-0 overflow-hidden">
                <p
                  className="text-xl sm:text-2xl lg:text-3xl font-light text-[#1A1A1A] leading-snug truncate"
                  style={{ fontFamily: "'Nib Pro', serif" }}
                  title={highestPrice}
                >
                  {highestPrice}
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
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-6 text-center">
              <div className="text-red-300">
                <AlertIcon />
              </div>
              <div className="flex flex-col gap-2">
                <h2
                  className="text-[#1A1A1A] font-light text-2xl"
                  style={{ fontFamily: "'Nib Pro', serif" }}
                >
                  Something went wrong
                </h2>
                <p className="text-[#9A9A9A] text-xs uppercase tracking-widest max-w-sm">
                  {error}
                </p>
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
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-6 text-center">
              <div className="text-gray-200">
                <BoxIcon />
              </div>
              <div className="flex flex-col gap-2">
                <h2
                  className="text-[#1A1A1A] font-light text-2xl"
                  style={{ fontFamily: "'Nib Pro', serif" }}
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
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-4 text-center">
                <span className="text-4xl">🔍</span>
                <h2
                  className="text-[#1A1A1A] font-light text-xl"
                  style={{ fontFamily: "'Nib Pro', serif" }}
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
                <SellerProductCard
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
