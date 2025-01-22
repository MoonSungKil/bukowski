import { createContext, useReducer, useEffect } from "react";
import siteStateReducer, { initialState } from "./SiteStateReducer";
import { useContext } from "react";
import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";

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

  //  TALE Context

  //   Redhydrate the TalesState
  useEffect(() => {
    const storedPurchasedTales = localStorage.getItem("purchased");
    const storedPublishedTales = localStorage.getItem("published");
    const draftedTales = localStorage.getItem("drafts");
    const singleTaleSelected = localStorage.getItem("singleTaleSelected");
    const singleDraftSelected = localStorage.getItem("singleDraftSelected");
    if (storedPurchasedTales) {
      dispatch({
        type: "GET_ALL_PURCHASED_TALES",
        payload: {
          purchased: JSON.parse(storedPurchasedTales),
        },
      });
    }
    if (storedPublishedTales) {
      dispatch({
        type: "GET_ALL_PUBLISHED_TALES",
        payload: {
          published: JSON.parse(storedPublishedTales),
        },
      });
    }
    if (draftedTales) {
      dispatch({
        type: "GET_ALL_DRAFTED_TALES",
        payload: {
          drafts: JSON.parse(draftedTales),
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
    if (singleDraftSelected) {
      dispatch({
        type: "GET_SINGLE_DRAFT",
        payload: {
          singleDraftSelected: JSON.parse(singleDraftSelected),
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

  // create tale
  const createTale = async (formData) => {
    try {
      const { data: tale } = await axios.post("http://localhost:8000/tales/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      dispatch({
        type: "CREATE_TALE",
        payload: {
          tale: tale,
        },
      });

      return tale;
    } catch (error) {
      console.log(error);
    }
  };

  // convert draft to tale
  const convertDraftToTale = async (formData, draftID) => {
    try {
      const { data: tale } = await axios.post(
        `http://localhost:8000/tales/convert_draft_to_tale/${draftID}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      dispatch({
        type: "CREATE_TALE_DELETE_DRAFT",
        payload: {
          tale: tale,
          draftID: draftID,
        },
      });

      return tale;
    } catch (error) {
      console.log(error);
    }
  };

  // create draft
  const createDraft = async (formData) => {
    try {
      const { data: draft } = await axios.post(
        "http://localhost:8000/tales/create_draft",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      dispatch({
        type: "CREATE_DRAFT",
        payload: {
          draft: draft,
        },
      });

      return draft;
    } catch (error) {
      console.log(error);
    }
  };

  //Update draft
  const updateDraft = async (formData, draftID) => {
    try {
      const { data: draft } = await axios.put(
        `http://localhost:8000/tales/update_draft/${draftID}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      dispatch({
        type: "UPDATE_DRAFT",
        payload: {
          draft: draft,
          draftID: draftID,
        },
      });

      return draft;
    } catch (error) {
      console.log(error);
    }
  };

  const getSingleDraft = async (id) => {
    const { data: draft } = await axios.get(`http://localhost:8000/tales/get_single_draft/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    try {
      dispatch({
        type: "GET_SINGLE_DRAFT",
        payload: {
          singleDraftSelected: draft,
        },
      });

      return draft;

      // localStorage.setItem("singleDraftSelected", JSON.stringify(draft));
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

      localStorage.setItem("purchased", JSON.stringify(purchasedTales));

      dispatch({
        type: "GET_ALL_PURCHASED_TALES",
        payload: {
          purchased: purchasedTales,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // check if the selected tale is purchased
  const isPurchased = async (id) => {
    try {
      return state.purchased.some((tale) => +tale.ID === +id);
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // get all the published tales for a logged user
  const getAllPublishedTales = async () => {
    try {
      const { data: publishedTales } = await axios.get(
        "http://localhost:8000/tales/get_all_published",
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      localStorage.setItem("published", JSON.stringify(publishedTales));

      dispatch({
        type: "GET_ALL_PUBLISHED_TALES",
        payload: {
          published: publishedTales,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  // get all the purhcased tales for a logged user
  const getAllDraftedTales = async () => {
    try {
      const { data: drafts } = await axios.get("http://localhost:8000/tales/get_all_drafts", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      localStorage.setItem("drafts", JSON.stringify(drafts));

      dispatch({
        type: "GET_ALL_DRAFTED_TALES",
        payload: {
          drafts: drafts,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // END TALE CONTEXT

  // USER CONTEXT
  //   Redhydrate the userState
  useEffect(() => {
    const storedUser = localStorage.getItem("userLoggedIn");
    if (storedUser) {
      dispatch({
        type: "LOGIN_USER",
        payload: {
          user: JSON.parse(storedUser),
        },
      });
    }
  }, []);

  // login user
  const loginUser = async (email, password) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/users/login",
        {
          username: email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      localStorage.setItem("userLoggedIn", JSON.stringify(data.user));
      dispatch({
        type: "LOGIN_USER",
        payload: {
          user: data.user,
        },
      });

      getAllPurchasedTales();
      getAllPublishedTales();
      getAllDraftedTales();

      return true;
    } catch (error) {
      return false;
    }
  };

  // logout user
  const logoutUser = async () => {
    try {
      const { data } = axios.post(
        "http://localhost:8000/users/logout",
        {},
        { withCredentials: true }
      );
      console.log(data);

      localStorage.removeItem("userLoggedIn");
      localStorage.removeItem("purchased");
      localStorage.removeItem("singleTaleSelected");
      localStorage.removeItem("drafts");
      localStorage.removeItem("published");

      dispatch({
        type: "LOGOUT_USER",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserProfilePicture = async (file, id) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.put(
        `http://localhost:8000/users/update_profile_picture/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      dispatch({
        type: "UPDATE_PROFILE_PICTURE",
        payload: {
          profilePicture: data.filePath,
        },
      });

      let userInLocalStorage = localStorage.getItem("userLoggedIn");
      userInLocalStorage = JSON.parse(userInLocalStorage);
      userInLocalStorage.profile_picture = data.filePath;
      localStorage.setItem("userLoggedIn", JSON.stringify(userInLocalStorage));

      console.log("Upload sucessful:", data.filePath);
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserProfileInfo = async (id, KeyAndValue) => {
    try {
      await axios.put(`http://localhost:8000/users/update_info/${id}`, KeyAndValue, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const key = Object.keys(KeyAndValue);

      dispatch({
        type: "UPDATE_PROFILE_INFO",
        payload: {
          key: key,
          value: KeyAndValue[key],
        },
      });

      let userInLocalStorage = localStorage.getItem("userLoggedIn");
      userInLocalStorage = JSON.parse(userInLocalStorage);
      userInLocalStorage[key] = KeyAndValue[key];
      localStorage.setItem("userLoggedIn", JSON.stringify(userInLocalStorage));
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfilePassword = async (id, passwordData) => {
    try {
      const { data } = await axios.put(
        `http://localhost:8000/users/update_password/${id}`,
        passwordData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // END USER CONTEXT

  return (
    <SiteStateContext.Provider
      value={{
        authModalType: state.authModalType,
        authModalOpen: state.authModalOpen,
        openAuthModalRegister,
        openAuthModalLogin,
        closeAuthModal,
        // user values
        loginUser: loginUser,
        logoutUser,
        updateUserProfilePicture,
        updateUserProfileInfo,
        updateProfilePassword,
        getAllDraftedTales,
        users: state.users,
        userLoggedIn: state.userLoggedIn,
        // end user values
        // tale values
        tales: state.tales,
        purchased: state.purchased,
        published: state.published,
        singleTaleSelected: state.singleTaleSelected,
        singleDraftSelected: state.singleDraftSelected,
        getAllTales,
        getSingleTale,
        getAllPurchasedTales,
        getAllPublishedTales,
        isPurchased,
        createTale,
        createDraft,
        getSingleDraft,
        convertDraftToTale,
        updateDraft,
        // end tale values
        stateObject: state,
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
