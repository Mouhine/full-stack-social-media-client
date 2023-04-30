import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import { useAuth } from "../../context/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import axios from "../../utils/axios";
import { Comment } from "../../types";
import useComment from "../../api/CommentsApi";
import CommentElement from "./Comment";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface commentProps {
  id: string;
}
const Comments = ({ id }: commentProps) => {
  const { addComment } = useComment();
  const {
    auth,
    setIsOpen,
    setOpenLoginModal,
    addLocalComment,
    setComments,
    comments,
  } = useAuth();
  const [comment, setComment] = useState("");

  const axiosPrivate = useAxiosPrivate();

  const queryClient = new QueryClient();

  const { data: Comments, isLoading } = useQuery({
    queryFn: async () => {
      return await axios.get(`/comments/${id}`);
    },
    queryKey: ["comments"],
  });

  useEffect(() => {
    setComments(Comments?.data.comments);
  }, [isLoading]);

  const { data: User } = useQuery({
    queryFn: async () => {
      return await axiosPrivate.get(`/users/${auth.userId}`);
    },
  });

  console.log(User?.data, "this is user");

  const commentBody = {
    body: comment,
    author: {
      id: auth?.userId,
      profile: User?.data?.user[0]?.profile as string,
      firstName: User?.data?.user[0]?.firstName,
      lastName: User?.data?.user[0]?.lastName,
    },
    belong_to: id,
    likes: 0,
  };

  const addCommentMutation = useMutation({
    mutationFn: () => {
      if (!auth.userId) {
        setOpenLoginModal(true);
        return Promise.reject("your not logged in");
      }
      if (!comment) {
        toast.warn("write something to comment");
      }
      return addComment(commentBody);
    },

    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  return (
    <div className="fixed z-10 inset-0 w-full h-[100vh] backdrop-blur grid place-items-center overflow-hidden   ">
      <div className="max-w-3xl w-[90%] h-[400px] dark:bg-black dark:text-white border bg-white shadow p-2 break-normal relative overflow-y-scroll ">
        <div className="relative flex items-center justify-center ">
          <button
            className="absolute  z-20 top-4 left-4 rounded-full w-8 h-8 grid place-content-center bg-[#3b49de] text-white "
            onClick={() => setIsOpen((v) => !v)}
          >
            <AiOutlineClose />
          </button>
          <h1 className=" text-gray-300 font-medium mt-4 text-2xl ">
            Comments
          </h1>
        </div>
        <section className="w-full py-2 mt-6 flex items-center justify-between gap-3 border rounded px-3">
          <textarea
            className="py-2 px-3 w-full border outline-none rounded "
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder="join the discussion ..."
          />
          <button
            className="px-2 border py-2 rounded-full border-emerald-700"
            onClick={() => {
              addLocalComment(commentBody);
              addCommentMutation.mutate();
            }}
          >
            <BiSend size={18} />
          </button>
        </section>

        <section className=" mt-2 ">
          {comments?.length === 0 ? (
            <div className="h-[400px] grid place-items-center  w-full text-xl font-mono -font-bold">
              no comments
            </div>
          ) : (
            comments?.map((c: Comment, i: number) => {
              return <CommentElement key={i} c={c} />;
            })
          )}
        </section>
      </div>
    </div>
  );
};

export default Comments;
