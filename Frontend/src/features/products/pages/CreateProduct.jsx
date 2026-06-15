import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";

/* ─── SVG Icons ──────────────────────────────────────────────────── */
const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-7 h-7"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
    />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="animate-spin w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);

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
                  item === "Inventory"
                    ? "text-[#f5c518] border-[#f5c518]"
                    : "text-[#9a9078] border-transparent hover:text-[#e5e2e1] hover:border-white/10"
                }`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="flex-grow flex items-start md:items-center justify-center px-5 py-8 md:px-8 md:py-10">
        <div className="w-full max-w-[1200px] flex flex-col gap-5">
          {/* Page header */}
          <header className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f5c518]">
              Inventory / Create
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
                Create Product
              </h1>
              <p className="text-[#9a9078] text-sm hidden sm:block">
                Add a new item to your luxury collection.
              </p>
            </div>
          </header>

          {/* Error banner */}
          {error && (
            <div className="px-4 py-2.5 rounded-xl bg-[#93000a]/20 border border-[#93000a]/40 text-[#ffb4ab] text-xs">
              {error}
            </div>
          )}

          {/* ── Main Card ─────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-[#1c1b1b] rounded-2xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
          >
            {/* Split panels */}
            <div className="flex flex-col md:flex-row">
              {/* ── Left panel ── */}
              <div className="w-full md:w-1/2 p-7 md:p-10 flex flex-col gap-5 border-b md:border-b-0 md:border-r border-white/10">
                {/* Title */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="product-title"
                    className="text-[10px] font-semibold uppercase tracking-widest text-[#9a9078]"
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
                      w-full px-4 py-3 bg-[#18181b] border border-[#27272a]
                      rounded-xl text-[#e5e2e1] text-sm
                      placeholder:text-[#4e4633]
                      outline-none transition-all duration-200
                      focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/30
                      hover:border-[#4e4633]
                    "
                  />
                  <p className="text-[11px] text-[#4e4633]">
                    Give your product a clear, searchable name.
                  </p>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2 flex-grow">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="product-desc"
                      className="text-[10px] font-semibold uppercase tracking-widest text-[#9a9078]"
                    >
                      Description
                    </label>
                    <span
                      className={`text-[11px] font-semibold tabular-nums ${
                        description.length >= MAX_DESC
                          ? "text-[#ffb4ab]"
                          : description.length >= MAX_DESC * 0.8
                            ? "text-[#f5c518]"
                            : "text-[#4e4633]"
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
                      w-full px-4 py-3 bg-[#18181b] border border-[#27272a]
                      rounded-xl text-[#e5e2e1] text-sm
                      placeholder:text-[#4e4633] resize-none flex-grow
                      outline-none transition-all duration-200
                      focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/30
                      hover:border-[#4e4633]
                    "
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="product-price"
                    className="text-[10px] font-semibold uppercase tracking-widest text-[#9a9078]"
                  >
                    Price
                  </label>
                  <div className="flex gap-2">
                    {/* Amount */}
                    <div className="relative w-3/4">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4e4633] text-sm pointer-events-none">
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
                          w-full pl-8 pr-4 py-3 bg-[#18181b] border border-[#27272a]
                          rounded-xl text-[#e5e2e1] text-sm
                          placeholder:text-[#4e4633]
                          outline-none transition-all duration-200
                          focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/30
                          hover:border-[#4e4633]
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
                        w-1/4 bg-[#18181b] border border-[#27272a]
                        rounded-xl px-3 py-3 text-[#e5e2e1] text-sm font-semibold
                        outline-none transition-all duration-200 cursor-pointer
                        focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/30
                        hover:border-[#4e4633]
                        appearance-none text-center
                      "
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c} className="bg-[#18181b]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[11px] text-[#4e4633]">
                    Set a competitive price for your market.
                  </p>
                </div>
              </div>

              {/* ── Right panel ── */}
              <div className="w-full md:w-1/2 p-7 md:p-10 flex flex-col gap-4 bg-[#1c1b1b]/50">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-[#9a9078]">
                    Product Images
                  </label>
                  <span className="bg-[#18181b] border border-[#27272a] text-[#9a9078] px-2.5 py-1 rounded-lg text-[11px] font-semibold tabular-nums">
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
                        rounded-xl transition-all duration-200 cursor-pointer group
                        ${
                          isDragging
                            ? "bg-[#f5c518]/10 scale-[0.98]"
                            : "bg-[#f5c518]/5 hover:bg-[#f5c518]/10"
                        }
                      `}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23f5c5184d' stroke-width='2' stroke-dasharray='6%2c6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")",
                      }}
                    >
                      <span className="text-[#f5c518] group-hover:scale-110 transition-transform duration-200">
                        <CameraIcon />
                      </span>
                      <span className="text-[11px] font-semibold text-[#f5c518] hidden sm:block">
                        + Add Image
                      </span>
                    </button>
                  )}

                  {/* Uploaded thumbnails */}
                  {images.map((img, idx) => (
                    <div
                      key={img.preview}
                      className="relative aspect-square rounded-xl overflow-hidden group border border-[#27272a]"
                    >
                      <img
                        src={img.preview}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-start justify-end p-1.5">
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#131313]/80 hover:bg-[#93000a] text-[#e5e2e1] rounded-full p-1"
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
                      className="aspect-square rounded-xl hidden md:block"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23353534' stroke-width='2' stroke-dasharray='6%2c6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")",
                        backgroundColor: "rgba(19,19,19,0.5)",
                      }}
                    />
                  ))}
                </div>

                <p className="text-[11px] text-[#4e4633] text-center">
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
            <div className="px-7 md:px-10 py-5 border-t border-white/10 bg-[#18181b]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-[11px] text-[#4e4633]">
                * All fields marked are required
              </span>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  id="cancel-btn"
                  onClick={() => navigate(-1)}
                  className="
                    w-full sm:w-auto px-6 py-2.5 rounded-xl
                    border border-white/15 text-[#e5e2e1]
                    text-[11px] font-semibold uppercase tracking-widest
                    hover:bg-white/5 transition-all duration-200
                    active:scale-[0.98] cursor-pointer
                  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="create-product-btn"
                  disabled={isLoading}
                  className="
                    w-full sm:w-auto px-6 py-2.5 rounded-xl
                    bg-[#f5c518] text-[#1a1200]
                    text-[11px] font-bold uppercase tracking-widest
                    hover:bg-[#ffe08b] shadow-[0_0_20px_rgba(245,197,24,0.25)]
                    hover:shadow-[0_0_28px_rgba(245,197,24,0.4)]
                    transition-all duration-200
                    active:scale-[0.98]
                    disabled:opacity-60 disabled:cursor-not-allowed
                    disabled:hover:bg-[#f5c518] disabled:hover:shadow-none
                    focus:outline-none focus:ring-2 focus:ring-[#f5c518]/50
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
  );
};

export default CreateProduct;
