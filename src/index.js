import * as React from "react";
import './index.css';
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import App from "./App";
import DashBoardPage from "./DashBoard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "dashboard",
    element: <DashBoardPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

