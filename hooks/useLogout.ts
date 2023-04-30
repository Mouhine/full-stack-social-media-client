import useAxiosPrivate from "./useAxiosPrivate";
import { useAuth } from "../context/useAuth";
import { Auth } from "../types";
const useLogout = () => {
  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const logout = async () => {
    setAuth({} as Auth);
    try {
      const response = await axiosPrivate.get("auth/logout");
    } catch (err) {}
  };

  return logout;
};

export default useLogout;
