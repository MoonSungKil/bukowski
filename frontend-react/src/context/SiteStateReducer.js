export const initialState = {
  authModalType: "register",
  authModalOpen: false,

  //error values
  errorMessage: "",
  errorState: false,

  //tale values
  tales: [],
  singleTaleSelected: {},
  singleDraftSelected: {},
  purchased: [],
  published: [],
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
      console.log("OPEN_AUTH_MODAL_REGISTER");
      return {
        ...state,
        authModalType: payload.authModalType,
        authModalOpen: true,
      };
    case "OPEN_AUTH_MODAL_LOGIN":
      console.log("OPEN_AUTH_MODAL_LOGIN");
      return {
        ...state,
        authModalType: payload.authModalType,
        authModalOpen: true,
      };
    case "CLOSE_AUTH_MODAL":
      console.log("OPEN_AUTH_MODAL_LOGIN");
      return {
        ...state,
        authModalOpen: false,
      };

    // Error Modal
    case "SET_ERROR_MODAL":
      console.log("SET_ERROR_MODAL");
      return {
        ...state,
        errorMessage: payload.errorMessage,
        errorState: payload.errorState,
      };

    // Tale Reducers
    case "GET_ALL_TALES":
      return {
        ...state,
        tales: payload.tales,
      };
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
    case "GET_SINGLE_TALE":
      return {
        ...state,
        singleTaleSelected: payload.singleTaleSelected,
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
      console.log([payload.key], payload.key);
      return {
        ...state,
        userLoggedIn: {
          ...state.userLoggedIn,
          [payload.key]: payload.value,
        },
      };

    // End User Reducers

    default:
      console.log("default");
      return state;
  }
};

export default siteStateReducer;
