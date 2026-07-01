import React, { useEffect, useState, useCallback, useRef } from "react";
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
  XIcon,
  SpinnerIcon,
} from "../components/icons.jsx";
import SellerSidebar from "../components/SellerSidebar.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import SellerProductCard from "../components/SellerProductCard.jsx";

/* ─── Constants ──────────────────────────────────────────────────── */
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

/* ─── Toast ──────────────────────────────────────────────────────── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  const accent = type === "error" ? "#ef4444" : "#C4A96B";

  return (
    <div
      className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 bg-white shadow-lg border"
      style={{ borderLeftWidth: 3, borderLeftColor: accent, minWidth: 260 }}
    >
      <span className="text-[#1A1A1A] text-xs tracking-wide flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-[#1A1A1A] transition-colors cursor-pointer"
      >
        <XIcon />
      </button>
    </div>
  );
};

/* ─── Delete Confirm Dialog ───────────────────────────────────────── */
const DeleteConfirmDialog = ({ product, onCancel, onConfirm, loading }) => {
  if (!product) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[100]"
        onClick={!loading ? onCancel : undefined}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-sm flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 h-12 border-b border-gray-100">
            <span className="text-[10px] uppercase tracking-[0.25em] text-red-500">
              Confirm Delete
            </span>
            {!loading && (
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-[#1A1A1A] transition-colors cursor-pointer p-1"
              >
                <XIcon />
              </button>
            )}
          </div>
          {/* Body */}
          <div className="px-6 py-6 flex flex-col gap-3">
            <p
              className="text-[#1A1A1A] text-base font-light leading-snug"
              style={{ fontFamily: "'Nib Pro', serif" }}
            >
              Delete &ldquo;{product.title}&rdquo;?
            </p>
            <p className="text-[#9A9A9A] text-xs uppercase tracking-widest leading-relaxed">
              This action cannot be undone. The product will be permanently removed.
            </p>
          </div>
          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-2.5 border border-gray-200 text-[10px] uppercase tracking-widest text-[#9A9A9A] hover:border-gray-400 hover:text-[#1A1A1A] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 bg-red-500 text-white text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <SpinnerIcon /> : null}
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Edit Product Modal (drawer) ─────────────────────────────────── */
const EditProductModal = ({ product, onClose, onSave, saving }) => {
  const [title, setTitle]               = useState(product?.title ?? "");
  const [description, setDescription]   = useState(product?.description ?? "");
  const [priceAmount, setPriceAmount]   = useState(product?.price?.amount ?? "");
  const [priceCurrency, setPriceCurrency] = useState(product?.price?.currency ?? "INR");
  const [stock, setStock]               = useState(product?.stock ?? 0);

  // Reset form if product changes (shouldn't happen mid-open, but just in case)
  useEffect(() => {
    setTitle(product?.title ?? "");
    setDescription(product?.description ?? "");
    setPriceAmount(product?.price?.amount ?? "");
    setPriceCurrency(product?.price?.currency ?? "INR");
    setStock(product?.stock ?? 0);
  }, [product]);

  if (!product) return null;

  const handleSave = () => {
    onSave(product._id, {
      title,
      description,
      stock: Number(stock),
      price: { amount: Number(priceAmount), currency: priceCurrency },
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[100]"
        onClick={!saving ? onClose : undefined}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[110] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 h-14 border-b border-gray-100 flex-shrink-0">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C4A96B]">
            Edit Product
          </span>
          {!saving && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[#1A1A1A] transition-colors duration-200 cursor-pointer p-1"
            >
              <XIcon />
            </button>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-8">
          {/* Title */}
          <section className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">Title</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product title"
              className="w-full border-0 border-b border-gray-300 bg-transparent text-sm text-[#1A1A1A] placeholder:text-gray-300 outline-none py-1 focus:border-gray-800 transition-colors"
            />
          </section>

          {/* Description */}
          <section className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">Description</p>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description"
              className="w-full border-0 border-b border-gray-300 bg-transparent text-sm text-[#1A1A1A] placeholder:text-gray-300 outline-none py-1 focus:border-gray-800 transition-colors resize-none leading-relaxed"
            />
          </section>

          {/* Price */}
          <section className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">Price</p>
            <div className="flex gap-4">
              <input
                type="number"
                min="0"
                value={priceAmount}
                onChange={(e) => setPriceAmount(e.target.value)}
                placeholder="Amount"
                className="flex-1 border-0 border-b border-gray-300 bg-transparent text-sm text-[#1A1A1A] placeholder:text-gray-300 outline-none py-1 focus:border-gray-800 transition-colors"
              />
              <select
                value={priceCurrency}
                onChange={(e) => setPriceCurrency(e.target.value)}
                className="border-0 border-b border-gray-300 bg-transparent text-sm text-[#1A1A1A] outline-none py-1 focus:border-gray-800 transition-colors cursor-pointer appearance-none min-w-[72px]"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Stock */}
          <section className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">Stock Quantity</p>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              onFocus={(e) => e.target.select()}
              placeholder="0"
              className="w-full border-0 border-b border-gray-300 bg-transparent text-sm text-[#1A1A1A] placeholder:text-gray-300 outline-none py-1 focus:border-gray-800 transition-colors"
            />
          </section>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-3 border border-gray-200 text-[10px] uppercase tracking-widest text-[#9A9A9A] hover:border-gray-400 hover:text-[#1A1A1A] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest hover:bg-[#C4A96B] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? <SpinnerIcon /> : null}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Dashboard ──────────────────────────────────────────────────── */
const Dashboard = () => {
  const { handleGetSellerProduct, handleUpdateSellerProduct, handleDeleteProduct } = useProduct();
  const navigate = useNavigate();

  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { mobileSidebarOpen, setMobileSidebarOpen } = useOutletContext();

  // Edit state
  const [editTarget, setEditTarget]     = useState(null);   // product being edited
  const [editSaving, setEditSaving]     = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);   // product pending confirm
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Per-card in-flight indicator  { [productId]: "edit" | "delete" }
  const [actionLoading, setActionLoading] = useState({});

  // Toast
  const [toast, setToast] = useState(null); // { message, type }
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
  const hideToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  const handleCardClick = useCallback(
    (product) => {
      navigate(`/seller/product/${product._id}`);
    },
    [navigate],
  );

  /* ── Edit handlers ── */
  const openEdit = useCallback((product) => {
    setEditTarget(product);
  }, []);

  const closeEdit = useCallback(() => {
    setEditTarget(null);
  }, []);

  const saveEdit = useCallback(
    async (productId, payload) => {
      setEditSaving(true);
      setActionLoading((prev) => ({ ...prev, [productId]: "edit" }));
      try {
        await handleUpdateSellerProduct(productId, payload);
        await handleGetSellerProduct();
        showToast("Product updated successfully.");
        setEditTarget(null);
      } catch (err) {
        const msg =
          err?.response?.data?.message || "Failed to update product. Please try again.";
        showToast(msg, "error");
      } finally {
        setEditSaving(false);
        setActionLoading((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
      }
    },
    [handleUpdateSellerProduct, handleGetSellerProduct, showToast],
  );

  /* ── Delete handlers ── */
  const openDelete = useCallback((product) => {
    setDeleteTarget(product);
  }, []);

  const cancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const productId = deleteTarget._id;
    setDeleteLoading(true);
    setActionLoading((prev) => ({ ...prev, [productId]: "delete" }));
    try {
      await handleDeleteProduct(productId);
      await handleGetSellerProduct();
      showToast(`"${deleteTarget.title}" has been deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to delete product. Please try again.";
      showToast(msg, "error");
    } finally {
      setDeleteLoading(false);
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
  }, [deleteTarget, handleDeleteProduct, handleGetSellerProduct, showToast]);

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
                  onEdit={openEdit}
                  onDelete={openDelete}
                  actionLoading={actionLoading[product._id] ?? null}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Edit Product Modal ───────────────────────────────────── */}
      <EditProductModal
        product={editTarget}
        onClose={closeEdit}
        onSave={saveEdit}
        saving={editSaving}
      />

      {/* ── Delete Confirm Dialog ────────────────────────────────── */}
      <DeleteConfirmDialog
        product={deleteTarget}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />

      {/* ── Toast ───────────────────────────────────────────────── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default Dashboard;
