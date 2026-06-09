import React from "react";

/**
 * Google OAuth Button Component
 * Strictly follows Google's official branding guidelines.
 * Renders as <a> tag for full-page redirect to Express OAuth route.
 *
 * @param {string} theme - "light" | "dark" | "neutral"
 * @param {string} size - "standard" (h-10) | "large" (h-12)
 * @param {string} shape - "rounded" | "rounded-full"
 * @param {boolean} fullWidth - true for w-full, false for w-auto
 * @param {string} href - OAuth route, defaults to "/api/auth/google"
 */
const GoogleAuthButton = ({
  theme = "light",
  size = "standard",
  shape = "rounded",
  fullWidth = false,
  href = "/api/auth/google",
}) => {
  const heightClass = size === "large" ? "h-12" : "h-10";

  // BUG 2 FIX: widthClass now controls the display type too — no "flex" in baseClasses
  const widthClass = fullWidth ? "flex w-full" : "inline-flex w-auto";

  const shapeClass = shape === "rounded-full" ? "rounded-full" : "rounded";

  // BUG 1 FIX: single line string — no newlines inside template literal
  const baseClasses = [
    "items-center font-medium text-sm tracking-wide",
    heightClass,
    shapeClass,
    widthClass,
    "transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    "overflow-hidden cursor-pointer",
  ].join(" ");

  const themeClasses = {
    light:
      "bg-white text-[#1F1F1F] border border-[#747775] hover:bg-gray-50 active:bg-gray-100",
    neutral: "bg-[#F2F2F2] text-[#1F1F1F] hover:bg-gray-200 active:bg-gray-300",
    dark: "bg-[#131314] text-[#E3E3E3] hover:bg-[#1e1e1e] active:bg-[#2a2a2a]",
  };

  const logoBorderClass = {
    light: "border-r border-[#747775]",
    neutral: "border-r border-gray-300",
    dark: "border-r border-[#3a3a3a]",
  };

  // BUG 3 FIX: fallback to "light" if theme is invalid/undefined
  const resolvedTheme = themeClasses[theme] ? theme : "light";

  return (
    <a href={href} className={`${baseClasses} ${themeClasses[resolvedTheme]}`}>
      {/* Logo container: always white bg per Google guidelines */}
      <div
        className={`flex items-center justify-center bg-white p-2 h-full ${logoBorderClass[resolvedTheme]}`}
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-5 h-5"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
      </div>

      {/* Button text */}
      <span className="flex-1 text-center px-4">Continue with Google</span>
    </a>
  );
};

export default GoogleAuthButton;
