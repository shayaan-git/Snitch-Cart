import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
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

/* ─── Image Carousel ───────────────────────────────────────────────── */
const ImageCarousel = ({ images, title }) => {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-[#1c1b1b] flex items-center justify-center rounded-t-2xl">
        <span className="text-[#4e4633] text-xs">No image</span>
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
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-2xl group/carousel bg-[#1c1b1b]">
      {/* Main image */}
      <img
        src={images[active]?.url}
        alt={`${title} — image ${active + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="lazy"
      />

      {/* Gradient overlay bottom */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

      {/* Navigation arrows — only show when multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 backdrop-blur-sm"
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
                    ? "bg-[#f5c518] scale-125"
                    : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Image counter badge */}
          <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
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
              className={`w-8 h-8 rounded overflow-hidden border-2 transition-all duration-150 flex-shrink-0 ${
                i === active
                  ? "border-[#f5c518] scale-110"
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
        group relative bg-[#1c1b1b] border border-white/[0.07] rounded-2xl overflow-hidden
        hover:border-[#f5c518]/30 hover:shadow-[0_0_40px_rgba(245,197,24,0.08)]
        transition-all duration-300 cursor-pointer
        flex flex-col
      "
    >
      {/* Carousel */}
      <ImageCarousel images={images} title={title} />

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-grow">
        {/* Title */}
        <h3 className="text-[#e5e2e1] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#f5c518] transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[#9a9078] text-xs leading-relaxed line-clamp-3 flex-grow">
          {description || "No description provided."}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/[0.06]">
          <span className="text-[#f5c518] font-bold text-base tracking-tight">
            {formatPrice(price?.amount, price?.currency)}
          </span>
          <span className="text-[#4e4633] text-[10px] font-medium">
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
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
            bg-[#1c1b1b]/90 backdrop-blur-sm border border-white/10
            text-[#e5e2e1] hover:text-[#f5c518] hover:border-[#f5c518]/40
            text-[10px] font-semibold uppercase tracking-wider
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
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
            bg-[#1c1b1b]/90 backdrop-blur-sm border border-white/10
            text-[#e5e2e1] hover:text-[#ffb4ab] hover:border-[#93000a]/50
            text-[10px] font-semibold uppercase tracking-wider
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
        <div className="h-3 bg-[#2a2a2a] rounded w-1/3" />
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
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-['Inter',sans-serif] antialiased flex flex-col">
      {/* ── Top Nav ─────────────────────────────────────────────── */}
      <nav className="w-full sticky top-0 z-50 border-b border-white/10 bg-[#131313]">
        <div className="flex justify-between items-center w-full px-5 md:px-16 max-w-[1280px] mx-auto h-16 md:h-20">
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl font-bold tracking-tighter text-[#f5c518] leading-none">
              Elevate
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a9078] mt-3 ml-1 hidden sm:block">
              Seller Studio
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 h-full">
            {["Dashboard", "Inventory", "Orders", "Analytics"].map((item) => (
              <a
                key={item}
                href="#"
                className={`text-[11px] font-semibold uppercase tracking-widest transition-colors duration-200 h-full flex items-center border-b-2 px-1 ${
                  item === "Dashboard"
                    ? "text-[#f5c518] border-[#f5c518]"
                    : "text-[#9a9078] border-transparent hover:text-[#e5e2e1] hover:border-white/10"
                }`}
              >
                {item}
              </a>
            ))}
          </div>
          {/* Add Product CTA (nav) */}
          <button
            id="nav-add-product-btn"
            onClick={() => navigate("/seller/create-product")}
            className="
              flex items-center gap-2 px-4 py-2 rounded-xl
              bg-[#f5c518] text-[#1a1200]
              text-[11px] font-bold uppercase tracking-widest
              hover:bg-[#ffe08b] shadow-[0_0_20px_rgba(245,197,24,0.2)]
              hover:shadow-[0_0_28px_rgba(245,197,24,0.35)]
              transition-all duration-200 active:scale-[0.97] cursor-pointer
            "
          >
            <PlusIcon />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </nav>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <main className="flex-grow px-5 md:px-16 py-8 max-w-[1280px] w-full mx-auto flex flex-col gap-8">
        {/* ── Page Header ────────────────────────────────────────── */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f5c518]">
              Seller / Dashboard
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
              My Products
            </h1>
            <p className="text-[#9a9078] text-sm mt-1">
              {loading
                ? "Loading your inventory…"
                : `${sellerProducts?.length ?? 0} product${(sellerProducts?.length ?? 0) !== 1 ? "s" : ""} in your collection`}
            </p>
          </div>
        </header>

        {/* ── Search + Sort bar ──────────────────────────────────── */}
        {!loading && !error && (sellerProducts?.length ?? 0) > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-grow">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4e4633] pointer-events-none">
                <SearchIcon />
              </span>
              <input
                id="product-search"
                type="text"
                placeholder="Search by title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-2.5 bg-[#1c1b1b] border border-[#27272a]
                  rounded-xl text-[#e5e2e1] text-sm placeholder:text-[#4e4633]
                  outline-none transition-all duration-200
                  focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/30
                  hover:border-[#4e4633]
                "
              />
            </div>
            {/* Sort */}
            <select
              id="product-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="
                bg-[#1c1b1b] border border-[#27272a] rounded-xl
                px-4 py-2.5 text-[#e5e2e1] text-sm font-medium
                outline-none transition-all duration-200 cursor-pointer
                focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/30
                hover:border-[#4e4633] appearance-none min-w-[180px]
              "
            >
              <option value="date-desc" className="bg-[#1c1b1b]">
                Newest First
              </option>
              <option value="date-asc" className="bg-[#1c1b1b]">
                Oldest First
              </option>
              <option value="price-desc" className="bg-[#1c1b1b]">
                Price: High → Low
              </option>
              <option value="price-asc" className="bg-[#1c1b1b]">
                Price: Low → High
              </option>
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
            <div className="text-[#ffb4ab]">
              <AlertIcon />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#e5e2e1] font-semibold text-lg">
                Something went wrong
              </h2>
              <p className="text-[#9a9078] text-sm max-w-sm">{error}</p>
            </div>
            <button
              id="retry-btn"
              onClick={() => handleGetSellerProduct()}
              className="
                flex items-center gap-2 px-5 py-2.5 rounded-xl
                bg-[#1c1b1b] border border-white/10
                text-[#e5e2e1] text-[11px] font-semibold uppercase tracking-widest
                hover:bg-white/5 hover:border-white/20 transition-all duration-200
                active:scale-[0.97] cursor-pointer
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
            <div className="text-[#4e4633]">
              <BoxIcon />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#e5e2e1] font-semibold text-xl">
                No products listed yet
              </h2>
              <p className="text-[#9a9078] text-sm max-w-xs">
                Start building your collection by adding your first luxury item.
              </p>
            </div>
            <button
              id="empty-add-product-btn"
              onClick={() => navigate("/seller/create-product")}
              className="
                flex items-center gap-2 px-6 py-3 rounded-xl
                bg-[#f5c518] text-[#1a1200]
                text-[11px] font-bold uppercase tracking-widest
                hover:bg-[#ffe08b] shadow-[0_0_20px_rgba(245,197,24,0.25)]
                hover:shadow-[0_0_28px_rgba(245,197,24,0.4)]
                transition-all duration-200 active:scale-[0.97] cursor-pointer
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
  );
};

export default Dashboard;
