import React from "react";
import ImageCarousel from "./ImageCarousel.jsx";
import { EditIcon, TrashIcon, SpinnerIcon } from "./icons.jsx";
import { formatPrice, formatDate } from "../utils/formatters.js";

const SellerProductCard = ({ product, onClick, onEdit, onDelete, actionLoading }) => {
  const { title, description, price, images, createdAt } = product;

  const isEditing  = actionLoading === "edit";
  const isDeleting = actionLoading === "delete";
  const isBusy     = isEditing || isDeleting;

  return (
    <article
      onClick={() => onClick(product)}
      id={`product-card-${product._id}`}
      className="
        group relative bg-white border border-gray-100 rounded-sm overflow-hidden
        hover:border-[#C4A96B]/40 hover:shadow-sm
        transition-all duration-300 cursor-pointer
        flex flex-col
      "
    >
      {/* Carousel */}
      <ImageCarousel images={images} title={title} />

      {/* Body */}
      <div className="flex flex-col gap-3 p-5 flex-grow">
        {/* Title */}
        <h3 className="text-[#1A1A1A] font-normal text-sm leading-snug line-clamp-2 group-hover:text-[#C4A96B] transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[#9A9A9A] text-xs leading-relaxed line-clamp-3 flex-grow">
          {description || "No description provided."}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span
            className="text-[#C4A96B] font-light text-base tracking-tight"
            style={{ fontFamily: "'Nib Pro', serif" }}
          >
            {formatPrice(price?.amount, price?.currency)}
          </span>
          <span className="text-[#9A9A9A] text-[10px] uppercase tracking-widest">
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
          disabled={isBusy}
          onClick={() => onEdit?.(product)}
          className="
            flex items-center gap-1.5 px-2.5 py-1.5
            bg-white/95 border border-gray-200
            text-[#1A1A1A] hover:text-[#C4A96B] hover:border-[#C4A96B]/40
            text-[10px] font-normal uppercase tracking-widest
            transition-all duration-150 cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isEditing ? <SpinnerIcon /> : <EditIcon />}
          Edit
        </button>
        <button
          id={`delete-btn-${product._id}`}
          title="Delete product"
          disabled={isBusy}
          onClick={() => onDelete?.(product)}
          className="
            flex items-center gap-1.5 px-2.5 py-1.5
            bg-white/95 border border-gray-200
            text-[#1A1A1A] hover:text-red-500 hover:border-red-200
            text-[10px] font-normal uppercase tracking-widest
            transition-all duration-150 cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isDeleting ? <SpinnerIcon /> : <TrashIcon />}
          Delete
        </button>
      </div>
    </article>
  );
};

export default SellerProductCard;
