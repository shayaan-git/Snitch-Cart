import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import HeaderBar from "../components/HeaderBar";

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

/* Sidebar chevron icons */
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

/* Sidebar nav icons */
const DashboardIcon = () => (
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
      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
    />
  </svg>
);
const CreateIcon = () => (
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
      d="M12 4.5v15m7.5-7.5h-15"
    />
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

/* ─── Constants ──────────────────────────────────────────────────── */
const MAX_DESC = 500;
const MAX_IMAGES = 8;
const CURRENCIES = ["USD", "EUR", "INR", "GBP"];

/* ─── Sidebar ──────────────────────────────────────────────────────── */
const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navLinks = [
    { label: "Dashboard", href: "/seller/dashboard", icon: <DashboardIcon /> },
    {
      label: "Create Product",
      href: "/seller/create-product",
      icon: <CreateIcon />,
    },
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
                <span className="uppercase tracking-widest text-xs">
                  {link.label}
                </span>
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
          className="
            w-full py-3
            bg-[#C4A96B] text-white
            uppercase tracking-[0.2em] text-[10px]
            rounded-none cursor-pointer
            transition-opacity duration-200
            hover:opacity-90
            flex items-center justify-center gap-2
          "
          title={collapsed ? "Add Product" : undefined}
        >
          <PlusIcon />
          {!collapsed && "Add Product"}
        </button>
      </div>

      {/* Sub-label */}
      {!collapsed && (
        <div className="px-6 pb-6">
          <p className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
            Seller Studio
          </p>
        </div>
      )}
    </aside>
  );
};

/* ─── Top Header Bar ───────────────────────────────────────────────── */
<HeaderBar />;

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
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      {/* ── Page Content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* ── Top Header Bar ──────────────────────────────────────── */}
        <HeaderBar />

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
