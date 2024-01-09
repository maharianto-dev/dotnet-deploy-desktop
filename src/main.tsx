import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles.css";
import Layout from "./components/Layout";
import BuildPage from "./routes/BuildPage";
import MainPage from "./routes/MainPage";
import RunPage from "./routes/RunPage";
import { Provider } from "react-redux";
import { globalStore } from "./redux/store";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/build-page",
        element: <BuildPage />,
      },
      {
        path: "/run-page",
        element: <RunPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={globalStore}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
