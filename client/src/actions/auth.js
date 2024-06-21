import * as api from "../api";
import { setCurrentUser } from "./currentUser";
import { fetchAllUsers } from "./users";
import { ToastContainer, toast } from 'react-toastify';

export const signup = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(authData); 
    dispatch({ type: "AUTH", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    dispatch(fetchAllUsers());
    navigate("/");
    toast.success("Signup Successfull");

  } catch (error) {
    console.log(error);
  }
};

export const login = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.logIn(authData);
    dispatch({ type: "AUTH", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    navigate("/");
    window.location.reload();
    toast.success("Login Successfull");

  } catch (error) {
    console.log(error);
    toast.error("Wrong Credentials");

  }
};
