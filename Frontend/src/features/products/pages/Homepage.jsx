import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router";
import { useProduct } from "../hook/useProduct";
import { SearchIcon, SparkleIcon, BoxIcon } from "../components/icons.jsx";
import BuyerSidebar from "../components/BuyerSidebar.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import BuyerProductCard from "../components/BuyerProductCard.jsx";

/* ─── Homepage ─────────────────────────────────────────────────────── */
const Homepage = () => {
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const {
    mobileSidebarOpen,
    setMobileSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useOutletContext();

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
      className="flex-1 h-full bg-[#FAF8F5] flex overflow-hidden"
      style={{ fontFamily: "'Nib Pro', serif" }}
    >
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <BuyerSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── Page Content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* ── Top Header Bar ──────────────────────────────────────── */}
        {/* <HeaderBar onMenuClick={() => setMobileSidebarOpen(true)} /> */}

        {/* ── Hero Banner ─────────────────────────────────────────── */}
        <section className="w-full px-10 py-5 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-[#C4A96B] text-[10px] font-normal uppercase tracking-[0.25em] mb-2">
              <SparkleIcon />
              New Arrivals
            </span>
            <h1
              className="text-5xl md:text-5xl font-light text-[#1A1A1A] leading-tight tracking-wide mb-2"
              style={{ fontFamily: "'Nib Pro', serif" }}
            >
              Discover Your Fashion
            </h1>
            <p className="text-[#9A9A9A] text-sm leading-relaxed max-w-lg mb-4">
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
        <main className="flex-1 px-10 py-12 flex flex-col gap-6">
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
                  style={{ fontFamily: "'Nib Pro', serif" }}
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
              <span className="text-4xl">
                <SearchIcon className="w-8 h-8" />
              </span>
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
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <BuyerProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className="border-t border-gray-100 px-10 py-6 flex items-center justify-between bg-white flex-shrink-0">
          <span className="text-[#9A9A9A] text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} Elevate Store
          </span>
          <span
            className="text-[#C4A96B] font-light text-lg tracking-wide"
            style={{ fontFamily: "'Nib Pro', serif" }}
          >
            Elevate
          </span>
        </footer>
      </div>
    </div>
  );
};

export default Homepage;
