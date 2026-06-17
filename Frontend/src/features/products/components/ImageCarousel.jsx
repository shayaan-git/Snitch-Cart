import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons.jsx";

const ImageCarousel = ({ images, title }) => {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-50 flex items-center justify-center">
        <span className="text-gray-300 text-xs uppercase tracking-widest">No image</span>
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
    <div className="relative w-full aspect-[4/3] overflow-hidden group/carousel bg-gray-50">
      {/* Main image */}
      <img
        src={images[active]?.url}
        alt={`${title} — image ${active + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="lazy"
      />

      {/* Gradient overlay bottom */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 bg-white/80 hover:bg-white text-[#1A1A1A] rounded-full p-1.5"
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 bg-white/80 hover:bg-white text-[#1A1A1A] rounded-full p-1.5"
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
                    ? "bg-[#C4A96B] scale-125"
                    : "bg-white/60 hover:bg-white/90"
                }`}
              />
            ))}
          </div>

          {/* Image counter badge */}
          <span className="absolute top-2 right-2 bg-white/80 text-[#9A9A9A] text-[10px] font-normal px-2 py-0.5">
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
              className={`w-8 h-8 overflow-hidden border-2 transition-all duration-150 flex-shrink-0 ${
                i === active
                  ? "border-[#C4A96B] scale-110"
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

export default ImageCarousel;
