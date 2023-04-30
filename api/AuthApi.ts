//@ts-nocheck
import { UserType, credentials } from "../types";
import useLogout from "../hooks/useLogout";
import { useRouter } from "next/router";
import axios from "../utils/axios";
import { useAuth } from "../context/useAuth";

const useAuthFn = () => {
  const router = useRouter();
  const {
    setAuth,
    setIsLogin,
    setopenErrorLoginModal,
    setopenErrorRegisterModal,
    setMsg,
  } = useAuth();
  const logout = useLogout();
  const register = async (user: UserType) => {
    try {
      const response = await axios.post("/auth/signUp", user);
      setIsLogin(true);
      setAuth(response.data);

      router.push("/");
      return response;
    } catch (error) {
      if (error?.response?.status === 400) {
        setopenErrorRegisterModal(true);
        setMsg("This email is already exist");
      }
    }
  };
  const login = async (credentials: credentials) => {
    try {
      const response = await axios.post("/auth/login", credentials);
      setIsLogin(true);

      setAuth(response.data);

      router.push("/");
    } catch (error) {
      if (error.response.status === 401) {
        setopenErrorLoginModal(true);
        setMsg("please provide a valid email and password");
      }
    }
  };

  const signOut = async () => {
    await logout();
    router.push("/");
  };

  return {
    login,
    register,
    signOut,
  };
};

export default useAuthFn;
