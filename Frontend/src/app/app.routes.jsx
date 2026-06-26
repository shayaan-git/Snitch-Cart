import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import Dashboard from "../features/products/pages/Dashboard.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import Homepage from "../features/products/pages/Homepage.jsx";
import ProductDetail from "../features/products/pages/ProductDetail.jsx";
import SellerProductDetails from "../features/products/pages/SellerProductDetails.jsx";
import Cart from "../features/cart/pages/Cart.jsx";
import AppLayout from "./AppLayout.jsx";

export const routes = createBrowserRouter([
  // buyer routes + seller can also access these

  // http://localhost:5173/register
  {
    path: "/register",
    element: <Register />,
  },
  // http://localhost:5173/login
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <AppLayout />,
    children: [
      // http://localhost:5173/
      {
        path: "/",
        element: <Homepage />,
      },

      // http://localhost:5173/product/6a3cbe9cf98babc2de74c4d5
      {
        path: "/product/:productId",
        element: <ProductDetail />,
      },

      // http://localhost:5173/cart
      {
        path: "/cart",
        element: (
          <Protected role="buyer">
            <Cart />
          </Protected>
        ),
      },

      // seller routes
      {
        path: "/seller",
        children: [
          {
            path: "/seller/create-product",
            element: (
              <Protected role="seller">
                <CreateProduct />
              </Protected>
            ),
          },
          {
            path: "/seller/dashboard",
            element: (
              <Protected role="seller">
                <Dashboard />
              </Protected>
            ),
          },
          {
            path: "/seller/product/:productId",
            element: (
              <Protected role="seller">
                <SellerProductDetails />
              </Protected>
            ),
          },
        ],
      },
    ],
  },
]);
