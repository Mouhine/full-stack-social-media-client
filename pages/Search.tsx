import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import axios from "../utils/axios";
import { PostType } from "../types";
import Post from "../components/Posts/post";
import { BeatLoader } from "react-spinners";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
const Search = () => {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState<PostType[] | []>([]);
  const axiosPrivate = useAxiosPrivate();

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      return await axios.post("/posts/search", { input });
    },
    queryKey: [input],
  });

  return (
    <div className="min-h-screen  flex flex-col items-center max-w-4xl w-[95%] mx-auto ">
      <div className="flex items-center relative dark:bg-black bg:text-white bg-white shadow rounded w-full justify-center p-4 ">
        <input
          type="text"
          placeholder="search"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          className="px-4 py-2 rounded border outline-none w-full "
        />
        <button
          // onClick={}
          className="absolute right-6 top-1/2 -translate-y-1/2 px-4 py-2 rounded bg-blue-400 "
        >
          <AiOutlineSearch size={20} />
        </button>
      </div>
      <div className="w-full min-h-screen flex items-start flex-wrap gap-4  bg-white dark:bg-black dark:text-white dark:border space-y-3 p-4  shadow rounded mt-4">
        {!isLoading ? (
          data?.data?.map((post: PostType, i: number) => {
            return (
              <article
                className="rounded border bg-white dark:bg-black dark:text-white  w-[100%] md:w-full mx-auto  shadow "
                key={post._id}
              >
                {/* author section */}
                {post.cover && (
                  <div className=" rounded col-span-2 h-[200px] object-cover w-full	">
                    <img
                      src={post.cover}
                      alt=""
                      className="w-full h-full rounded object-fill "
                    />
                  </div>
                )}
                <div className="p-4">
                  <section className="flex space-x-4 items-center  ">
                    <Link href={`/profile/${post.author.id}`}>
                      <div className="rounded-full w-[30px] h-[30px] dark:bg-blue-600 bg-gray-100 grid place-items-center ">
                        {post.author.profile ? (
                          <Image
                            src={post.author.profile}
                            alt=""
                            className="rounded-full w-full h-full"
                            height={40}
                            width={40}
                          />
                        ) : (
                          <AiOutlineUser size={24} />
                        )}
                      </div>
                    </Link>
                    <div className="flex  items-start justify-between relative w-full  ">
                      <div className="flex flex-col ">
                        <p className="text-[12px] font-bold text-[#c8c8c8]">
                          {post.author.firstName}
                        </p>
                        <p className="text-[12px] font-bold text-[#c8c8c8]">
                          {post.author.job}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className=" text-[12px] text-[#c8c8c8]">
                          {format(new Date(post.date), "MM/dd/yyyy")}
                        </p>
                      </div>
                    </div>
                  </section>
                  {/* body section */}
                  <section className=" mb-2 px-6">
                    <div className="flex flex-col col-span-3 ">
                      <Link href={`/post/${post._id}`}>
                        <h1 className=" text-lg font-bold dark:text-white my-2 text-[#101010]  ">
                          {post.title}
                        </h1>
                      </Link>
                    </div>
                  </section>
                  {/* tags section */}
                  <section className="flex space-x-4  px-6">
                    {post.tags.map((tag) => {
                      return (
                        <div
                          key={tag.id}
                          className="grid place-items-center px-2 font-thin text-[10px]"
                        >
                          {"#" + tag.body}
                        </div>
                      );
                    })}
                  </section>
                </div>
              </article>
            );
          })
        ) : (
          <div className="w-full h-full grid place-content-center">
            <BeatLoader />
          </div>
        )}
        {data?.data?.length === 0 && (
          <div className="w-full h-full grid place-content-center">
            <p className="text-gray font-lg font-mono  font-medium">
              No result{" "}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
