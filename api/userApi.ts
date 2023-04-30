import { AxiosInstance } from "axios";
import { Follower } from "../types";
import { UserType } from "../types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../utils/axios";

const useUser = () => {
  const axiosPrivate = useAxiosPrivate();

  const followUser = async (id: string, follower: Follower) => {
    try {
      return await axiosPrivate.post(`/users/${id}/follow`, follower);
    } catch (error) {}
  };

  const unfollowUser = async (id: string, followerId: string) => {
    try {
      return await axiosPrivate.post(`/users/${id}/unfollow`, {
        id,
        followerId,
      });
    } catch (error) {}
  };

  const updateUser = async (id: string, updateInfo: UserType) => {
    try {
      return await axiosPrivate.put(`/users/${id}`, updateInfo);
    } catch (error) {}
  };

  const deleteUser = async (userId: string) => {
    return await axiosPrivate.delete(`/users/${userId}`);
  };

  const getUsers = async () => {
    return await axios.get(`/users`);
  };

  return {
    deleteUser,
    followUser,
    unfollowUser,
    updateUser,
    getUsers,
  };
};

export default useUser;
