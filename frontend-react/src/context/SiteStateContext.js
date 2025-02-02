import { createContext, useReducer, useEffect } from "react";
import siteStateReducer, { initialState } from "./SiteStateReducer";
import { useContext } from "react";
import axios from "axios";

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
    const { data } = await axios.get("http://localhost:8000/tales/get_tales");

    try {
      dispatch({
        type: "GET_ALL_TALES",
        payload: {
          tales: data.tales,
        },
      });

      localStorage.setItem("tales", JSON.stringify(data.tales));
    } catch (error) {
      console.log(error);
    }
  };

  const filterTales = (keyword, genres) => {
    dispatch({
      type: "FILTER_TALES",
      payload: {
        keyword: keyword,
        genres: genres,
      },
    });
  };

  const filterPurchased = (keyword) => {
    dispatch({
      type: "FILTER_PURCHASED_BY_KEYWORD",
      payload: {
        keyword: keyword,
      },
    });
  };

  const filterPublished = (keyword) => {
    dispatch({
      type: "FILTER_PUBLISHED_BY_KEYWORD",
      payload: {
        keyword: keyword,
      },
    });
  };

  const filterDrafts = (keyword) => {
    dispatch({
      type: "FILTER_DRAFTS_BY_KEYWORD",
      payload: {
        keyword: keyword,
      },
    });
  };

  const quickFilterTale = (keyword) => {
    dispatch({
      type: "QUICK_FILTER_TALE",
      payload: {
        keyword: keyword,
      },
    });
  };

  // select tale to show for single page view
  const getSingleTale = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:8000/tales/get_tales/${id}`);
      return data.tale;
    } catch (error) {
      console.log(error);
    }
  };

  //  get single tale published
  const getSingleTalePublished = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:8000/tales/published/${id}`, {
        withCredentials: true,
      });

      return data.tale;
    } catch (error) {
      console.log(error);
    }
  };

  // get single tale purchased
  const getSingleTalePurchased = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:8000/tales/purchased/${id}`, {
        withCredentials: true,
      });
      return data.tale;
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
      console.log(error.response.data);

      const message = Array.isArray(error.response.data.error)
        ? error.response.data.error[0]
        : error.response.data.error;

      dispatch({
        type: "SET_ERROR_MODAL",
        payload: {
          errorMessage: message,
          errorState: true,
        },
      });

      setTimeout(() => {
        dispatch({
          type: "SET_ERROR_MODAL",
          payload: {
            errorMessage: [],
            errorState: false,
          },
        });
      }, 2500);

      return false;
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
      console.log(error.response.data);

      const message = Array.isArray(error.response.data.error)
        ? error.response.data.error[0]
        : error.response.data.error;

      dispatch({
        type: "SET_ERROR_MODAL",
        payload: {
          errorMessage: message,
          errorState: true,
        },
      });

      setTimeout(() => {
        dispatch({
          type: "SET_ERROR_MODAL",
          payload: {
            errorMessage: [],
            errorState: false,
          },
        });
      }, 2500);

      return false;
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

  //Delete draft
  const deleteDraft = async (draftID) => {
    try {
      const { data: draft } = await axios.delete(
        `http://localhost:8000/tales/delete_draft/${draftID}`,
        {
          withCredentials: true,
        }
      );

      dispatch({
        type: "DELETE_DRAFT",
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
  const isPurchasedorPublished = async (id) => {
    try {
      return (
        state.purchased.some((tale) => +tale.ID === +id) ||
        state.published.some((tale) => +tale.ID === +id)
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  //check if tale is published
  const hasAccessToTale = async (id) => {
    try {
      return state.published.some((tale) => +tale.ID === +id);
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  //fetch tale by access
  const getTaleByAccess = async (id) => {
    if (state.published.some((tale) => +tale.ID === +id)) {
      return await getSingleTalePublished(id);
    } else if (state.purchased.some((tale) => +tale.ID === +id)) {
      return await getSingleTalePurchased(id);
    } else {
      return await getSingleTale(id);
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

  const getAllGenres = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/tales/get_genres");

      return data.genres;
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
      console.log(error);

      const message = Array.isArray(error.response.data.error)
        ? error.response.data.error[0]
        : error.response.data.error;

      dispatch({
        type: "SET_ERROR_MODAL",
        payload: {
          errorMessage: message,
          errorState: true,
        },
      });

      setTimeout(() => {
        dispatch({
          type: "SET_ERROR_MODAL",
          payload: {
            errorMessage: [],
            errorState: false,
          },
        });
      }, 2500);

      return false;
    }
  };

  const registerUser = async (username, email, password, confirmPassword) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/users/register",
        {
          username,
          email,
          password,
          confirm_password: confirmPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      localStorage.setItem("userLoggedIn", JSON.stringify(data.user));
      dispatch({
        type: "REGISTER_USER",
        payload: {
          user: data.user,
        },
      });

      return true;
    } catch (error) {
      console.log(error.response.data);

      const message = Array.isArray(error.response.data.error)
        ? error.response.data.error[0]
        : error.response.data.error;

      dispatch({
        type: "SET_ERROR_MODAL",
        payload: {
          errorMessage: message,
          errorState: true,
        },
      });

      setTimeout(() => {
        dispatch({
          type: "SET_ERROR_MODAL",
          payload: {
            errorMessage: [],
            errorState: false,
          },
        });
      }, 2500);

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
        // error values
        errorMessage: state.errorMessage,
        errorState: state.errorState,
        // user values
        loginUser: loginUser,
        logoutUser,
        updateUserProfilePicture,
        updateUserProfileInfo,
        updateProfilePassword,
        registerUser,
        users: state.users,
        userLoggedIn: state.userLoggedIn,
        // end user values
        // tale values
        tales: state.tales,
        purchased: state.purchased,
        published: state.published,
        singleDraftSelected: state.singleDraftSelected,
        getAllTales,
        getSingleTale,
        getAllPurchasedTales,
        getAllPublishedTales,
        isPurchasedorPublished,
        createTale,
        createDraft,
        deleteDraft,
        getSingleDraft,
        convertDraftToTale,
        updateDraft,
        getAllDraftedTales,
        getSingleTalePublished,
        getSingleTalePurchased,
        hasAccessToTale,
        getTaleByAccess,
        getAllGenres,
        filterTales,
        filterPublished,
        filterPurchased,
        filterDrafts,
        quickFilterTale,
        filteredTales: state.filteredTales,
        filteredPurchased: state.filteredPurchased,
        filteredPublished: state.filteredPublished,
        filteredDrafts: state.filteredDrafts,
        quickFilteredTales: state.quickFilteredTales,
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
