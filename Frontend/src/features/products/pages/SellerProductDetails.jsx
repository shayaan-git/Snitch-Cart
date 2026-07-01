import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useOutletContext } from "react-router";
import { useProduct } from "../hook/useProduct";
import SellerSidebar from "../components/SellerSidebar";
import { formatPrice, formatDate } from "../utils/formatters";
import {
  ArrowLeftIcon,
  PlusIcon,
  XIcon,
  EditIcon,
  TrashIcon,
  CameraIcon,
  ChevronImgLeft,
  ChevronImgRight,
  SpinnerIcon,
} from "../components/icons.jsx";

/* ─── Constants ─────────────────────────────────────────────────────── */
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const MAX_VARIANT_IMAGES = 4;

/* ─── Skeleton ───────────────────────────────────────────────────────── */
const SkeletonDetail = () => (
  <div className="flex flex-col lg:flex-row gap-10 animate-pulse">
    <div className="lg:w-[44%] flex-shrink-0">
      <div className="w-full aspect-[4/3] bg-gray-100 rounded-sm" />
      <div className="flex gap-2 mt-3">
        {[1, 2].map((i) => (
          <div key={i} className="w-16 h-16 bg-gray-100 rounded-sm" />
        ))}
      </div>
    </div>
    <div className="flex-1 flex flex-col gap-5 pt-2">
      <div className="h-3 bg-gray-100 rounded w-1/4" />
      <div className="h-8 bg-gray-100 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-2.5 bg-gray-100 rounded w-full" />
        <div className="h-2.5 bg-gray-100 rounded w-5/6" />
      </div>
      <div className="h-10 bg-gray-100 rounded w-1/3 mt-4" />
    </div>
  </div>
);

/* ─── Toast ──────────────────────────────────────────────────────────── */
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

/* ─── Delete Variant Dialog ───────────────────────────────────────── */
const DeleteVariantDialog = ({ open, onCancel, onConfirm, loading }) => {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[100]"
        onClick={!loading ? onCancel : undefined}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-sm flex flex-col shadow-2xl">
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
          <div className="px-6 py-6 flex flex-col gap-3">
            <p
              className="text-[#1A1A1A] text-base font-light leading-snug"
              style={{ fontFamily: "'Nib Pro', serif" }}
            >
              Delete this variant?
            </p>
            <p className="text-[#9A9A9A] text-xs uppercase tracking-widest leading-relaxed">
              This action cannot be undone.
            </p>
          </div>
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

/* ─── Variant Card ───────────────────────────────────────────────────── */
const VariantCard = ({ variant, idx, onEdit, onDelete, onStockChange, actionLoading }) => {
  const [localStock, setLocalStock] = useState(variant.stock ?? 0);
  const [stockEditing, setStockEditing] = useState(false);

  const attrs = variant.attributes
    ? Object.entries(
        variant.attributes instanceof Map
          ? Object.fromEntries(variant.attributes)
          : variant.attributes,
      )
    : [];

  const stockStatus =
    localStock === 0
      ? { label: "Out of Stock", cls: "bg-red-50 text-red-600 border-red-200" }
      : localStock <= 5
        ? {
            label: "Low Stock",
            cls: "bg-amber-50 text-amber-700 border-amber-200",
          }
        : {
            label: "In Stock",
            cls: "bg-green-50 text-green-700 border-green-200",
          };

  return (
    <div className="bg-white border border-gray-100 flex flex-row sm:flex-row gap-0 overflow-hidden hover:border-gray-200 transition-colors duration-200">
      {/* Image strip */}
      <div className="sm:w-32 flex-shrink-0 bg-[#FAF8F5] flex items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-100 p-3 min-h-[100px]">
        {variant.images && variant.images.length > 0 ? (
          <img
            src={variant.images[0].url}
            alt="variant"
            className="w-full h-24 object-contain"
          />
        ) : (
          <span className="text-gray-200 text-[10px] uppercase tracking-widest text-center">
            No image
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        {/* Attributes row */}
        <div className="flex flex-wrap items-center gap-2">
          {attrs.length > 0 ? (
            attrs.map(([k, v]) => (
              <span
                key={k}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF8F5] border border-gray-100 text-[10px] uppercase tracking-widest text-[#1A1A1A]"
              >
                <span className="text-[#9A9A9A]">{k}:</span> {v}
              </span>
            ))
          ) : (
            <span className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
              No attributes
            </span>
          )}
          <span
            className={`ml-auto px-2.5 py-1 border text-[10px] uppercase tracking-widest ${stockStatus.cls}`}
          >
            {stockStatus.label}
          </span>
        </div>

        {/* Price + Stock */}
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A] mb-0.5">
              Price
            </p>
            <p
              className="text-xl font-light text-[#C4A96B]"
              style={{ fontFamily: "'Nib Pro', serif" }}
            >
              {formatPrice(variant.price?.amount, variant.price?.currency)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A] mb-0.5">
              Stock
            </p>
            {stockEditing ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={localStock}
                  onChange={(e) => setLocalStock(Number(e.target.value))}
                  className="w-20 border-0 border-b border-gray-800 bg-transparent text-sm text-[#1A1A1A] outline-none py-0.5 text-center"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setStockEditing(false);
                    onStockChange(idx, localStock);
                  }}
                  className="text-[10px] uppercase tracking-widest text-[#C4A96B] hover:text-[#1A1A1A] transition-colors px-1 cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setLocalStock(variant.stock ?? 0);
                    setStockEditing(false);
                  }}
                  className="text-[10px] uppercase tracking-widest text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors px-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setStockEditing(true)}
                className="flex items-center gap-1.5 group cursor-pointer"
              >
                <span className="text-lg font-light text-[#1A1A1A]">
                  {localStock}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
                  units
                </span>
                <span className="text-[#9A9A9A] group-hover:text-[#C4A96B] transition-colors duration-200 ml-0.5">
                  <EditIcon />
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
          <button
            onClick={() => onEdit(idx)}
            disabled={!!actionLoading}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#1A1A1A] hover:text-[#C4A96B] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === "edit" ? <SpinnerIcon /> : <EditIcon />} Edit
          </button>
          <button
            onClick={() => onDelete(idx)}
            disabled={!!actionLoading}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#9A9A9A] hover:text-red-500 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === "delete" ? <SpinnerIcon /> : <TrashIcon />} Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Variant Modal ──────────────────────────────────────────────────── */
const VariantModal = ({ open, onClose, onSave, initialData, saving }) => {
  const [images, setImages] = useState([]); // { file, preview } for new | { url } for existing
  const [attrs, setAttrs] = useState([{ key: "", value: "" }]);
  const [priceAmount, setPriceAmount] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("INR");
  const [stock, setStock] = useState(0);
  const fileInputRef = React.useRef(null);

  // Populate form when editing existing variant
  useEffect(() => {
    if (initialData) {
      setImages((initialData.images ?? []).map((img) => ({ url: img.url })));
      const rawAttrs = initialData.attributes
        ? Object.entries(
            initialData.attributes instanceof Map
              ? Object.fromEntries(initialData.attributes)
              : initialData.attributes,
          )
        : [];
      setAttrs(
        rawAttrs.length > 0
          ? rawAttrs.map(([k, v]) => ({ key: k, value: v }))
          : [{ key: "", value: "" }],
      );
      setPriceAmount(initialData.price?.amount ?? "");
      setPriceCurrency(initialData.price?.currency ?? "INR");
      setStock(initialData.stock ?? 0);
    } else {
      setImages([]);
      setAttrs([{ key: "", value: "" }]);
      setPriceAmount("");
      setPriceCurrency("INR");
      setStock(0);
    }
  }, [initialData, open]);

  const addImage = (files) => {
    const remaining = MAX_VARIANT_IMAGES - images.length;
    if (remaining <= 0) return;
    const accepted = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining);
    const previews = accepted.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (i) => {
    setImages((prev) => {
      if (prev[i].preview) URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const addAttr = () => setAttrs((prev) => [...prev, { key: "", value: "" }]);
  const removeAttr = (i) =>
    setAttrs((prev) => prev.filter((_, idx) => idx !== i));
  const updateAttr = (i, field, val) =>
    setAttrs((prev) =>
      prev.map((a, idx) => (idx === i ? { ...a, [field]: val } : a)),
    );

  const handleSave = () => {
    const attributes = {};
    attrs.forEach(({ key, value }) => {
      if (key.trim()) attributes[key.trim()] = value.trim();
    });
    onSave({
      images: images.map((img) =>
        img.url ? { url: img.url } : { file: img.file, preview: img.preview },
      ),
      attributes,
      price: { amount: Number(priceAmount), currency: priceCurrency },
      stock: Number(stock),
    });
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 h-14 border-b border-gray-100 flex-shrink-0">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C4A96B]">
            {initialData ? "Edit Variant" : "Add Variant"}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#1A1A1A] transition-colors duration-200 cursor-pointer p-1"
          >
            <XIcon />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-8">
          {/* Images */}
          <section className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
              Variant Images ({images.length}/{MAX_VARIANT_IMAGES})
            </p>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 border border-gray-100 bg-[#FAF8F5] flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={img.preview ?? img.url}
                    alt={`variant-${i}`}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-0.5 right-0.5 bg-white text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
              {images.length < MAX_VARIANT_IMAGES && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 border border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[#C4A96B] hover:text-[#C4A96B] transition-colors duration-200 cursor-pointer"
                >
                  <CameraIcon />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => addImage(e.target.files)}
            />
          </section>

          {/* Attributes */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
                Attributes
              </p>
              <button
                onClick={addAttr}
                className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#C4A96B] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                <PlusIcon /> Add
              </button>
            </div>
            {attrs.map((attr, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g. Size)"
                  value={attr.key}
                  onChange={(e) => updateAttr(i, "key", e.target.value)}
                  className="flex-1 border-0 border-b border-gray-300 bg-transparent text-sm text-[#1A1A1A] placeholder:text-gray-300 outline-none py-1 focus:border-gray-800 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. XL)"
                  value={attr.value}
                  onChange={(e) => updateAttr(i, "value", e.target.value)}
                  className="flex-1 border-0 border-b border-gray-300 bg-transparent text-sm text-[#1A1A1A] placeholder:text-gray-300 outline-none py-1 focus:border-gray-800 transition-colors"
                />
                {attrs.length > 1 && (
                  <button
                    onClick={() => removeAttr(i)}
                    className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
                  >
                    <XIcon />
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* Price */}
          <section className="flex flex-col gap-4">
            <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
              Price (Optional)
            </p>
            <div className="flex gap-4">
              <input
                type="number"
                min="0"
                placeholder="Amount"
                value={priceAmount}
                onChange={(e) => setPriceAmount(e.target.value)}
                className="flex-1 border-0 border-b border-gray-300 bg-transparent text-sm text-[#1A1A1A] placeholder:text-gray-300 outline-none py-1 focus:border-gray-800 transition-colors"
              />
              <select
                value={priceCurrency}
                onChange={(e) => setPriceCurrency(e.target.value)}
                className="border-0 border-b border-gray-300 bg-transparent text-sm text-[#1A1A1A] outline-none py-1 focus:border-gray-800 transition-colors cursor-pointer appearance-none min-w-[72px]"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Stock */}
          <section className="flex flex-col gap-4">
            <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
              Stock Quantity
            </p>
            <input
              type="number"
              min="0"
              onFocus={(e) => e.target.select()}
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border-0 border-b border-gray-300 bg-transparent text-sm text-[#1A1A1A] placeholder:text-gray-300 outline-none py-1 focus:border-gray-800 transition-colors"
            />
          </section>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 text-[10px] uppercase tracking-widest text-[#9A9A9A] hover:border-gray-400 hover:text-[#1A1A1A] transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest hover:bg-[#C4A96B] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : initialData ? "Save Changes" : "Save Variant"}
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Main Page ──────────────────────────────────────────────────────── */
const SellerProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    handleGetProductById,
    handleAddProductVariant,
    handleUpdateProductVariant,
    handleDeleteProductVariant,
  } = useProduct();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { mobileSidebarOpen, setMobileSidebarOpen } = useOutletContext();
  const [saving, setSaving] = useState(false);

  /* variant state */
  const [variants, setVariants] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null); // null = adding new

  /* per-variant in-flight loading  { [variantId]: "edit" | "delete" } */
  const [variantActionLoading, setVariantActionLoading] = useState({});

  /* delete confirm dialog */
  const [deleteVariantIdx, setDeleteVariantIdx] = useState(null);
  const [variantDeleteLoading, setVariantDeleteLoading] = useState(false);

  /* toast */
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
  const hideToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await handleGetProductById(productId);
      const p = data?.product || data;
      setProduct(p);
      setVariants(p?.variants ?? []);
      setLoading(false);
    })();
  }, [productId]);

  const images = product?.images ?? [];
  const currentImage = images[activeImg]?.url;

  /* variant CRUD */
  const handleAddOrUpdateVariant = useCallback(
    async (variantData) => {
      if (editingIdx !== null) {
        // EDIT — call the backend
        const variant = variants[editingIdx];
        const variantId = variant._id;
        setSaving(true);
        setVariantActionLoading((prev) => ({ ...prev, [variantId]: "edit" }));
        try {
          const result = await handleUpdateProductVariant(productId, variantId, variantData);
          const updatedVariants = result?.variants ?? result?.product?.variants ?? null;
          if (updatedVariants) {
            setVariants(updatedVariants);
          } else {
            setVariants((prev) =>
              prev.map((v, i) => (i === editingIdx ? { ...v, ...variantData } : v)),
            );
          }
          showToast("Variant updated successfully.");
          setModalOpen(false);
          setEditingIdx(null);
        } catch (err) {
          const msg = err?.response?.data?.message || "Failed to update variant.";
          showToast(msg, "error");
        } finally {
          setSaving(false);
          setVariantActionLoading((prev) => {
            const next = { ...prev };
            delete next[variantId];
            return next;
          });
        }
      } else {
        // ADD — call the backend
        setSaving(true);
        try {
          const result = await handleAddProductVariant(productId, variantData);
          // Backend returns the full updated product; sync all variants from it
          const updatedVariants = result?.product?.variants ?? [
            ...variants,
            variantData,
          ];
          setVariants(updatedVariants);
          showToast("Variant added successfully.");
          setModalOpen(false);
          setEditingIdx(null);
        } catch (err) {
          const msg = err?.response?.data?.message || "Failed to add variant.";
          showToast(msg, "error");
        } finally {
          setSaving(false);
        }
      }
    },
    [editingIdx, productId, handleAddProductVariant, handleUpdateProductVariant, variants, showToast],
  );

  /* Open delete confirm for a variant */
  const openDeleteVariant = useCallback((idx) => {
    setDeleteVariantIdx(idx);
  }, []);

  const cancelDeleteVariant = useCallback(() => {
    setDeleteVariantIdx(null);
  }, []);

  const confirmDeleteVariant = useCallback(async () => {
    if (deleteVariantIdx === null) return;
    const variant = variants[deleteVariantIdx];
    const variantId = variant._id;
    setVariantDeleteLoading(true);
    setVariantActionLoading((prev) => ({ ...prev, [variantId]: "delete" }));
    try {
      await handleDeleteProductVariant(productId, variantId);
      setVariants((prev) => prev.filter((_, i) => i !== deleteVariantIdx));
      showToast("Variant deleted.");
      setDeleteVariantIdx(null);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to delete variant.";
      showToast(msg, "error");
    } finally {
      setVariantDeleteLoading(false);
      setVariantActionLoading((prev) => {
        const next = { ...prev };
        delete next[variantId];
        return next;
      });
    }
  }, [deleteVariantIdx, variants, handleDeleteProductVariant, productId, showToast]);

  const handleStockChange = useCallback((idx, newStock) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, stock: newStock } : v)),
    );
  }, []);

  const openEditModal = useCallback((idx) => {
    setEditingIdx(idx);
    setModalOpen(true);
  }, []);

  const openAddModal = useCallback(() => {
    setEditingIdx(null);
    setModalOpen(true);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#FAF8F5] flex"
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
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* ── Header ──────────────────────────────────────────────── */}
        {/* <HeaderBar onMenuClick={() => setMobileSidebarOpen(true)} /> */}

        <main className="flex-grow px-6 sm:px-10 py-10 flex flex-col gap-12 overflow-y-auto">
          {/* ── Breadcrumb / Back ─────────────────────────────────── */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#9A9A9A]">
            <button
              onClick={() => navigate("/seller/dashboard")}
              className="flex items-center gap-1.5 hover:text-[#C4A96B] transition-colors duration-200 cursor-pointer"
            >
              <ArrowLeftIcon /> Dashboard
            </button>
            <span className="text-gray-200">/</span>
            <span className="text-[#1A1A1A] truncate max-w-[200px]">
              {product?.title ?? "Product"}
            </span>
          </div>

          {/* ═══════════════════════════════════════════════════════
              SECTION 1 — PRODUCT OVERVIEW
          ═══════════════════════════════════════════════════════ */}
          <section className="border-b border-gray-100 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C4A96B]">
                  Seller / Product Detail
                </span>
                <h1
                  className="text-3xl font-light tracking-wide text-[#1A1A1A] leading-tight mt-1"
                  style={{ fontFamily: "'Nib Pro', serif" }}
                >
                  {loading ? "Loading…" : (product?.title ?? "Product")}
                </h1>
              </div>
            </div>

            {loading ? (
              <SkeletonDetail />
            ) : !product ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <span className="text-5xl">🕵️</span>
                <h2
                  className="text-2xl font-light text-[#1A1A1A]"
                  style={{ fontFamily: "'Nib Pro', serif" }}
                >
                  Product not found
                </h2>
                <Link
                  to="/seller/dashboard"
                  className="text-[#C4A96B] text-xs uppercase tracking-widest hover:underline"
                >
                  Back to Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
                {/* Gallery */}
                <div className="lg:w-[44%] flex-shrink-0 flex flex-col gap-4">
                  <div className="flex flex-row-reverse gap-3">
                    {/* Main image */}
                    <div className="relative flex-1 aspect-[4/3] max-h-[420px] bg-white border border-gray-100 overflow-hidden group">
                      {currentImage ? (
                        <img
                          key={activeImg}
                          src={currentImage}
                          alt={product.title}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">
                          No image
                        </div>
                      )}
                      {/* Arrows */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              setActiveImg(
                                (p) => (p - 1 + images.length) % images.length,
                              )
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 border border-gray-100 text-[#1A1A1A] hover:bg-[#C4A96B] hover:text-white hover:border-[#C4A96B] transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                          >
                            <ChevronImgLeft />
                          </button>
                          <button
                            onClick={() =>
                              setActiveImg((p) => (p + 1) % images.length)
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 border border-gray-100 text-[#1A1A1A] hover:bg-[#C4A96B] hover:text-white hover:border-[#C4A96B] transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                          >
                            <ChevronImgRight />
                          </button>
                        </>
                      )}
                    </div>
                    {/* Vertical thumbnails */}
                    {images.length > 1 && (
                      <div className="hidden lg:flex flex-col gap-2 overflow-y-auto max-h-[420px]">
                        {images.map((img, idx) => (
                          <button
                            key={img._id ?? idx}
                            onClick={() => setActiveImg(idx)}
                            className={`w-14 h-14 flex-shrink-0 border overflow-hidden transition-all duration-200 cursor-pointer ${
                              activeImg === idx
                                ? "border-[#C4A96B] ring-1 ring-[#C4A96B]/40"
                                : "border-gray-100 hover:border-[#C4A96B]/50"
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={`thumb ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Mobile horizontal thumbnails */}
                  {images.length > 1 && (
                    <div className="flex lg:hidden gap-3 overflow-x-auto pb-1">
                      {images.map((img, idx) => (
                        <button
                          key={img._id ?? idx}
                          onClick={() => setActiveImg(idx)}
                          className={`w-14 h-14 flex-shrink-0 border overflow-hidden transition-all duration-200 cursor-pointer ${
                            activeImg === idx
                              ? "border-[#C4A96B] ring-1 ring-[#C4A96B]/40"
                              : "border-gray-100 hover:border-[#C4A96B]/50"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={`thumb ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
                      Price
                    </span>
                    <span
                      className="text-3xl font-light text-[#C4A96B]"
                      style={{
                        fontFamily: "'Nib Pro', serif",
                      }}
                    >
                      {formatPrice(
                        product.price?.amount,
                        product.price?.currency,
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-100" />

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
                      Description
                    </span>
                    <p className="text-[#9A9A9A] text-sm leading-relaxed">
                      {product.description || "No description provided."}
                    </p>
                  </div>

                  <div className="border-t border-gray-100" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
                        Listed
                      </span>
                      <p className="text-sm text-[#1A1A1A] mt-1">
                        {formatDate(product.createdAt)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
                        Variants
                      </span>
                      <p className="text-sm text-[#1A1A1A] mt-1">
                        {variants.length}{" "}
                        {variants.length === 1 ? "variant" : "variants"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ═══════════════════════════════════════════════════════
              SECTION 2 — VARIANTS MANAGER
          ═══════════════════════════════════════════════════════ */}
          {!loading && product && (
            <section className="flex flex-col gap-6">
              {/* Section header */}
              <div className="flex items-end justify-between border-b border-gray-100 pb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C4A96B]">
                    Inventory
                  </span>
                  <h2
                    className="text-2xl font-light tracking-wide text-[#1A1A1A]"
                    style={{
                      fontFamily: "'Nib Pro', serif",
                    }}
                  >
                    Product Variants
                  </h2>
                  <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
                    {variants.length}{" "}
                    {variants.length === 1 ? "variant" : "variants"} — manage
                    sizes, colors, stock
                  </p>
                </div>
                <button
                  id="add-variant-btn"
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-6 py-3 bg-[#C4A96B] text-white text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity duration-200 cursor-pointer flex-shrink-0"
                >
                  <PlusIcon /> Add Variant
                </button>
              </div>

              {/* Empty state */}
              {variants.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                  <div className="w-16 h-16 border border-gray-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3
                      className="text-xl font-light text-[#1A1A1A]"
                      style={{
                        fontFamily: "'Nib Pro', serif",
                      }}
                    >
                      No variants yet
                    </h3>
                    <p className="text-[#9A9A9A] text-xs uppercase tracking-widest max-w-xs">
                      Create your first variant to manage stock and pricing for
                      different sizes or colours.
                    </p>
                  </div>
                  <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-8 py-4 border border-gray-200 text-[#1A1A1A] text-[10px] uppercase tracking-[0.2em] hover:border-[#C4A96B] hover:text-[#C4A96B] transition-all duration-200 cursor-pointer"
                  >
                    <PlusIcon /> Create First Variant
                  </button>
                </div>
              )}

              {/* Variant cards grid */}
              {variants.length > 0 && (
                <div className="flex flex-col gap-4">
                  {variants.map((variant, idx) => (
                    <VariantCard
                      key={variant._id ?? idx}
                      variant={variant}
                      idx={idx}
                      onEdit={openEditModal}
                      onDelete={openDeleteVariant}
                      onStockChange={handleStockChange}
                      actionLoading={variantActionLoading[variant._id] ?? null}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* ── Variant Modal ────────────────────────────────────────── */}
      <VariantModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingIdx(null);
        }}
        onSave={handleAddOrUpdateVariant}
        initialData={editingIdx !== null ? variants[editingIdx] : null}
        saving={saving}
      />

      {/* ── Delete Variant Confirm ───────────────────────────────── */}
      <DeleteVariantDialog
        open={deleteVariantIdx !== null}
        onCancel={cancelDeleteVariant}
        onConfirm={confirmDeleteVariant}
        loading={variantDeleteLoading}
      />

      {/* ── Toast ───────────────────────────────────────────────── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default SellerProductDetails;
