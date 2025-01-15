export const initialState = {
  authModalType: "register",
  authModalOpen: false,

  //tale values
  tales: [],
  singleTaleSelected: {},
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

    // Tale Reducers
    case "GET_ALL_TALES":
      return {
        ...state,
        tales: payload.tales,
      };
    case "GET_SINGLE_TALE":
      return {
        ...state,
        singleTaleSelected: payload.singleTaleSelected,
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
