import { createContext, useContext, useReducer } from "react";
import { userReducer, initialUserState } from "./UserReducer";
import axios from "axios";
import { useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

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
      localStorage.removeItem("purchasedTales");

      dispatch({
        type: "LOGOUT_USER",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        loginUser: loginUser,
        logoutUser,
        users: state.users,
        userLoggedIn: state.userLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within UserContext");
  }
  return { ...context };
};

export default UserContext;
