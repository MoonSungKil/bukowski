import { createContext, useReducer } from "react";
import siteStateReducer, { initialState } from "./SiteStateReducer";
import { useContext } from "react";

const SiteStateContext = createContext();

export const SiteStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(siteStateReducer, initialState);

  const openAuthModalRegister = () => {
    try {
      dispatch({
        type: "OPEN_AUTH_MODAL_REGISTER",
        payload: {
          authModalType: "register",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openAuthModalLogin = () => {
    try {
      dispatch({
        type: "OPEN_AUTH_MODAL_LOGIN",
        payload: {
          authModalType: "login",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const closeAuthModal = () => {
    try {
      dispatch({
        type: "CLOSE_AUTH_MODAL",
        payload: {
          authModalOpen: false,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SiteStateContext.Provider
      value={{
        authModalType: state.authModalType,
        authModalOpen: state.authModalOpen,
        openAuthModalRegister,
        openAuthModalLogin,
        closeAuthModal,
      }}
    >
      {children}
    </SiteStateContext.Provider>
  );
};

export const useSiteState = () => {
  const context = useContext(SiteStateContext);
  if (context === undefined) {
    throw new Error("useSiteState must be within SiteStateContext");
  }
  return { ...context };
};

export default SiteStateContext;
