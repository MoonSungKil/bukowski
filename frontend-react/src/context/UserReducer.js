export const initialUserState = {
  users: [],
  userLoggedIn: {},
};

export const userReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "LOGIN_USER":
      return {
        ...state,
        userLoggedIn: payload.user,
      };

    case "LOGOUT_USER":
      return {
        ...state,
        userLoggedIn: {},
      };
    default:
      console.log("default");
      return state;
  }
};

export default userReducer;
