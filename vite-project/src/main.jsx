// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/rootLayout/RootLayout";
import HomePage from "./routes/homePage/HomePage";
import DashboardLayout from "./layout/dashboardLayout/DashboardLayout";
import DashBoardPage from "./routes/dashboardPage/DashboardPage";
import ChatPage from "./routes/chatPage/ChatPage";
import SignUpPage from "./routes/signUpPage/SignUpPage";
import SignInPage from "./routes/signInPage/SignInPage";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/sign-in/*",
        element: <SignInPage />,
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard/",
            element: <DashBoardPage />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
  </>
);
