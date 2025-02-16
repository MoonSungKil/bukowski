import { useEffect } from "react";
import "./App.css";
import MainPage from "./components/MainPage/MainPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSiteState } from "./context/SiteStateContext";
import Layout from "./components/Layout/Layout";
import AuthPage from "./components/AuthPage/Auth";
import SinglePage from "./components/SinglePage/SinglePage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import { ProfileStateProvider } from "./context/ProfileStateContext";
import ComposePage from "./components/ComposePage/ComposePage";

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
      path: "/profile/:id",
      element: (
        <Layout>
          <ProfileStateProvider>
            <ProfilePage />
          </ProfileStateProvider>
        </Layout>
      ),
    },
    {
      path: "/profile/:id/compose",
      element: (
        <Layout>
          <ComposePage />
        </Layout>
      ),
    },
    {
      path: "/profile/:id/edit/:tale_id",
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
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
