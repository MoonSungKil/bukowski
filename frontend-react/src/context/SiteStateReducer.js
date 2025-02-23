export const initialState = {
  authModalType: "register",
  authModalOpen: false,

  //error values
  errorMessage: "",
  errorState: false,

  //success values
  successMessage: "",
  successState: false,

  //tale values
  tales: [],
  filteredTales: [],
  quickFilteredTales: [],
  singleTaleSelected: {},
  singleDraftSelected: {},
  purchased: [],
  published: [],
  wishlist: [],
  drafts: [],
  selectedTalePurchased: {},
  //end tale values

  //user values
  users: [],
  userLoggedIn: {},
  //end user values
};

export const siteStateReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "OPEN_AUTH_MODAL_REGISTER":
      return {
        ...state,
        authModalType: payload.authModalType,
        authModalOpen: true,
      };
    case "OPEN_AUTH_MODAL_LOGIN":
      return {
        ...state,
        authModalType: payload.authModalType,
        authModalOpen: true,
      };
    case "OPEN_AUTH_MODAL_FORGOT_PASSWORD":
      return {
        ...state,
        authModalType: payload.authModalType,
        authModalOpen: true,
      };
    case "CLOSE_AUTH_MODAL":
      return {
        ...state,
        authModalOpen: false,
      };

    // Error Modal
    case "SET_ERROR_MODAL":
      return {
        ...state,
        errorMessage: payload.errorMessage,
        errorState: payload.errorState,
      };

    // Success Modal
    case "SET_SUCCESS_MODAL":
      return {
        ...state,
        successMessage: payload.successMessage,
        successState: payload.successState,
      };

    // Tale Reducers
    case "GET_ALL_TALES":
      return {
        ...state,
        tales: payload.tales,
        filteredTales: payload.tales,
      };
    case "FILTER_TALES":
      let filtered = [...state.tales];
      if (payload.keyword !== "") {
        filtered = filtered.filter(
          (tale) =>
            tale.title.toLowerCase().includes(payload.keyword.toLowerCase()) ||
            tale.author.toLowerCase().includes(payload.keyword.toLowerCase())
        );
      }
      if (payload.genres.length > 0) {
        filtered = filtered.filter((tale) =>
          tale.genres.some((genre) => payload.genres.includes(genre.name))
        );
      }
      return {
        ...state,
        filteredTales: filtered,
      };
    case "QUICK_FILTER_TALE":
      if (payload.keyword === "") {
        return {
          ...state,
          quickFilteredTales: [],
        };
      } else {
        let quickFilter = state.tales.filter((tale) =>
          tale.title.toLowerCase().includes(payload.keyword.toLowerCase())
        );
        return {
          ...state,
          quickFilteredTales: quickFilter.slice(0, 3),
        };
      }
    case "CREATE_TALE":
      localStorage.setItem("published", JSON.stringify([...state.published, payload.tale]));
      return {
        ...state,
        tales: [...state.tales, payload.tale],
        published: [...state.published, payload.tale],
      };
    case "CREATE_DRAFT":
      localStorage.setItem("drafts", JSON.stringify([...state.drafts, payload.draft]));
      return {
        ...state,
        drafts: [...state.drafts, payload.draft],
      };
    case "CREATE_TALE_DELETE_DRAFT":
      localStorage.setItem("published", JSON.stringify([...state.published, payload.tale]));
      localStorage.setItem(
        "drafts",
        JSON.stringify(state.drafts.filter((draft) => +draft.ID !== +payload.draftID))
      );
      return {
        ...state,
        published: [...state.published, payload.tale],
        drafts: state.drafts.filter((draft) => +draft.ID !== +payload.draftID),
      };
    case "UPDATE_DRAFT":
      localStorage.setItem(
        "drafts",
        JSON.stringify([
          ...state.drafts.filter((draft) => +draft.ID !== +payload.draftID),
          payload.draft,
        ])
      );
      return {
        ...state,
        drafts: [...state.drafts.filter((draft) => +draft.ID !== +payload.draftID), payload.draft],
      };
    case "DELETE_DRAFT":
      localStorage.setItem(
        "drafts",
        JSON.stringify([...state.drafts.filter((draft) => +draft.ID !== +payload.draftID)])
      );
      return {
        ...state,
        drafts: [...state.drafts.filter((draft) => +draft.ID !== +payload.draftID)],
      };
    case "REMOVE_TALE_FROM_WISHLIST":
      localStorage.setItem(
        "wishlist",
        JSON.stringify([...state.wishlist.filter((tale) => +tale.ID !== +payload.taleID)])
      );
      return {
        ...state,
        wishlist: [...state.wishlist.filter((tale) => +tale.ID !== +payload.taleID)],
      };
    case "GET_SINGLE_TALE":
      return {
        ...state,
        singleTaleSelected: payload.singleTaleSelected,
      };
    case "PURCHASE_TALE":
      const modifiedUser = { ...state.userLoggedIn, balance: payload.balance };
      localStorage.setItem("userLoggedIn", JSON.stringify(modifiedUser));
      localStorage.setItem("purchased", JSON.stringify([...state.purchased, payload.tale]));
      localStorage.setItem(
        "wishlist",
        JSON.stringify([...state.wishlist.filter((tale) => tale.ID !== payload.tale.ID)])
      );
      return {
        ...state,
        purchased: [...state.purchased, payload.tale],
        wishlist: [...state.wishlist.filter((tale) => tale.ID !== payload.tale.ID)],
        userLoggedIn: modifiedUser,
      };
    case "ADD_TALE_TO_WISHLIST":
      localStorage.setItem("wishlist", JSON.stringify([...state.wishlist, payload.tale]));
      return {
        ...state,
        wishlist: [...state.wishlist, payload.tale],
      };
    case "GET_SINGLE_DRAFT":
      return {
        ...state,
        singleDraftSelected: payload.singleDraftSelected,
      };
    case "GET_ALL_PURCHASED_TALES":
      return {
        ...state,
        purchased: [...payload.purchased],
      };
    case "GET_ALL_WISHLISTED_TALES":
      return {
        ...state,
        wishlist: [...payload.wishlist],
      };
    case "GET_ALL_PUBLISHED_TALES":
      return {
        ...state,
        published: [...payload.published],
      };
    case "GET_ALL_DRAFTED_TALES":
      return {
        ...state,
        drafts: [...payload.drafts],
      };

    // End Tale Reducers

    // User Reducers
    case "LOGIN_USER":
      return {
        ...state,
        userLoggedIn: payload.user,
      };

    case "REGISTER_USER":
      return {
        ...state,
        userLoggedIn: payload.user,
      };

    case "LOGOUT_USER":
      return {
        ...state,
        userLoggedIn: {},
        singleTaleSelected: {},
        purchased: [],
        wishlist: [],
        published: [],
        selectedTalePurchased: {},
      };

    case "UPDATE_PROFILE_PICTURE":
      return {
        ...state,
        userLoggedIn: {
          ...state.userLoggedIn,
          profile_picture: payload.profilePicture,
        },
      };

    case "UPDATE_PROFILE_INFO":
      return {
        ...state,
        userLoggedIn: {
          ...state.userLoggedIn,
          [payload.key]: payload.value,
        },
      };

    // End User Reducers

    default:
      return state;
  }
};

export default siteStateReducer;
