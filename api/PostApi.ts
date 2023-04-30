import { AxiosInstance } from "axios";
import { PostType, ReadingListItem } from "../types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useMutation , useQuery } from "@tanstack/react-query";
import axios from "../utils/axios";

const usePost = () => {
  const axiosPrivate = useAxiosPrivate();
  const addPost = async (post: PostType) => {
    await axiosPrivate.post("/posts", post);
  };

  const deletePost = async (id: string) => {
    try {
      await axiosPrivate.delete(`/posts/${id}`);
    } catch (error) {}
  };

   
  

  const likePost = async (id: string, userId: string) => {
    try {
      await axiosPrivate.patch(`/posts/${id}`, { userId });
    } catch (error) {}
  };

  const deslikePost = async (id: string, userId: string) => {
    try {
      await axiosPrivate.patch(`/posts/${id}/deslike`, { userId });
    } catch (error) {}
  };

  const savePost = async (userId: string, post: ReadingListItem) => {
    try {
      await axiosPrivate.post(`/users/${userId}`, post);
    } catch (error) {}
  };

  const unSavePost = async (userId: string, filter: Date) => {
    try {
     return  await axiosPrivate.delete(`/users/readingList/${userId}`, {
        data: { filter },
      });
    } catch (error) {}
  };

  const isLikedByMe = async (postId: string, userId: string) => {
    try {
      const response = await axiosPrivate.post("/posts/islikedbyme", {
        postId,
        userId,
      });
      return response.data.likedByMe;
    } catch (error) {}
  };

  return {
    addPost,
    likePost,
    deslikePost,
    deletePost,
    savePost,
    unSavePost,
    isLikedByMe,
  };
};
export const getPosts = () =>{
  const BaseURL = process.env.NEXT_PUBLIC_SERVICE_URI;
    return axios.get(`${BaseURL}/posts`);
  }
export default usePost;
