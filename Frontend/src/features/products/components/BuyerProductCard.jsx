import React from "react";
import { useNavigate } from "react-router";
import { CartIcon } from "./icons.jsx";
import { formatPrice } from "../utils/formatters.js";

const BuyerProductCard = ({ product }) => {
  const { title, description, price, images } = product;
  const firstImage = images?.[0]?.url;
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/product/${product._id}`)}
      id={`product-card-${product._id}`}
      className="
        group relative bg-white border border-gray-100 rounded-xl overflow-hidden
        hover:border-[#C4A96B]/40 hover:shadow-sm
        hover:-translate-y-0.5
        transition-all duration-300 cursor-pointer
        flex flex-col
      "
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
        {firstImage ? (
          <img
            src={firstImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">
            No image
          </div>
        )}
        {/* Currency badge */}
        <span className="absolute top-3 left-3 bg-white/90 border border-gray-100 text-[#9A9A9A] text-[9px] font-normal uppercase tracking-widest px-2 py-0.5">
          {price?.currency}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 p-5 flex-grow">
        {/* Title */}
        <h3 className="text-[#1A1A1A] font-normal text-lg truncate leading-snug line-clamp-2 group-hover:text-[#C4A96B] transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[#9A9A9A] text-sm leading-relaxed line-clamp-3 flex-grow">
          {description || "No description provided."}
        </p>

        {/* Price + CTA  */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span
            className="text-[#1A1A1A] font-light text-base tracking-tight"
            style={{ fontFamily: "'Nib Pro', serif" }}
          >
            {formatPrice(price?.amount, price?.currency)}
          </span>
          {/* <button
            id={`add-to-cart-${product._id}`}
            className="
              flex items-center gap-1.5 px-3 py-1.5
              border border-[#C4A96B] text-[#C4A96B]
              text-[9px] font-normal uppercase tracking-widest
              hover:bg-[#C4A96B] hover:text-white
              transition-all duration-200 cursor-pointer
            "
            onClick={(e) => e.stopPropagation()}
          >
            <CartIcon />
            Add
          </button> */}
        </div>
      </div>
    </article>
  );
};

export default BuyerProductCard;
