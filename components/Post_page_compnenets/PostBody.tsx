import React, { useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../../context/useAuth";
import { AiFillPlusCircle, AiOutlineUser } from "react-icons/ai";
import { format } from "date-fns";
import CommentElement from "../comments/Comment";
import { PostType, Comment } from "../../types";
import { useQuery } from "@tanstack/react-query";
import axios from "../../utils/axios";
import UserSkelton from "../modals/userSkelton";
type Props = {
  post: PostType;
  id: string;
};

const PostBody = ({ post, id }: Props) => {
  const { setPostID, setIsOpen, setComments, comments } = useAuth();
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      return await axios.get(`/comments/${id}`);
    },

    queryKey: ["comments"],
  });

  useEffect(() => {
    setComments(data?.data.comments);
  }, [isLoading]);

  return (
    <section className="col-span-12 md:col-span-11 lg:col-span-8   max-h-[90vh] overflow-y-scroll ">
      <div className="bg-white border text-sm  dark:bg-black dark:text-white rounded">
        <div className="w-full  ">
          {post?.cover && (
            <img
              src={post.cover}
              alt=""
              className="w-full rounded-t h-[300px]"
            />
          )}
        </div>
        <div className="flex items-end py-4 space-x-4 p-2 ">
          <div className="rounded-full w-[40px] h-[40px] bg-gray-100 dark:bg-blue-600 grid place-items-center ">
            {post?.author?.profile ? (
              <Image
                src={post?.author?.profile}
                alt=""
                className="rounded-full w-full h-full "
                height={40}
                width={40}
              />
            ) : (
              <AiOutlineUser size={20} />
            )}
          </div>
          <div className="flex flex-col  relative w-full ">
            <p className="text-[13px]  text-[#c8c8c8]">
              {post?.author?.firstName}
            </p>
            <p className="text-[13px]  text-[#c8c8c8]">{post?.author?.job}</p>
            <p className="absolute top-0 right-0 md:left-[30%] text-sm text-[#c8c8c8]">
              Posted at{" "}
              {post?.date
                ? format(new Date(post?.date), "dd/MM/yyyy")
                : "12/may/2022"}
            </p>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-wide text-[#171717] px-4 dark:text-white ">
            {post?.title}
          </h1>
          <section className="flex space-x-4  px-4 my-4 ">
            {post?.tags?.map((tag) => {
              return (
                <div
                  key={tag?.id}
                  className="grid place-items-center px-2 font-thin text-sm "
                >
                  {"#" + tag.body}
                </div>
              );
            })}
          </section>
          <article className="px-6 break-words py-8">
            <div
              dangerouslySetInnerHTML={{
                __html: post?.body,
              }}
              className="break-words"
            />
          </article>
        </div>
      </div>

      <section className=" bg-white dark:bg-black my-6 dark:text-white dark:border mt-4">
        <h1 className="ml-4 py-2">Comments</h1>
        {comments?.length === 0 ? (
          <section className="flex flex-col space-y-4">
            <div className="block ">
              <div
                className="flex flex-col space-y-2 items-center cursor-pointer"
                onClick={() => {
                  setIsOpen((v) => !v);
                  setPostID(post._id!);
                }}
              >
                <AiFillPlusCircle size={22} />
              </div>
            </div>
            <div className=" grid place-items-center text-xl font-mono font-bold">
              no comments
            </div>
          </section>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="block ">
              <div
                className="flex flex-col space-y-2 items-center cursor-pointer"
                onClick={() => {
                  setIsOpen((v) => !v);
                  setPostID(post._id!);
                }}
              >
                <AiFillPlusCircle size={22} />
              </div>
            </div>
            {!isLoading
              ? comments?.map((c: Comment, i: number) => {
                  return <CommentElement c={c} key={c._id} />;
                })
              : new Array(6).fill(null).map((item, i) => {
                  return <UserSkelton key={i} />;
                })}
          </div>
        )}
      </section>
    </section>
  );
};

export default PostBody;
