import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";

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

/* ─── Skeleton Loader ──────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-[#1c1b1b] border border-white/[0.07] rounded-2xl overflow-hidden animate-pulse">
    <div className="w-full aspect-[4/3] bg-[#2a2a2a]" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-4 bg-[#2a2a2a] rounded-lg w-3/4" />
      <div className="space-y-1.5">
        <div className="h-3 bg-[#2a2a2a] rounded w-full" />
        <div className="h-3 bg-[#2a2a2a] rounded w-5/6" />
        <div className="h-3 bg-[#2a2a2a] rounded w-2/3" />
      </div>
      <div className="flex justify-between pt-2 border-t border-white/[0.06]">
        <div className="h-5 bg-[#2a2a2a] rounded w-1/4" />
        <div className="h-8 bg-[#2a2a2a] rounded-xl w-24" />
      </div>
    </div>
  </div>
);

/* ─── Product Card ─────────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const { title, description, price, images } = product;
  const firstImage = images?.[0]?.url;

  return (
    <article
      id={`product-card-${product._id}`}
      className="
        group relative bg-[#1c1b1b] border border-white/[0.07] rounded-2xl overflow-hidden
        hover:border-[#f5c518]/30 hover:shadow-[0_0_40px_rgba(245,197,24,0.08)]
        hover:-translate-y-1
        transition-all duration-300 cursor-pointer
        flex flex-col
      "
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#161515]">
        {firstImage ? (
          <img
            src={firstImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#4e4633] text-xs">
            No image
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Currency badge */}
        <span className="absolute top-2.5 left-2.5 bg-[#f5c518]/10 backdrop-blur-sm border border-[#f5c518]/20 text-[#f5c518] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          {price?.currency}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 p-4 flex-grow">
        {/* Title */}
        <h3 className="text-[#e5e2e1] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#f5c518] transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[#9a9078] text-xs leading-relaxed line-clamp-3 flex-grow">
          {description || "No description provided."}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.06]">
          <span className="text-[#f5c518] font-bold text-base tracking-tight">
            {formatPrice(price?.amount, price?.currency)}
          </span>
          <button
            id={`add-to-cart-${product._id}`}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl
              bg-[#f5c518]/10 border border-[#f5c518]/20 text-[#f5c518]
              text-[10px] font-bold uppercase tracking-widest
              hover:bg-[#f5c518] hover:text-[#1a1200]
              transition-all duration-200 active:scale-[0.96]
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
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-['Inter',sans-serif] antialiased flex flex-col">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="w-full sticky top-0 z-50 border-b border-white/10 bg-[#131313]/90 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-5 md:px-16 max-w-[1280px] mx-auto h-16 md:h-20">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl font-bold tracking-tighter text-[#f5c518] leading-none">
              Elevate
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a9078] mt-3 ml-1 hidden sm:block">
              Store
            </span>
          </div>

          {/* Search bar */}
          <div className="relative hidden sm:flex items-center w-72 lg:w-96">
            <span className="absolute left-3.5 text-[#4e4633] pointer-events-none">
              <SearchIcon />
            </span>
            <input
              id="homepage-search"
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full pl-10 pr-4 py-2 bg-[#1c1b1b] border border-[#27272a]
                rounded-xl text-[#e5e2e1] text-sm placeholder:text-[#4e4633]
                outline-none transition-all duration-200
                focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/30
                hover:border-[#4e4633]
              "
            />
          </div>
        </div>
      </nav>

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <section className="relative w-full px-5 md:px-16 max-w-[1280px] mx-auto pt-12 pb-10 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#f5c518]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col gap-3 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-[#f5c518] text-[11px] font-semibold uppercase tracking-[0.2em]">
            <SparkleIcon />
            New Arrivals
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
            Discover
            <span className="text-[#f5c518]"> Premium</span> Products
          </h1>
          <p className="text-[#9a9078] text-sm md:text-base leading-relaxed max-w-lg">
            Explore our curated collection of high-quality items, handpicked
            just for you.
          </p>
        </div>

        {/* Mobile search */}
        <div className="relative flex sm:hidden items-center mt-6 w-full">
          <span className="absolute left-3.5 text-[#4e4633] pointer-events-none">
            <SearchIcon />
          </span>
          <input
            id="homepage-search-mobile"
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2.5 bg-[#1c1b1b] border border-[#27272a]
              rounded-xl text-[#e5e2e1] text-sm placeholder:text-[#4e4633]
              outline-none transition-all duration-200
              focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/30
            "
          />
        </div>
      </section>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="flex-grow px-5 md:px-16 pb-16 max-w-[1280px] w-full mx-auto flex flex-col gap-6">
        {/* Results count */}
        {!loading && (
          <p className="text-[#4e4633] text-xs font-medium">
            {search
              ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
              : `${products?.length ?? 0} product${(products?.length ?? 0) !== 1 ? "s" : ""} available`}
          </p>
        )}

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
            <div className="text-[#4e4633]">
              <BoxIcon />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#e5e2e1] font-semibold text-xl">
                No products available
              </h2>
              <p className="text-[#9a9078] text-sm max-w-xs">
                Check back soon — new items are added regularly.
              </p>
            </div>
          </div>
        )}

        {/* No search results */}
        {!loading && (products?.length ?? 0) > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="text-4xl">🔍</span>
            <h2 className="text-[#e5e2e1] font-semibold text-lg">
              No products match &ldquo;{search}&rdquo;
            </h2>
            <button
              onClick={() => setSearch("")}
              className="text-[#f5c518] text-sm hover:underline cursor-pointer"
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
      <footer className="border-t border-white/[0.07] px-5 md:px-16 py-6 max-w-[1280px] w-full mx-auto flex items-center justify-between">
        <span className="text-[#4e4633] text-xs">
          © {new Date().getFullYear()} Elevate Store
        </span>
        <span className="text-[#f5c518] font-bold text-lg tracking-tighter">
          Elevate
        </span>
      </footer>
    </div>
  );
};

export default Homepage;
