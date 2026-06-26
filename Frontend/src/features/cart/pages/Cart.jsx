import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useOutletContext } from "react-router";
import { useCart } from "../hook/useCart";
import { removeItem, updateQuantity } from "../state/cart.slice.js";
import HeaderBar from "../../shared/components/HeaderBar.jsx";
import BuyerSidebar from "../../products/components/BuyerSidebar.jsx";
import { formatPrice } from "../../products/utils/formatters.js";
import {
  ArrowLeftIcon,
  BoltIcon,
  CartIcon,
  SparkleIcon,
  TrashIcon,
} from "../../products/components/icons.jsx";

/* ─── Sample Data Fallback (matching user prompt specifications) ──────── */
const SAMPLE_CART_DATA = [
  {
    _id: "6a3cbf9ff98babc2de74c516",
    product: {
      _id: "6a3cbe9cf98babc2de74c4d5",
      title: "Polo T - Blue style",
      description: "By Elevate & Co.",
      attributes: {
        Size: "S, M, L, XL",
      },
      seller: "6a264289dcfe5189602d92f2",
      stock: 50,
      price: {
        amount: 499,
        currency: "INR",
      },
      images: [
        {
          url: "https://ik.imagekit.io/shnxjeg2o/elevate/blueT_X4ETwQTAm.jpg",
          _id: "6a3cbe9cf98babc2de74c4d6",
        },
        {
          url: "https://ik.imagekit.io/shnxjeg2o/elevate/KdcRvFG1_ecb371c490cd4f1b9279ecc16efae80c_SnK-u7b5H.jpg",
          _id: "6a3cbe9cf98babc2de74c4d7",
        },
      ],
      variants: [
        {
          images: [
            {
              url: "https://ik.imagekit.io/shnxjeg2o/elevate/6SmkPepM_be76eb74502a4305be93de01db777427_JsVxW47UX.jpg",
              _id: "6a3cbf0ff98babc2de74c4e9",
            },
            {
              url: "https://ik.imagekit.io/shnxjeg2o/elevate/blueT-1_9qws7IwFr.jpg",
              _id: "6a3cbf0ff98babc2de74c4ea",
            },
          ],
          stock: 50,
          attributes: {
            Size: "XXL",
          },
          price: {
            amount: 499,
            currency: "INR",
          },
          _id: "6a3cbf0ff98babc2de74c4e8",
        },
      ],
    },
    quantity: 1,
    price: {
      amount: 499,
      currency: "INR",
    },
  },
  {
    _id: "6a3cbfaaf98babc2de74c522",
    product: {
      _id: "6a3cbe9cf98babc2de74c4d5",
      title: "Polo T - Blue style",
      description: "By Elevate & Co.",
      attributes: {
        Size: "S, M, L, XL",
      },
      seller: "6a264289dcfe5189602d92f2",
      stock: 50,
      price: {
        amount: 499,
        currency: "INR",
      },
      images: [
        {
          url: "https://ik.imagekit.io/shnxjeg2o/elevate/blueT_X4ETwQTAm.jpg",
          _id: "6a3cbe9cf98babc2de74c4d6",
        },
      ],
      variants: [
        {
          images: [
            {
              url: "https://ik.imagekit.io/shnxjeg2o/elevate/6SmkPepM_be76eb74502a4305be93de01db777427_JsVxW47UX.jpg",
              _id: "6a3cbf0ff98babc2de74c4e9",
            },
          ],
          stock: 50,
          attributes: {
            Size: "XXL",
          },
          price: {
            amount: 499,
            currency: "INR",
          },
          _id: "6a3cbf0ff98babc2de74c4e8",
        },
      ],
    },
    variant: "6a3cbf0ff98babc2de74c4e8",
    quantity: 2,
    price: {
      amount: 499,
      currency: "INR",
    },
  },
];

/* ─── Cart Page Component ─────────────────────────────────────────────── */
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxItems = useSelector((state) => state.cart.items);
  const { handleGetCart } = useCart();

  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { mobileSidebarOpen, setMobileSidebarOpen } = useOutletContext();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    (async () => {
      await handleGetCart();
      setLoaded(true);
    })();
  }, []);

  /* Sync local items with Redux or fallback to sample data */
  useEffect(() => {
    if (loaded) {
      if (reduxItems && reduxItems.length > 0) {
        setItems(reduxItems);
      } else {
        setItems(SAMPLE_CART_DATA);
      }
    }
  }, [loaded, reduxItems]);

  const handleQtyChange = (itemId, newQty) => {
    if (newQty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i._id === itemId ? { ...i, quantity: newQty } : i)),
    );
    dispatch(updateQuantity({ id: itemId, quantity: newQty }));
  };

  const handleRemoveItem = (itemId) => {
    setItems((prev) => prev.filter((i) => i._id !== itemId));
    dispatch(removeItem(itemId));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "ELEVATE10") {
      setDiscount(0.1);
      alert("Promo code ELEVATE10 applied! (10% off)");
    } else if (promoCode.trim()) {
      alert("Invalid promo code. Try 'ELEVATE10'");
    }
  };

  /* ── Order Derivations ── */
  const currency = items[0]?.price?.currency || "INR";
  const rawSubtotal = items.reduce(
    (sum, item) => sum + (item.price?.amount || 0) * (item.quantity || 1),
    0,
  );
  const discountAmount = Math.round(rawSubtotal * discount);
  const subtotal = rawSubtotal - discountAmount;
  const shipping = subtotal > 0 ? (subtotal >= 1500 ? 0 : 99) : 0;
  const total = subtotal + shipping;

  return (
    <div
      className="h-screen overflow-hidden bg-[#FAF8F5] flex"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
    >
      {/* ── Sidebar Navigation ─────────────────────────────────────── */}
      <BuyerSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── Page Content Column ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar containing Elevate logo & User Menu with Logout */}
        {/* <HeaderBar onMenuClick={() => setMobileSidebarOpen(true)} /> */}

        {/* Scrollable Cart Main Area */}
        <main className="flex-1 px-6 sm:px-10 py-8 min-h-0 overflow-y-auto font-sans">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb / Top Bar */}
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[#C4A96B] text-[10px] font-normal uppercase tracking-[0.25em] mb-1">
                  <SparkleIcon />
                  Elevate Luxury
                </span>
                <h1
                  className="text-4xl sm:text-5xl font-light text-[#1A1A1A] tracking-wide"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Shopping Bag
                </h1>
              </div>
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#9A9A9A] hover:text-[#C4A96B] transition-colors duration-200"
              >
                <ArrowLeftIcon />
                Continue Shopping
              </Link>
            </div>

            {/* Two-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 pb-16">
              {/* Left Column: Cart Items List (8 cols on desktop) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {items.length === 0 ? (
                  /* Empty Cart State */
                  <div className="bg-white border border-gray-100 p-16 text-center flex flex-col items-center justify-center gap-5 rounded-sm shadow-2xl/5 my-6">
                    <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#C4A96B] mb-2">
                      <CartIcon />
                    </div>
                    <h2
                      className="text-3xl font-light text-[#1A1A1A]"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                      }}
                    >
                      Your Bag is Empty
                    </h2>
                    <p className="text-[#9A9A9A] text-xs uppercase tracking-widest max-w-sm leading-relaxed font-sans">
                      Discover our curated luxury collection and add timeless
                      pieces to your wardrobe.
                    </p>
                    <Link
                      to="/"
                      className="mt-4 inline-flex items-center gap-2 px-8 py-3.5 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.2em] hover:bg-[#C4A96B] transition-all duration-300 font-sans shadow-sm"
                    >
                      Explore Collection
                    </Link>
                  </div>
                ) : (
                  /* Cart Items List */
                  items.map((item) => {
                    const prod = item.product || {};
                    const variantId = item.variant;
                    const variantObj = prod.variants?.find(
                      (v) => v._id === variantId,
                    );

                    /* Resolve Thumbnail & Attributes */
                    const imgUrl =
                      variantObj?.images?.[0]?.url || prod.images?.[0]?.url;
                    const attrs =
                      variantObj?.attributes || prod.attributes || {};

                    return (
                      <article
                        key={item._id}
                        className="group bg-white border border-gray-100 p-5 sm:p-6 rounded-sm hover:border-[#C4A96B]/40 hover:shadow-sm transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                      >
                        {/* Thumbnail Image */}
                        <div
                          onClick={() =>
                            prod._id && navigate(`/product/${prod._id}`)
                          }
                          className="w-24 sm:w-32 aspect-[3/4] bg-[#FAF8F5] border border-gray-100 rounded-sm overflow-hidden flex-shrink-0 relative cursor-pointer"
                        >
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={prod.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] uppercase tracking-widest">
                              No image
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5 font-sans">
                          <span className="text-[10px] uppercase tracking-widest text-[#9A9A9A]">
                            {prod.description || "Elevate & Co."}
                          </span>
                          <Link
                            to={`/product/${prod._id}`}
                            className="text-xl font-normal text-[#1A1A1A] hover:text-[#C4A96B] transition-colors duration-200 truncate font-serif"
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', Georgia, serif",
                            }}
                          >
                            {prod.title || "Luxury Piece"}
                          </Link>

                          {/* Attribute Badges */}
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Object.entries(attrs).map(([key, val]) => (
                              <span
                                key={key}
                                className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2.5 py-1 bg-[#FAF8F5] border border-gray-100 text-[#1A1A1A]"
                              >
                                <span className="text-[#9A9A9A]">{key}:</span>{" "}
                                {val}
                              </span>
                            ))}
                          </div>

                          {/* Mobile Unit Price */}
                          <div className="sm:hidden mt-2 text-sm text-[#9A9A9A] font-sans">
                            {formatPrice(
                              item.price?.amount,
                              item.price?.currency,
                            )}{" "}
                            each
                          </div>
                        </div>

                        {/* Controls Column */}
                        <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto mt-2 sm:mt-0 gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 font-sans">
                          {/* Desktop Total Price */}
                          <span
                            className="text-xl font-light text-[#1A1A1A] tracking-tight font-serif"
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', Georgia, serif",
                            }}
                          >
                            {formatPrice(
                              (item.price?.amount || 0) * item.quantity,
                              item.price?.currency,
                            )}
                          </span>

                          {/* Quantity Selector */}
                          <div className="flex items-center border border-gray-200 bg-[#FAF8F5] rounded-sm">
                            <button
                              type="button"
                              onClick={() =>
                                handleQtyChange(item._id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-[#1A1A1A] hover:bg-[#C4A96B] hover:text-white transition-colors duration-200 text-sm cursor-pointer disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-[#1A1A1A]"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-10 text-center text-xs font-medium text-[#1A1A1A]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleQtyChange(item._id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center text-[#1A1A1A] hover:bg-[#C4A96B] hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove Action */}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 cursor-pointer flex items-center gap-1 text-[10px] uppercase tracking-widest sm:mt-1"
                          >
                            <TrashIcon />
                            <span className="sm:hidden">Remove</span>
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}

                {/* Mobile Back to Shopping */}
                <div className="sm:hidden mt-4 text-center">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#9A9A9A] hover:text-[#C4A96B]"
                  >
                    <ArrowLeftIcon />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Summary Card (4 cols on desktop) */}
              <div className="lg:col-span-4 font-sans">
                <div className="sticky top-6 bg-white border border-gray-100 p-6 sm:p-8 rounded-sm shadow-sm flex flex-col gap-6">
                  <h2
                    className="text-2xl font-light text-[#1A1A1A] border-b border-gray-100 pb-4"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    Order Summary
                  </h2>

                  {/* Pricing Breakdown */}
                  <div className="flex flex-col gap-4 text-xs text-[#1A1A1A]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#9A9A9A] uppercase tracking-widest text-[10px]">
                        Subtotal
                      </span>
                      <span className="font-light text-sm">
                        {formatPrice(rawSubtotal, currency)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between items-center text-[#C4A96B]">
                        <span className="uppercase tracking-widest text-[10px]">
                          Promo Discount (10%)
                        </span>
                        <span className="font-light text-sm">
                          −{formatPrice(discountAmount, currency)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-[#9A9A9A] uppercase tracking-widest text-[10px]">
                        Estimated Shipping
                      </span>
                      <span className="font-light text-sm">
                        {shipping === 0 && rawSubtotal > 0 ? (
                          <span className="text-[#C4A96B] uppercase tracking-wider text-[10px] font-medium">
                            Complimentary
                          </span>
                        ) : (
                          formatPrice(shipping, currency)
                        )}
                      </span>
                    </div>

                    {rawSubtotal > 0 && rawSubtotal < 1500 && (
                      <div className="bg-[#FAF8F5] border border-gray-100 p-3 rounded-sm">
                        <p className="text-[10px] text-[#9A9A9A] leading-relaxed">
                          Add{" "}
                          <strong className="text-[#1A1A1A] font-normal">
                            {formatPrice(1500 - rawSubtotal, currency)}
                          </strong>{" "}
                          more to qualify for complimentary white-glove
                          shipping.
                        </p>
                      </div>
                    )}

                    <div className="border-t border-gray-100 my-1" />

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="uppercase tracking-widest text-xs font-normal">
                        Total
                      </span>
                      <span
                        className="text-3xl font-light text-[#C4A96B] tracking-tight"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                        }}
                      >
                        {formatPrice(total, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Promo Code Input Form */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="GIFT / PROMO CODE"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-[#FAF8F5] border border-gray-200 px-3.5 py-2.5 text-[10px] uppercase tracking-widest text-[#1A1A1A] placeholder:text-gray-400 outline-none focus:border-[#C4A96B] transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest hover:bg-[#C4A96B] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Checkout CTA */}
                  <button
                    type="button"
                    disabled={items.length === 0}
                    onClick={() =>
                      alert("Proceeding to Elevate Secure Checkout…")
                    }
                    className="w-full py-4 bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#C4A96B] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <BoltIcon />
                    Proceed to Checkout
                  </button>

                  {/* Guarantee & Cards */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 text-center">
                    <span className="text-[9px] uppercase tracking-widest text-[#9A9A9A]">
                      🔒 Secure Checkout & Complimentary Returns
                    </span>
                    <div className="flex justify-center gap-3 text-[10px] tracking-widest font-mono text-gray-400 mt-1">
                      <span>VISA</span> • <span>MASTERCARD</span> •{" "}
                      <span>AMEX</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cart;
