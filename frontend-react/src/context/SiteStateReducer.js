export const initialState = {
  authModalType: "register",
  authModalOpen: false,
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
    default:
      console.log("default");
      return state;
  }
};

export default siteStateReducer;
