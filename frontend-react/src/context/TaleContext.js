import { createContext, useReducer, useContext, useEffect } from "react";
import taleReducer, { initialTaleState } from "./TaleReducer";
import axios from "axios";

const TaleContext = createContext();

export const TaleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taleReducer, initialTaleState);

  //   Redhydrate the TalesState
  useEffect(() => {
    const storedPurchasedTales = localStorage.getItem("purchasedTales");
    const singleTaleSelected = localStorage.getItem("singleTaleSelected");
    if (storedPurchasedTales) {
      dispatch({
        type: "GET_ALL_PURCHASED_TALES",
        payload: {
          purchasedTales: JSON.parse(storedPurchasedTales),
        },
      });
    }
    if (singleTaleSelected) {
      dispatch({
        type: "GET_SINGLE_TALE",
        payload: {
          singleTaleSelected: JSON.parse(singleTaleSelected),
        },
      });
    }
  }, []);

  // get all tales to show for everyone (unauthorized)
  const getAllTales = async () => {
    const { data: tales } = await axios.get("http://localhost:8000/tales/get_tales");

    try {
      dispatch({
        type: "GET_ALL_TALES",
        payload: {
          tales: tales,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // select tale to show for single page view
  const getSingleTale = async (id) => {
    const { data: tale } = await axios.get(`http://localhost:8000/tales/get_tales/${id}`);
    try {
      dispatch({
        type: "GET_SINGLE_TALE",
        payload: {
          singleTaleSelected: tale,
        },
      });

      localStorage.setItem("singleTaleSelected", JSON.stringify(tale));
    } catch (error) {
      console.log(error);
    }
  };

  // get all the purhcased tales for a logged user
  const getAllPurchasedTales = async () => {
    try {
      const { data: purchasedTales } = await axios.get(
        "http://localhost:8000/tales/get_all_purchased",
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      localStorage.setItem("purchasedTales", JSON.stringify(purchasedTales));

      dispatch({
        type: "GET_ALL_PURCHASED_TALES",
        payload: {
          purchasedTales: purchasedTales,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // check if the selected tale is purchased
  const isPurchased = async (id) => {
    try {
      return state.purchasedTales.some((tale) => +tale.ID === +id);
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <TaleContext.Provider
      value={{
        tales: state.tales,
        purchasedTales: state.purchasedTales,
        singleTaleSelected: state.singleTaleSelected,
        getAllTales,
        getSingleTale,
        getAllPurchasedTales,
        isPurchased,
      }}
    >
      {children}
    </TaleContext.Provider>
  );
};

export const useTale = () => {
  const context = useContext(TaleContext);
  if (context === undefined) {
    throw new Error("useTale must be used within TaleContext");
  }
  return { ...context };
};

export default TaleContext;
