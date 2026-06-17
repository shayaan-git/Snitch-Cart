import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import HeaderBar from "../components/HeaderBar.jsx";
import { formatPrice } from "../utils/formatters.js";


/* ─── Currency symbol map ─────────────────────────────────────────── */
// const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };

// function formatPrice(amount, currency) {
//   const symbol = CURRENCY_SYMBOLS[currency] ?? currency + " ";
//   return `${symbol}${Number(amount).toLocaleString("en-IN")}`;
// }

/* ─── SVG Icons ────────────────────────────────────────────────────── */
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
const BoltIcon = () => (
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
      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    />
  </svg>
);
const ArrowLeftIcon = () => (
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
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);
const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2l2.09 6.26L20 10l-6 3.5L12 22l-2-8.5L4 10l5.91-1.74L12 2z" />
  </svg>
);
const ChevronImgLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronImgRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

/* ─── Sidebar (identical to Homepage) ─────────────────────────────── */
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

/* ─── Top Header Bar (identical to Homepage) ───────────────────────── */
<HeaderBar />;

/* ─── Skeleton Loader ──────────────────────────────────────────────── */
const SkeletonDetail = () => (
  <div className="flex flex-col lg:flex-row gap-10 animate-pulse">
    {/* Image skeleton */}
    <div className="flex-1 flex flex-col gap-4">
      <div className="w-full aspect-square bg-gray-100 rounded-sm" />
      <div className="flex gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="w-20 h-20 bg-gray-100 rounded-sm" />
        ))}
      </div>
    </div>
    {/* Info skeleton */}
    <div className="flex-1 flex flex-col gap-5 pt-2">
      <div className="h-3 bg-gray-100 rounded w-1/4" />
      <div className="h-8 bg-gray-100 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-2.5 bg-gray-100 rounded w-full" />
        <div className="h-2.5 bg-gray-100 rounded w-5/6" />
        <div className="h-2.5 bg-gray-100 rounded w-2/3" />
      </div>
      <div className="h-10 bg-gray-100 rounded w-1/3 mt-4" />
      <div className="flex gap-3 mt-2">
        <div className="h-11 bg-gray-100 rounded w-36" />
        <div className="h-11 bg-gray-100 rounded w-36" />
      </div>
    </div>
  </div>
);

/* ─── ProductDetail ────────────────────────────────────────────────── */
const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { handleGetProductById } = useProduct();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await handleGetProductById(productId);
      setProduct(data);
      setLoading(false);
    })();
  }, [productId]);

  const images = product?.images ?? [];
  const currentImage = images[activeImg]?.url;

  return (
    <div
      className="h-screen overflow-hidden bg-[#FAF8F5] flex"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
    >
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      {/* ── Page Content ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Header ──────────────────────────────────────────────── */}
        <HeaderBar />

        {/* ── Breadcrumb / Back ────────────────────────────────────── */}
        <div className="px-10 pt-8 pb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#9A9A9A]">
          <button
            onClick={() => navigate(-1)}
            id="product-detail-back-btn"
            className="flex items-center gap-1.5 hover:text-[#C4A96B] transition-colors duration-200"
          >
            <ArrowLeftIcon />
            Back
          </button>
          <span className="text-gray-200">/</span>
          <Link
            to="/"
            className="hover:text-[#C4A96B] transition-colors duration-200"
          >
            Store
          </Link>
          {product && (
            <>
              <span className="text-gray-200">/</span>
              <span className="text-[#1A1A1A] truncate max-w-[200px]">
                {product.title}
              </span>
            </>
          )}
        </div>

        {/* ── Main ─────────────────────────────────────────────────── */}
        <main className="flex-1 px-10 py-8 overflow-y-auto">
          {loading ? (
            <SkeletonDetail />
          ) : !product ? (
            /* ── Not found ── */
            <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
              <span className="text-6xl">🕵️</span>
              <h2 className="text-2xl font-light text-[#1A1A1A]">
                Product not found
              </h2>
              <p className="text-[#9A9A9A] text-xs uppercase tracking-widest">
                It may have been removed or the link is incorrect.
              </p>
              <Link
                to="/"
                className="mt-2 text-[#C4A96B] text-xs uppercase tracking-widest hover:underline"
              >
                Return to Store
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 max-w-6xl">
              {/* ── Gallery ──────────────────────────────────────── */}
              <div className="lg:w-[44%] flex-shrink-0 flex flex-col gap-4">
                {/* Gallery inner: [thumbs col] [main image] */}
                <div className="flex flex-row-reverse gap-3">
                  {/* Main image — takes the remaining width */}
                  <div className="relative flex-1 aspect-[4/3] max-h-[480px] bg-[#FAF8F5] border border-gray-100 rounded-sm overflow-hidden group">
                    {currentImage ? (
                      <img
                        key={activeImg}
                        src={currentImage}
                        alt={product.title}
                        className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">
                        No image
                      </div>
                    )}

                    {/* Currency badge */}
                    <span className="absolute top-4 left-4 bg-white/90 border border-gray-100 text-[#9A9A9A] text-[9px] font-normal uppercase tracking-widest px-2.5 py-1">
                      {product.price?.currency}
                    </span>

                    {/* Image counter */}
                    {images.length > 1 && (
                      <span className="absolute bottom-4 right-4 bg-white/90 border border-gray-100 text-[#9A9A9A] text-[9px] uppercase tracking-widest px-2.5 py-1">
                        {activeImg + 1} / {images.length}
                      </span>
                    )}

                    {/* ← Prev arrow */}
                    {images.length > 1 && (
                      <button
                        id="product-detail-img-prev"
                        onClick={() =>
                          setActiveImg(
                            (prev) =>
                              (prev - 1 + images.length) % images.length,
                          )
                        }
                        aria-label="Previous image"
                        className="
                          absolute left-3 top-1/2 -translate-y-1/2
                          w-9 h-9 flex items-center justify-center 
                          bg-white/80 border border-gray-100 text-[#1A1A1A] cursor-pointer
                          hover:bg-[#C4A96B] hover:text-white hover:border-[#C4A96B]
                          transition-all duration-200 opacity-0 group-hover:opacity-100
                          rounded-sm
                        "
                      >
                        <ChevronImgLeft />
                      </button>
                    )}

                    {/* → Next arrow */}
                    {images.length > 1 && (
                      <button
                        id="product-detail-img-next"
                        onClick={() =>
                          setActiveImg((prev) => (prev + 1) % images.length)
                        }
                        aria-label="Next image"
                        className="
                          absolute right-3 top-1/2 -translate-y-1/2
                          w-9 h-9 flex items-center justify-center
                          bg-white/80 border border-gray-100 text-[#1A1A1A] cursor-pointer
                          hover:bg-[#C4A96B] hover:text-white hover:border-[#C4A96B]
                          transition-all duration-200 opacity-0 group-hover:opacity-100
                          rounded-sm
                        "
                      >
                        <ChevronImgRight />
                      </button>
                    )}
                  </div>

                  {/* Vertical thumbnail strip — left of main image */}
                  {images.length > 1 && (
                    <div className="hidden lg:flex flex-col gap-2 overflow-y-auto max-h-[480px]">
                      {images.map((img, idx) => (
                        <button
                          key={img._id ?? idx}
                          id={`product-detail-thumb-${idx}`}
                          onClick={() => setActiveImg(idx)}
                          className={`
                            w-16 h-16 flex-shrink-0 border rounded-sm overflow-hidden transition-all duration-200
                            ${
                              activeImg === idx
                                ? "border-[#C4A96B] ring-1 ring-[#C4A96B]/40"
                                : "border-gray-100 hover:border-[#C4A96B]/50"
                            }
                          `}
                          aria-label={`View image ${idx + 1}`}
                        >
                          <img
                            src={img.url}
                            alt={`${product.title} thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover cursor-pointer hover:bg-[#C4A96B]"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Horizontal Thumbnails */}
                {images.length > 1 && (
                  <div className="flex lg:hidden gap-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={img._id ?? idx}
                        id={`product-detail-thumb-mobile-${idx}`}
                        onClick={() => setActiveImg(idx)}
                        className={`
                          w-16 h-16 flex-shrink-0 border rounded-sm overflow-hidden transition-all duration-200
                          ${
                            activeImg === idx
                              ? "border-[#C4A96B] ring-1 ring-[#C4A96B]/40"
                              : "border-gray-100 hover:border-[#C4A96B]/50"
                          }
                        `}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <img
                          src={img.url}
                          alt={`${product.title} thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Product Info ──────────────────────────────────── */}
              <div className="flex-1 flex flex-col gap-6 lg:pt-2">
                {/* Label */}
                <span className="inline-flex items-center gap-1.5 text-[#C4A96B] text-[10px] font-normal uppercase tracking-[0.25em]">
                  <SparkleIcon />
                  Premium Collection
                </span>

                {/* Title */}
                <h1
                  className="text-4xl md:text-5xl font-light text-[#1A1A1A] leading-tight tracking-wide"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {product.title}
                </h1>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Description */}
                <p className="text-[#9A9A9A] text-sm leading-relaxed">
                  {product.description || "No description provided."}
                </p>

                {/* Price */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
                    Price
                  </span>
                  <span
                    className="text-[#C4A96B] text-3xl font-light font-normal uppercase tracking-wide"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {formatPrice(
                      product.price?.amount,
                      product.price?.currency,
                    )}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 ">
                  {/* Add to Cart */}
                  <button
                    id="product-detail-add-to-cart"
                    className="
                      flex items-center justify-center gap-2 px-8 py-3
                      border border-[#C4A96B] text-[#C4A96B] cursor-pointer
                      text-[10px] font-normal uppercase tracking-widest
                      hover:bg-[#C4A96B] hover:text-white
                      transition-all duration-200 flex-1 sm:flex-none sm:min-w-[160px]
                    "
                  >
                    <CartIcon />
                    Add to Cart
                  </button>

                  {/* Buy Now */}
                  <button
                    id="product-detail-buy-now"
                    className="
                      flex items-center justify-center gap-2 px-8 py-3
                      bg-[#1A1A1A] text-white cursor-pointer
                      text-[10px] font-normal uppercase tracking-widest
                      hover:bg-[#C4A96B]
                      transition-all duration-200 flex-1 sm:flex-none sm:min-w-[160px]
                    "
                  >
                    <BoltIcon />
                    Buy Now
                  </button>
                </div>

                {/* Meta */}
                <div className="pt-2 flex flex-col gap-3 text-[10px] uppercase tracking-widest text-[#9A9A9A]">
                  <span>
                    Listed on{" "}
                    {new Date(product.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>

                  {/* Trust badges */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    {/* Shipping */}
                    <div className="flex items-start gap-2.5 flex-1 border border-gray-100 bg-white px-4 py-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="flex-shrink-0 mt-0.5 text-[#C4A96B]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                        />
                      </svg>
                      <div>
                        <p className="text-[#1A1A1A] font-normal">
                          Free Shipping
                        </p>
                        <p className="text-[#9A9A9A] normal-case text-[10px] mt-0.5">
                          On orders above ₹999
                        </p>
                      </div>
                    </div>

                    {/* Returns */}
                    <div className="flex items-start gap-2.5 flex-1 border border-gray-100 bg-white px-4 py-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="flex-shrink-0 mt-0.5 text-[#C4A96B]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                      <div>
                        <p className="text-[#1A1A1A] font-normal">
                          Easy Returns
                        </p>
                        <p className="text-[#9A9A9A] normal-case text-[10px] mt-0.5">
                          7-day hassle-free returns
                        </p>
                      </div>
                    </div>

                    {/* Authenticity */}
                    <div className="flex items-start gap-2.5 flex-1 border border-gray-100 bg-white px-4 py-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="flex-shrink-0 mt-0.5 text-[#C4A96B]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                        />
                      </svg>
                      <div>
                        <p className="text-[#1A1A1A] font-normal">
                          100% Authentic
                        </p>
                        <p className="text-[#9A9A9A] normal-case text-[10px] mt-0.5">
                          Verified & quality checked
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ── Footer ───────────────────────────────────────────────── */}
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

export default ProductDetail;
