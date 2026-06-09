import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hook/useAuth.js";
import { useNavigate } from "react-router";
import GoogleSigning from "../components/GoogleSigning.jsx";

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );

const InputField = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}) => (
  <div className="flex flex-col gap-1 lg:gap-1.5">
    <label
      htmlFor={id}
      className="text-[10px] lg:text-[11px] font-semibold uppercase tracking-widest text-[#9a9078]"
    >
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required
      className="
        w-full px-2.5 py-2 lg:px-3 lg:py-2.5
        bg-[#18181b] border border-[#27272a]
        rounded-xl text-[#e5e2e1] text-xs lg:text-sm
        placeholder:text-[#4e4633]
        outline-none
        transition-all duration-200
        focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/30
        hover:border-[#4e4633]
      "
    />
  </div>
);

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    contact: "",
    email: "",
    password: "",
    isSeller: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await handleRegister({
        email: form.email,
        contact: form.contact,
        fullname: form.fullname,
        password: form.password,
        isSeller: form.isSeller,
      });

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] flex flex-col lg:flex-row">
      {/* Left Side - Image (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <img
          src="/images/fashion-model.png"
          alt="Premium Fashion Models"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        {/* Subtle gradient overlay to smoothly blend with the dark background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#131313] pointer-events-none" />

        {/* Optional Branding on Image */}
        <div className="absolute bottom-12 left-12 max-w-md pointer-events-none">
          <h2 className="text-4xl font-bold text-white tracking-tight mb-4">
            Discover Exclusivity
          </h2>
          <p className="text-[#c8c6c5] text-lg">
            Join the ultimate premium marketplace for curated fashion and style.
          </p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-4 py-4 sm:py-8 lg:px-10 lg:py-12 xl:px-20">
        {/* Card */}
        <div
          className="
            w-full
            max-w-sm sm:max-w-md lg:max-w-lg
            bg-[#1c1b1b] border border-[#27272a]
            rounded-2xl
            px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10
            shadow-[0_40px_80px_rgba(0,0,0,0.4)]
          "
        >
          {/* Header */}
          <div className="mb-4 lg:mb-8">
            <span className="inline-block text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f5c518] mb-1.5 lg:mb-3">
              Welcome to Elevate
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#e5e2e1] leading-tight tracking-tight">
              Create account
            </h1>
            <p className="mt-1.5 lg:mt-2 text-xs lg:text-sm text-[#9a9078]">
              Join the marketplace. Discover or sell curated items.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-3 lg:mb-4 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-lg bg-[#93000a]/20 border border-[#93000a]/40 text-[#ffb4ab] text-[11px] lg:text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2.5 lg:gap-4"
            noValidate
          >
            {/* Full Name */}
            <InputField
              name="fullname"
              label="Full Name"
              value={form.fullname}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
            />

            {/* Contact Number */}
            <InputField
              id="contact"
              name="contact"
              label="Contact Number"
              type="tel"
              value={form.contact}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              autoComplete="tel"
            />

            {/* Email */}
            <InputField
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />

            {/* Password */}
            <div className="flex flex-col gap-1 lg:gap-1.5">
              <label
                htmlFor="password"
                className="text-[10px] lg:text-[11px] font-semibold uppercase tracking-widest text-[#9a9078]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  required
                  className="
                    w-full px-2.5 py-2 pr-9 lg:px-3 lg:py-2.5 lg:pr-10
                    bg-[#18181b] border border-[#27272a]
                    rounded-xl text-[#e5e2e1] text-xs lg:text-sm
                    placeholder:text-[#4e4633]
                    outline-none
                    transition-all duration-200
                    focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/30
                    hover:border-[#4e4633]
                  "
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    text-[#4e4633] hover:text-[#f5c518]
                    transition-colors duration-200 p-1
                  "
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* isSeller Checkbox */}
            <label
              htmlFor="isSeller"
              className="flex items-center gap-2 lg:gap-2.5 cursor-pointer group mt-0.5"
            >
              <div className="relative flex-shrink-0">
                <input
                  id="isSeller"
                  type="checkbox"
                  name="isSeller"
                  checked={form.isSeller}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                {/* Custom checkbox */}
                <div
                  className="
                    w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-[4px] border border-[#27272a]
                    bg-[#18181b]
                    peer-checked:bg-[#f5c518] peer-checked:border-[#f5c518]
                    transition-all duration-200
                    group-hover:border-[#f5c518]/50
                    flex items-center justify-center
                  "
                >
                  {form.isSeller && (
                    <svg
                      className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-[#131313]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-[11px] lg:text-xs text-[#c8c6c5] group-hover:text-[#e5e2e1] transition-colors duration-200 select-none">
                Register as a Seller
              </span>
            </label>

            {/* Submit Button */}
            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="
                mt-1 lg:mt-2 w-full py-2.5 lg:py-3
                bg-[#f5c518] text-[#1a1200] font-semibold text-xs lg:text-sm
                rounded-xl cursor-pointer
                transition-all duration-200
                hover:bg-[#ffe08b] hover:shadow-[0_0_24px_rgba(245,197,24,0.3)]
                active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#f5c518] disabled:hover:shadow-none
                focus:outline-none focus:ring-2 focus:ring-[#f5c518]/50
              "
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
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
                  Creating account…
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <GoogleSigning />
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2 lg:gap-3 my-4 lg:my-6">
            <div className="flex-1 h-px bg-[#27272a]" />
            <span className="text-[10px] text-[#4e4633] uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 h-px bg-[#27272a]" />
          </div>

          {/* Login Link */}
          <p className="text-center text-[11px] lg:text-xs text-[#9a9078]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#f5c518] font-semibold hover:text-[#ffe08b] transition-colors duration-200 underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
