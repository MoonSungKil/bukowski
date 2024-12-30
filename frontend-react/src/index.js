import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./components/AuthPage/Auth";
import { SiteStateProvider } from "./context/SiteStateContext";
import SinglePage from "./components/SinglePage/SinglePage";
import { TaleProvider } from "./context/TaleContext";
import { UserProvider } from "./context/UserContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/tale/:id",
    element: <SinglePage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SiteStateProvider>
      <UserProvider>
        <TaleProvider>
          <RouterProvider router={router} />
        </TaleProvider>
      </UserProvider>
    </SiteStateProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
