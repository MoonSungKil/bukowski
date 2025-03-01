import { useEffect } from "react";
import "./App.css";
import MainPage from "./components/MainPage/MainPage";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { useSiteState } from "./context/SiteStateContext";
import Layout from "./components/Layout/Layout";
import AuthPage from "./components/AuthPage/Auth";
import SinglePage from "./components/SinglePage/SinglePage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import { ProfileStateProvider } from "./context/ProfileStateContext";
import ComposePage from "./components/ComposePage/ComposePage";
import UnsubscribeNewsletter from "./components/UnsubscribeNewsletter/UnsubscribeNewsletter";

function App() {
  const { getAllPurchasedTales } = useSiteState();

  useEffect(() => {
    getAllPurchasedTales();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
          <MainPage />
        </Layout>
      ),
    },
    {
      path: "/auth",
      element: (
        <Layout>
          <AuthPage />
        </Layout>
      ),
    },
    {
      path: "/tale/:id",
      element: (
        <Layout>
          <SinglePage />
        </Layout>
      ),
    },
    {
      path: "/profile/:username",
      element: (
        <Layout>
          <ProfileStateProvider>
            <ProfilePage />
          </ProfileStateProvider>
        </Layout>
      ),
    },
    {
      path: "/profile/:username/compose",
      element: (
        <Layout>
          <ComposePage />
        </Layout>
      ),
    },
    {
      path: "/profile/:username/edit/:tale_id",
      element: (
        <Layout>
          <ComposePage />
        </Layout>
      ),
    },
    {
      path: "/reset-password",
      element: (
        <Layout>
          <ResetPassword />
        </Layout>
      ),
    },
    {
      path: "/newsletter-unsubscribe",
      element: (
        <Layout>
          <UnsubscribeNewsletter />
        </Layout>
      ),
    },
    {
      path: "*",
      element: (
        <Layout>
          <MainPage />
        </Layout>
      ),
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
