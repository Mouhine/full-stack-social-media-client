import React, { use, useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { PostType, UserType } from "../types";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { format, compareAsc } from "date-fns";
import { AiOutlineDelete } from "react-icons/ai";
import usePost from "../api/PostApi";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
interface ReadinglistProps {
  readingList: PostType[];
  user: UserType;
}
const ReadingList = ({ user }: ReadinglistProps) => {
  const IMAGE_BACKUP =
    "https://cdn.pixabay.com/photo/2016/11/01/18/38/background-1789175_960_720.png";

  const { auth, unsaveLocalPost, readingList } = useAuth();
  const { unSavePost } = usePost();
  if (readingList?.length === 0) {
    return (
      <div className="py-4 grid place-content-center bg-white max-w-3xl py-8 shadow w-[95%] mx-auto mt-8 ">
        <h1 className="text-blue-500 underline ">Your reading List is empty</h1>
      </div>
    );
  }

  const handleUnsavePost = async (id: string, userId: string, filter: Date) => {
    unsaveLocalPost(id);
    await unSavePost(userId, filter);
  };

  return (
    <div
      className={`p-4 bg-white border dark:bg-black  dar:text-white max-w-3xl mt-8  mx-auto space-y-2  rounded ${
        user?.reading_list?.length === 0 && "hidden"
      } `}
    >
      <h1 className="text-xl font-bold tracking-wide">Your reading list</h1>
      {readingList?.map((post) => {
        return (
          <div
            className="flex items-start gap-2 relative py-3 border px-2 rounded-md "
            key={uuid()}
          >
            {post?.cover && (
              <section className="h-[100px] w-[300px] rounded ">
                <img
                  src={post?.cover || IMAGE_BACKUP}
                  alt=""
                  className="w-full h-full rounded object-fill "
                />
              </section>
            )}
            {!post.cover && (
              <section className="h-[100px] w-[300px] rounded ">
                <img
                  src={IMAGE_BACKUP}
                  alt=""
                  className="w-full h-full rounded object-fill "
                />
              </section>
            )}
            <section className="space-y-2 w-full">
              <div className="flex w-full justify-between items-center">
                <Link href={`/post/${post._id}`}>
                  <h1 className=" w-[70%]   ">{post?.title}</h1>
                </Link>
                <div className="flex items-center space-x-3 absolute right-2 top-2 ">
                  <p className=" text-[13 px] text-[#c8c8c8]">
                    {format(new Date(post.date), "MM/dd/yyyy")}
                  </p>
                  <button
                    onClick={() => {
                      handleUnsavePost(post._id!, auth.userId, post.date);
                    }}
                  >
                    <AiOutlineDelete className="cursor-pointer" size={18} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
};

export default ReadingList;
