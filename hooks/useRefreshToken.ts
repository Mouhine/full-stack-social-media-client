import axios from "../utils/axios";
import { useAuth } from "../context/useAuth";
import { Auth } from "../types";

const useRefreshToken = () => {
  const { setAuth } = useAuth();


  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });
      setAuth((prev: Auth) => {
        const accessToken = response.data.accessToken;
        const userId = response.data.userId;
        return {
          ...prev,
          userId: userId,
          accessToken: accessToken,
        };
      });
      return response.data.accessToken;
    } catch (error) {}
  };
  return refresh;
};

export default useRefreshToken;
