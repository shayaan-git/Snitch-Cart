import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─── Toast helpers ──────────────────────────────────────────────────────
   Call these from anywhere in the app — they do NOT require a component.

   Usage:
     showCartToast("success")   → "Item added to your cart"
     showCartToast("oos")       → "This item is out of stock"
     showCartToast("auth")      → "Please log in to add items to your cart"
     showCartToast("error")     → generic error
─────────────────────────────────────────────────────────────────────────── */
export const showCartToast = (type = "success", customMessage = null) => {
  const config = {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    style: {
      background: "#1A1A1A",
      color: "#FFFFFF",
      fontFamily: "'Nib Pro', serif",
      fontSize: "11px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      borderRadius: "0px",
      border: "1px solid",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      minWidth: "280px",
    },
    progressStyle: {},
  };

  switch (type) {
    case "success":
      toast.success(customMessage ?? "Item added to your cart.", {
        ...config,
        style: {
          ...config.style,
          borderColor: "rgba(52, 211, 153, 0.3)",
        },
        progressStyle: { background: "#34D399" },
      });
      break;

    case "oos":
      toast.error(customMessage ?? "This item is currently out of stock.", {
        ...config,
        style: {
          ...config.style,
          borderColor: "rgba(248, 113, 113, 0.3)",
        },
        progressStyle: { background: "#F87171" },
      });
      break;

    case "auth":
      toast.warning(
        customMessage ?? "Please log in to add items to your cart.",
        {
          ...config,
          style: {
            ...config.style,
            borderColor: "rgba(196, 169, 107, 0.4)",
          },
          progressStyle: { background: "#C4A96B" },
        },
      );
      break;

    case "error":
    default:
      toast.error(customMessage ?? "Something went wrong. Please try again.", {
        ...config,
        style: {
          ...config.style,
          borderColor: "rgba(248, 113, 113, 0.3)",
        },
        progressStyle: { background: "#F87171" },
      });
      break;
  }
};

/* ─── Global container ───────────────────────────────────────────────────
   Mount <CartToastContainer /> once in App.jsx.
   All showCartToast() calls will render into this single container.
─────────────────────────────────────────────────────────────────────────── */
export const CartToastContainer = () => (
  <ToastContainer
    position="top-right"
    autoClose={2500}
    newestOnTop
    closeOnClick
    pauseOnHover
    draggable={false}
    limit={3}
    toastStyle={{
      background: "#1A1A1A",
      color: "#FFFFFF",
      fontFamily: "'Nib Pro', serif",
      fontSize: "11px",
      letterSpacing: "0.08em",
      borderRadius: "0px",
    }}
  />
);

export default CartToastContainer;
