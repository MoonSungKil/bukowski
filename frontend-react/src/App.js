import { useEffect } from "react";
import "./App.css";
import MainPage from "./components/MainPage/MainPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSiteState } from "./context/SiteStateContext";
import Layout from "./components/Layout/Layout";
import AuthPage from "./components/AuthPage/Auth";
import SinglePage from "./components/SinglePage/SinglePage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import { ProfileStateProvider } from "./context/ProfileStateContext";

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
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
