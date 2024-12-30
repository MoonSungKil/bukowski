import { useEffect } from "react";
import "./App.css";
import MainPage from "./components/MainPage/MainPage";
import { useTale } from "./context/TaleContext";

function App() {
  const { getAllPurchasedTales } = useTale();

  useEffect(() => {
    getAllPurchasedTales();
  }, []);

  return (
    <div className="App">
      <MainPage />
    </div>
  );
}

export default App;
