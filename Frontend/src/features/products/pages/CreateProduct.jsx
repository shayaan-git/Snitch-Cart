import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import HeaderBar from "../components/HeaderBar";
import SellerSidebar from "../components/SellerSidebar";
import {
  CameraIcon,
  PlusIcon,
  SpinnerIcon,
  XIcon,
} from "../components/icons";

/* ─── Constants ──────────────────────────────────────────────────── */
const MAX_DESC = 500;
const MAX_IMAGES = 8;
const CURRENCIES = ["USD", "EUR", "INR", "GBP"];

/* ─── Component ──────────────────────────────────────────────────── */
const CreateProduct = () => {
  const { handleCreateSellerProduct } = useProduct();
  const navigate = useNavigate();

  /* form state */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceAmount, setPriceAmount] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("INR");
  const [images, setImages] = useState([]); // array of { file, preview }
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const fileInputRef = useRef(null);

  /* ── image helpers ── */
  const addFiles = useCallback(
    (files) => {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;
      const accepted = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining);
      const previews = accepted.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...previews]);
    },
    [images.length],
  );

  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  /* ── drag-and-drop ── */
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("priceAmount", priceAmount);
      formData.append("priceCurrency", priceCurrency);
      images.forEach(({ file }) => formData.append("images", file));
      console.log(
        images.length,
        images.map((i) => i.file),
      );
      await handleCreateSellerProduct(formData);
      navigate("/seller/products", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to create product. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ── empty placeholder slots ── */
  const filledSlots = images.length;
  const emptySlots = Math.max(0, MAX_IMAGES - filledSlots - 1); // -1 for add button

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
        {/* ── Top Header Bar ──────────────────────────────────────── */}
        <HeaderBar onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="flex-grow flex items-start justify-center px-10 py-12 overflow-y-auto">
          <div className="w-full max-w-[1100px] flex flex-col gap-8">
            {/* Page header */}
            <header className="flex flex-col gap-1 border-b border-gray-100 pb-8">
              <span className="text-[10px] font-normal uppercase tracking-[0.25em] text-[#C4A96B]">
                Inventory / Create
              </span>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 mt-1">
                <h1
                  className="text-3xl font-light tracking-wide text-[#1A1A1A] leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Create Product
                </h1>
                <p className="text-[#9A9A9A] text-xs uppercase tracking-widest hidden sm:block">
                  Add a new item to your luxury collection.
                </p>
              </div>
            </header>

            {/* Error banner */}
            {error && (
              <div className="px-4 py-3 border border-red-200 bg-red-50 text-red-600 text-xs tracking-wide">
                {error}
              </div>
            )}

            {/* ── Main Card ─────────────────────────────────────── */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white border border-gray-100 shadow-none rounded-sm flex flex-col overflow-hidden"
            >
              {/* Split panels */}
              <div className="flex flex-col md:flex-row">
                {/* ── Left panel ── */}
                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col gap-8 border-b md:border-b-0 md:border-r border-gray-100">
                  {/* Title */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="product-title"
                      className="text-[10px] font-normal uppercase tracking-widest text-gray-500"
                    >
                      Title
                    </label>
                    <input
                      id="product-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Luxury Merino Wool Jacket"
                      required
                      className="
                        w-full py-2
                        bg-transparent border-0 border-b border-gray-300
                        text-[#1A1A1A] text-sm
                        placeholder:text-gray-300
                        outline-none transition-colors duration-200
                        focus:border-gray-800
                      "
                    />
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest">
                      Give your product a clear, searchable name.
                    </p>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-2 flex-grow">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="product-desc"
                        className="text-[10px] font-normal uppercase tracking-widest text-gray-500"
                      >
                        Description
                      </label>
                      <span
                        className={`text-[11px] tabular-nums ${
                          description.length >= MAX_DESC
                            ? "text-red-400"
                            : description.length >= MAX_DESC * 0.8
                              ? "text-[#C4A96B]"
                              : "text-gray-300"
                        }`}
                      >
                        {description.length}&nbsp;/&nbsp;{MAX_DESC}
                      </span>
                    </div>
                    <textarea
                      id="product-desc"
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value.slice(0, MAX_DESC))
                      }
                      placeholder="Detail the craftsmanship, materials, and origin…"
                      rows={5}
                      className="
                        w-full py-2
                        bg-transparent border-0 border-b border-gray-300
                        text-[#1A1A1A] text-sm
                        placeholder:text-gray-300 resize-none flex-grow
                        outline-none transition-colors duration-200
                        focus:border-gray-800
                      "
                    />
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="product-price"
                      className="text-[10px] font-normal uppercase tracking-widest text-gray-500"
                    >
                      Price
                    </label>
                    <div className="flex gap-4">
                      {/* Amount */}
                      <div className="relative w-3/4">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                          {priceCurrency === "INR"
                            ? "₹"
                            : priceCurrency === "EUR"
                              ? "€"
                              : priceCurrency === "GBP"
                                ? "£"
                                : "$"}
                        </span>
                        <input
                          id="product-price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={priceAmount}
                          onChange={(e) => setPriceAmount(e.target.value)}
                          placeholder="0.00"
                          required
                          className="
                            w-full pl-5 py-2
                            bg-transparent border-0 border-b border-gray-300
                            text-[#1A1A1A] text-sm
                            placeholder:text-gray-300
                            outline-none transition-colors duration-200
                            focus:border-gray-800
                            [appearance:textfield]
                            [&::-webkit-outer-spin-button]:appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none
                          "
                        />
                      </div>
                      {/* Currency */}
                      <select
                        value={priceCurrency}
                        onChange={(e) => setPriceCurrency(e.target.value)}
                        className="
                          w-1/4 bg-transparent border-0 border-b border-gray-300
                          py-2 text-[#1A1A1A] text-xs uppercase tracking-widest
                          outline-none transition-colors duration-200 cursor-pointer
                          focus:border-gray-800
                          appearance-none text-center
                        "
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest">
                      Set a competitive price for your market.
                    </p>
                  </div>
                </div>

                {/* ── Right panel ── */}
                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col gap-6 bg-[#FAF8F5]/50">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-normal uppercase tracking-widest text-gray-500">
                      Product Images
                    </label>
                    <span className="border border-gray-200 text-[#9A9A9A] px-2.5 py-1 text-[11px] tabular-nums uppercase tracking-widest">
                      {images.length}&nbsp;/&nbsp;{MAX_IMAGES}
                    </span>
                  </div>

                  {/* Image grid */}
                  <div
                    className="grid grid-cols-4 gap-2.5 flex-grow"
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                  >
                    {/* Add button */}
                    {images.length < MAX_IMAGES && (
                      <button
                        type="button"
                        id="add-image-btn"
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                          col-span-2 row-span-2 aspect-square flex flex-col items-center justify-center gap-2
                          border-2 border-dashed transition-all duration-200 cursor-pointer group
                          ${
                            isDragging
                              ? "border-[#C4A96B] bg-[#C4A96B]/5 scale-[0.98]"
                              : "border-gray-200 bg-white hover:border-[#C4A96B]/60 hover:bg-[#C4A96B]/5"
                          }
                        `}
                      >
                        <span className="text-[#C4A96B] group-hover:scale-110 transition-transform duration-200">
                          <CameraIcon />
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-[#C4A96B] hidden sm:block">
                          + Add Image
                        </span>
                      </button>
                    )}

                    {/* Uploaded thumbnails */}
                    {images.map((img, idx) => (
                      <div
                        key={img.preview}
                        className="relative aspect-square overflow-hidden group border border-gray-100"
                      >
                        <img
                          src={img.preview}
                          alt={`Product ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-start justify-end p-1.5">
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-red-50 text-[#1A1A1A] hover:text-red-500 rounded-full p-1"
                            aria-label="Remove image"
                          >
                            <XIcon />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Empty placeholder slots */}
                    {Array.from({ length: emptySlots }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="aspect-square hidden md:block border border-dashed border-gray-100 bg-white/50"
                      />
                    ))}
                  </div>

                  <p className="text-[11px] text-gray-400 uppercase tracking-widest text-center">
                    Drag &amp; drop or click to upload. Up to {MAX_IMAGES}{" "}
                    images, size less than 5MB
                  </p>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      addFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>

              {/* ── Action bar ──────────────────────────────────── */}
              <div className="px-8 md:px-10 py-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-[11px] text-gray-400 uppercase tracking-widest">
                  * All fields marked are required
                </span>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    id="cancel-btn"
                    onClick={() => navigate(-1)}
                    className="
                      w-full sm:w-auto px-6 py-3
                      border border-gray-200 text-gray-500
                      text-[10px] font-normal uppercase tracking-widest
                      rounded-none hover:border-gray-400 hover:text-[#1A1A1A]
                      transition-all duration-200
                      cursor-pointer
                    "
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="create-product-btn"
                    disabled={isLoading}
                    className="
                      w-full sm:w-auto px-6 py-3
                      bg-[#C4A96B] text-white
                      text-[10px] font-normal uppercase tracking-[0.2em]
                      rounded-none
                      hover:opacity-90 transition-opacity duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                      cursor-pointer
                    "
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <SpinnerIcon />
                        Creating…
                      </span>
                    ) : (
                      "Create Product"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateProduct;
