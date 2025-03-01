import { createContext, useReducer, useEffect } from "react";
import siteStateReducer, { initialState } from "./SiteStateReducer";
import { useContext } from "react";
import axios from "axios";

const SiteStateContext = createContext();

export const SiteStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(siteStateReducer, initialState);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  // const backendUrl = "http://localhost:8000";

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

  const openAuthModalForgotPassword = () => {
    try {
      dispatch({
        type: "OPEN_AUTH_MODAL_FORGOT_PASSWORD",
        payload: {
          authModalType: "forgot_password",
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
    const wishlistedTales = localStorage.getItem("wishlist");
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
    if (wishlistedTales) {
      dispatch({
        type: "GET_ALL_WISHLISTED_TALES",
        payload: {
          wishlist: JSON.parse(wishlistedTales),
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

  // subscribe newsletter
  // get all tales to show for everyone (unauthorized)
  const SubscribeNewsletter = async (email) => {
    try {
      const { data } = await axios.post(`${backendUrl}/newsletter/subscribe`, {
        email,
      });

      const message = data.message;
      triggerSuccessDispatch(message);
    } catch (error) {
      console.log(error.response.data);

      const message = error.response.data.error;
      triggerErrorDispatch(message);
    }
  };

  // get all tales to show for everyone (unauthorized)
  const getAllTales = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/tales/get_tales`);

      if (data.tales != null) {
        dispatch({
          type: "GET_ALL_TALES",
          payload: {
            tales: data.tales,
          },
        });
      } else {
        dispatch({
          type: "GET_ALL_TALES",
          payload: {
            tales: [],
          },
        });
      }

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
      const { data } = await axios.get(`${backendUrl}/tales/get_tales/${id}`);
      return { tale: data.tale, view: "unauthorized" };
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  //  get single tale published
  const getSingleTalePublished = async (id) => {
    try {
      const { data } = await axios.get(`${backendUrl}/tales/published/${id}`, {
        withCredentials: true,
      });

      console.log(data);
      return { tale: data.tale, view: "published" };
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // get single tale purchased
  const getSingleTalePurchased = async (id) => {
    try {
      const { data } = await axios.get(`${backendUrl}/tales/purchased/${id}`, {
        withCredentials: true,
      });
      return { tale: data.tale, view: "purchased" };
    } catch (error) {}
  };

  // create tale
  const createTale = async (formData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/tales/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      dispatch({
        type: "CREATE_TALE",
        payload: {
          tale: data.tale,
        },
      });

      const message = data.message;
      triggerSuccessDispatch(message);

      return data.tale;
    } catch (error) {
      console.log(error.response.data);

      const message = Array.isArray(error.response.data.error)
        ? error.response.data.error[0]
        : error.response.data.error;
      triggerErrorDispatch(message);

      return false;
    }
  };

  // convert draft to tale
  const convertDraftToTale = async (formData, draftID) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/tales/convert_draft_to_tale/${draftID}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      dispatch({
        type: "CREATE_TALE_DELETE_DRAFT",
        payload: {
          tale: data.tale,
          draftID: draftID,
        },
      });

      const message = data.message;
      triggerSuccessDispatch(message);

      return data.tale;
    } catch (error) {
      console.log(error.response.data);

      const message = Array.isArray(error.response.data.error)
        ? error.response.data.error[0]
        : error.response.data.error;
      triggerErrorDispatch(message);

      return false;
    }
  };

  // create draft
  const createDraft = async (formData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/tales/create_draft`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      dispatch({
        type: "CREATE_DRAFT",
        payload: {
          draft: data.draft,
        },
      });

      const message = data.message;
      triggerSuccessDispatch(message);

      return data.draft;
    } catch (error) {
      const message = error.response.data.error;
      triggerErrorDispatch(message);
    }
  };

  //Update draft
  const updateDraft = async (formData, draftID) => {
    try {
      const { data } = await axios.put(`${backendUrl}/tales/update_draft/${draftID}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      console.log(data.message);

      dispatch({
        type: "UPDATE_DRAFT",
        payload: {
          draft: data.draft,
          draftID: draftID,
        },
      });

      const message = data.message;
      triggerSuccessDispatch(message);

      return data.draft;
    } catch (error) {
      const message = error.response.data.error;
      triggerErrorDispatch(message);
    }
  };

  //Delete draft
  const deleteDraft = async (draftID) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/tales/delete_draft/${draftID}`, {
        withCredentials: true,
      });

      dispatch({
        type: "DELETE_DRAFT",
        payload: {
          draft: data.draft,
          draftID: draftID,
        },
      });

      const message = data.message;
      triggerSuccessDispatch(message);

      return data.draft;
    } catch (error) {
      const message = error.response.data.error;
      triggerErrorDispatch(message);
    }
  };

  const getSingleDraft = async (id) => {
    const { data } = await axios.get(`${backendUrl}/tales/get_single_draft/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    try {
      dispatch({
        type: "GET_SINGLE_DRAFT",
        payload: {
          singleDraftSelected: data.draft,
        },
      });

      return data.draft;

      // localStorage.setItem("singleDraftSelected", JSON.stringify(draft));
    } catch (error) {}
  };

  // get all the purhcased tales for a logged user
  const getAllPurchasedTales = async () => {
    try {
      const { data: purchasedTales } = await axios.get(`${backendUrl}/tales/get_all_purchased`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

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

  // get all the purhcased tales for a logged user
  const getAllWishlistedTales = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/tales/get_all_wishlisted`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      localStorage.setItem("wishlist", JSON.stringify([...data.tales]));

      dispatch({
        type: "GET_ALL_WISHLISTED_TALES",
        payload: {
          wishlist: [...data.tales],
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  //add tale to wishlist
  const addTaleToWishlist = async (tale_id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/tales/add_to_wishlist/${tale_id}`, null, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      dispatch({
        type: "ADD_TALE_TO_WISHLIST",
        payload: {
          tale: data.tale,
        },
      });

      const message = data.message;
      triggerSuccessDispatch(message);

      return true;
    } catch (error) {
      console.log(error.response.data);
      const message = error.response.data.error;
      triggerErrorDispatch(message);

      return false;
    }
  };

  //remove tale to wishlist
  const removeTaleFromWishlist = async (tale_id) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/tales/delete_tale_from_wishlist/${tale_id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch({
        type: "REMOVE_TALE_FROM_WISHLIST",
        payload: {
          taleID: data.removed_tale_id,
        },
      });

      const message = data.message;
      triggerSuccessDispatch(message);

      return true;
    } catch (error) {
      const message = error.response.data.error;
      triggerErrorDispatch(message);

      return false;
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

  //purchase tale
  const purchaseTaleById = async (tale_id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/tales/purchase/${tale_id}`, null, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const purchasedTale = await getSingleTalePurchased(tale_id);

      dispatch({
        type: "PURCHASE_TALE",
        payload: {
          tale: purchasedTale.tale,
          balance: data.balance,
        },
      });

      const message = data.message;
      triggerSuccessDispatch(message);

      return true;
    } catch (error) {
      console.log(error.response.data);
      const message = error.response.data.error;
      triggerErrorDispatch(message);

      return false;
    }
  };

  const archiveTale = async (tale_id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/tales/soft_delete/${tale_id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const message = data.message;
      triggerSuccessDispatch(message);

      return true;
    } catch (error) {
      const message = error.response.data.error;
      triggerErrorDispatch(message);

      return false;
    }
  };

  const activateTale = async (tale_id) => {
    try {
      const { data } = await axios.put(`${backendUrl}/tales/activate_tale/${tale_id}`, null, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const message = data.message;
      triggerSuccessDispatch(message);

      return true;
    } catch (error) {
      const message = error.response.data.error;
      triggerErrorDispatch(message);

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
      const { data: publishedTales } = await axios.get(`${backendUrl}/tales/get_all_published`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

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
      const { data } = await axios.get(`${backendUrl}/tales/get_all_drafts`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      localStorage.setItem("drafts", JSON.stringify(data.drafts));

      dispatch({
        type: "GET_ALL_DRAFTED_TALES",
        payload: {
          drafts: data.drafts,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllGenres = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/tales/get_genres`);

      return data.genres;
    } catch (error) {
      console.log(error);
    }
  };

  const submitRating = async (tale_id, rating) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/tales/submit_rating/${tale_id}`,
        { rating },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const message = data.message;
      triggerSuccessDispatch(message);

      return true;
    } catch (error) {
      const message = error.response.data.error;
      triggerErrorDispatch(message);

      return false;
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
        `${backendUrl}/users/login`,
        {
          username: email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(data);

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
      getAllWishlistedTales();

      return true;
    } catch (error) {
      console.log(error);

      const message = Array.isArray(error.response.data.error)
        ? error.response.data.error[0]
        : error.response.data.error;
      triggerErrorDispatch(message);

      return false;
    }
  };

  const registerUser = async (username, email, password, confirmPassword) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/users/register`,
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
      const message = Array.isArray(error.response.data.error)
        ? error.response.data.error[0]
        : error.response.data.error;

      triggerErrorDispatch(message);

      return false;
    }
  };

  // logout user
  const logoutUser = async () => {
    try {
      const { data } = axios.post(`${backendUrl}/users/logout`, {}, { withCredentials: true });
      console.log(data);

      localStorage.removeItem("userLoggedIn");
      localStorage.removeItem("purchased");
      localStorage.removeItem("drafts");
      localStorage.removeItem("published");
      localStorage.removeItem("wishlist");

      dispatch({
        type: "LOGOUT_USER",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // delete user
  const deleteUserAccount = async () => {
    try {
      const { data } = await axios.delete(`${backendUrl}/users/soft_delete`, {
        withCredentials: true,
      });

      if (data.success) {
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("purchased");
        localStorage.removeItem("drafts");
        localStorage.removeItem("published");
        localStorage.removeItem("wishlist");
      }

      return data.success;
    } catch (error) {
      const message = error.response.data.error;
      triggerSuccessDispatch(message);
    }
  };

  const updateUserProfilePicture = async (file, id) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.put(
        `${backendUrl}/users/update_profile_picture/${id}`,
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

      const message = data.message;
      triggerSuccessDispatch(message);
    } catch (error) {
      const message = error.response.data.error;
      triggerSuccessDispatch(message);
    }
  };

  const updateUserProfileInfo = async (id, KeyAndValue) => {
    try {
      const { data } = await axios.put(`${backendUrl}/users/update_info/${id}`, KeyAndValue, {
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

      const message = data.message;
      triggerSuccessDispatch(message);

      let userInLocalStorage = localStorage.getItem("userLoggedIn");
      userInLocalStorage = JSON.parse(userInLocalStorage);
      userInLocalStorage[key] = KeyAndValue[key];
      localStorage.setItem("userLoggedIn", JSON.stringify(userInLocalStorage));
      return true;
    } catch (error) {
      const message = error.response.data.error;
      triggerErrorDispatch(message);
    }
    return false;
  };

  const updateProfilePassword = async (id, passwordData) => {
    try {
      const { data } = await axios.put(`${backendUrl}/users/update_password/${id}`, passwordData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const message = data.message;
      triggerSuccessDispatch(message);

      return true;
    } catch (error) {
      const message = error.response.data.error;
      triggerErrorDispatch(message);
    }
    return false;
  };

  const sendResetPasswordLink = async (email) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/users/request-password-reset`,
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const message = data.message;
      triggerSuccessDispatch(message);

      return true;
    } catch (error) {
      console.log(error);
      const message = error.response.data.error;

      triggerErrorDispatch(message);
    }

    return false;
  };

  const resetPassword = async (newPassword, confirmNewPassword, token) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/users/reset-password?token=${token}`,
        {
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const message = data.message;
      triggerSuccessDispatch(message);

      return true;
    } catch (error) {
      console.log(error);
      const message = error.response.data.error;
      triggerErrorDispatch(message);
    }

    return false;
  };

  const alreadyLoggedInModal = () => {
    const message = "Already Logged In";
    triggerErrorDispatch(message);
  };

  // END USER CONTEXT

  // UTILS

  const triggerSuccessDispatch = (message) => {
    dispatch({
      type: "SET_SUCCESS_MODAL",
      payload: {
        successMessage: message,
        successState: true,
      },
    });

    setTimeout(() => {
      dispatch({
        type: "SET_SUCCESS_MODAL",
        payload: {
          successMessage: [],
          successState: false,
        },
      });
    }, 2500);
  };

  const triggerErrorDispatch = (message) => {
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
  };

  return (
    <SiteStateContext.Provider
      value={{
        authModalType: state.authModalType,
        authModalOpen: state.authModalOpen,
        openAuthModalRegister,
        openAuthModalLogin,
        openAuthModalForgotPassword,
        closeAuthModal,
        alreadyLoggedInModal,
        // error values
        errorMessage: state.errorMessage,
        errorState: state.errorState,
        successMessage: state.successMessage,
        successState: state.successState,
        // user values
        SubscribeNewsletter,
        loginUser: loginUser,
        logoutUser,
        updateUserProfilePicture,
        updateUserProfileInfo,
        updateProfilePassword,
        resetPassword,
        sendResetPasswordLink,
        registerUser,
        deleteUserAccount,
        users: state.users,
        userLoggedIn: state.userLoggedIn,
        // end user values
        // tale values
        tales: state.tales,
        purchased: state.purchased,
        published: state.published,
        wishlist: state.wishlist,
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
        getAllWishlistedTales,
        addTaleToWishlist,
        removeTaleFromWishlist,
        getSingleTalePublished,
        getSingleTalePurchased,
        purchaseTaleById,
        hasAccessToTale,
        getTaleByAccess,
        getAllGenres,
        filterTales,
        quickFilterTale,
        archiveTale,
        activateTale,
        submitRating,
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
