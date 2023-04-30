import { AxiosInstance } from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Comment } from "../types";

const useComment = () => {
  const axiosPrivate = useAxiosPrivate();
  const addComment = async (comment: Comment) => {
    try {
      const response = await axiosPrivate.post(
        `/comments/${comment.belong_to}`,
        comment
      );
    } catch (error) {}
  };

  const deleteComment = async (id: string) => {
    try {
      return await axiosPrivate.delete(`/comments/${id}`);
    } catch (error) {}
  };
  const likeComment = async (id: string) => {
    try {
      return await axiosPrivate.patch(`/comments/${id}/like`, { id: id });
    } catch (error) {}
  };
  const deslikeComment = async (id: string) => {
    try {
      return await axiosPrivate.patch(`/comments/${id}/dislike`, { id: id });
    } catch (error) {}
  };

  return {
    addComment,
    deleteComment,
    likeComment,
    deslikeComment,
  };
};

export default useComment;
