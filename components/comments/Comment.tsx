import React, { useState } from "react";
import { AiFillCaretDown, AiFillCaretUp, AiFillHeart } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import useComment from "../../api/CommentsApi";
import { useAuth } from "../../context/useAuth";
import { Comment } from "../../types";
import { useMutation, QueryClient } from "@tanstack/react-query";
interface CommentsProps {
  c: Comment;
}
const CommentElement = ({ c }: CommentsProps) => {
  const { auth, setOpenLoginModal, deleteLocalComment, likeLocalComment } =
    useAuth();
  const { deleteComment, likeComment } = useComment();
  const [addCommentLike, setAddCommentLike] = useState(true);
  const queryClient = new QueryClient();
  const deleteCommentMutation = useMutation({
    mutationFn: (id: string) => {
      if (!auth.userId) {
        setOpenLoginModal(true);
        return Promise.reject("your not logged in");
      }
      return deleteComment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: (id: string) => {
      if (!auth.userId) {
        setOpenLoginModal(true);
        return Promise.reject("your not logged in");
      }
      return likeComment(id);
    },
  });

  console.log(c.likes);

  return (
    <div className="flex  items-start space-x-3  rounded px-2   ">
      <div className="border w-full p-2 rounded-lg mb-4 ">
        <section className="flex items-center space-x-3">
          <img
            src={c?.author?.profile}
            alt=""
            className="w-[30px] h-[30px] rounded-full "
          />
          <section>
            <p className="text-[#3b49de] text-sm font-medium ">
              {c?.author?.firstName + " " + c?.author?.lastName}
            </p>
          </section>
        </section>

        <div>
          <p className="break-all text-sm ml-4 mt-4 text-gray-400 font-mono ">
            {c?.body}
          </p>
        </div>

        <section className="flex justify-end space-x-6  items-center  w-full px-2">
          <div className="flex items-center  space-x-3   ">
            <button
              className="border-0 bg-none cursor-pointer hover:bg-[#3b49de] rounded-md"
              onClick={() => {
                // likeLocalComment(c._id!, addCommentLike);
                setAddCommentLike((prev) => !prev);
                likeCommentMutation.mutate(c._id!);
              }}
            >
              <AiFillCaretDown size={20} />
            </button>
            <span>{c.likes}</span>

            <button
              className="border-0 bg-none cursor-pointer hover:bg-[#3b49de] rounded-md "
              onClick={() => {
                likeLocalComment(c._id!, addCommentLike);
                setAddCommentLike((prev) => !prev);
                likeCommentMutation.mutate(c._id!);
              }}
            >
              <AiFillCaretUp size={20} />
            </button>
          </div>
          {c.author.id === auth.userId && (
            <div
              className="cursor-pointer hover:text-[#3b49de]"
              onClick={() => {
                deleteLocalComment(c._id!);
                deleteCommentMutation.mutate(c._id!);
              }}
            >
              <MdDelete size={20} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CommentElement;
