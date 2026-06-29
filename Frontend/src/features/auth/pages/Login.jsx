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
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="text-[10px] font-normal uppercase tracking-widest text-gray-500"
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
        w-full py-2
        bg-transparent border-0 border-b border-gray-300
        text-[#1A1A1A] text-sm
        placeholder:text-gray-300
        outline-none
        transition-colors duration-200
        focus:border-gray-800
      "
    />
  </div>
);

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const user = await handleLogin({
        email: form.email,
        password: form.password,
      });
      if (user.role == "buyer") {
        navigate("/", { replace: true });
      } else if (user.role == "seller") {
        navigate("/seller/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Outer wrapper — min-h-screen so it grows naturally; flex-col on mobile, flex-row on desktop */
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col lg:flex-row">
      {/* Left Side — Image Panel: sticky so it stays in view on desktop */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#1A1A1A] overflow-hidden sticky top-0 h-screen flex-shrink-0">
        <img
          src="/images/fashion-model.png"
          alt="Premium Fashion Models"
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/50 pointer-events-none" />

        {/* ✅ "Above the Ordinary" pinned to top */}
        <p className="absolute top-8 left-14 text-white/60 text-sm uppercase tracking-widest pointer-events-none">
          Above the Ordinary!
        </p>

        {/* Branding on Image */}
        <div className="absolute bottom-14 left-14 max-w-md pointer-events-none">
          <h2
            className="text-5xl font-light text-white tracking-wide mb-4 leading-tight"
            style={{ fontFamily: "'Nib Pro', serif" }}
          >
            | Welcome Back
          </h2>
          <p className="text-white/60 text-sm uppercase tracking-widest">
            Return to the Elevate Store
          </p>
        </div>
      </div>

      {/* Right Side — scrolls internally if content overflows on very small screens */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-8 py-12 lg:px-16 xl:px-24 overflow-y-auto">
        {/* Form Container */}
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-10">
            <span className="inline-block text-[10px] font-normal uppercase tracking-[0.25em] text-[#C4A96B] mb-4">
              Welcome to Elevate
            </span>
            <h1
              className="text-4xl font-light text-[#1A1A1A] leading-tight"
              style={{ fontFamily: "'Nib Pro', serif" }}
            >
              Log in
            </h1>
            <p className="mt-2 text-xs text-gray-400 uppercase tracking-widest">
              Enter your details below to continue.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 px-4 py-3 border border-red-200 bg-red-50 text-red-600 text-xs tracking-wide">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-8"
            noValidate
          >
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
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[10px] font-normal uppercase tracking-widest text-gray-500"
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
                  autoComplete="current-password"
                  required
                  className="
                    w-full py-2 pr-10
                    bg-transparent border-0 border-b border-gray-300
                    text-[#1A1A1A] text-sm
                    placeholder:text-gray-300
                    outline-none
                    transition-colors duration-200
                    focus:border-gray-800
                  "
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  className="
                    absolute right-0 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-[#C4A96B]
                    transition-colors duration-200 p-1
                  "
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="
                w-full py-4
                bg-[#C4A96B] text-white
                uppercase tracking-[0.2em] text-xs
                rounded-none cursor-pointer
                transition-opacity duration-200
                hover:opacity-90
                disabled:opacity-50 disabled:cursor-not-allowed
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
                  Logging in…
                </span>
              ) : (
                "Log in"
              )}
            </button>

            <GoogleSigning />
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Register Link */}
          <p className="text-center text-xs text-gray-400 uppercase tracking-widest">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#C4A96B] hover:opacity-70 transition-opacity duration-200 underline underline-offset-4"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
