import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { UserType } from "../../types";
import { AiOutlineUser } from "react-icons/ai";
import { format } from "date-fns";
import { GetServerSidePropsContext } from "next";
import { useQuery } from "@tanstack/react-query";
const UserSection = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const getUser = async () => {
    try {
      return await axiosPrivate.get(`/users/${auth.userId}`);
    } catch (error) {}
  };

  const { data, isLoading } = useQuery({
    queryFn: getUser,
  });
  return (
    <section className=" md:col-span-4 lg:col-span-3 hidden md:block  mb-4 ">
      <section className="bg-white dark:bg-black dark:text-white border  rounded-lg">
        <div className="w-full bg-[#333] h-10 rounded-t-lg relative">
          <section className="flex items-end absolute top-5 left-3 space-x-4 w-full ">
            <div className="rounded-full w-[40px] h-[35px] bg-gray-100 dark:bg-blue-600 grid place-items-center ">
              {data?.data?.user[0]?.profile ? (
                <img
                  src={data?.data?.user[0]?.profile}
                  alt=""
                  className="rounded-full w-full h-full object-fill "
                />
              ) : (
                <AiOutlineUser size={20} />
              )}
            </div>
            <div className="flex flex-col  relative w-full ">
              <p className="text-lg font-bold mt-4 ">
                {data?.data?.user[0]?.firstName?.toLocaleUpperCase()}
              </p>
            </div>
          </section>
        </div>
        <div className="flex items-center space-x-4 mx-4">
          <button className=" font-mono w-[90%] mx-auto py-1 grid  place-items-center rounded mt-10 outline-0 bg-[#3b49de] text-sm text-white tracking-wider ">
            <Link href={`/profile/${auth.userId}`}>profile</Link>
          </button>

          <button className=" font-mono w-[90%] mx-auto py-1 grid place-items-center rounded mt-10 outline-0 border border-[#3b49de] text-sm  tracking-wider ">
            <Link href={`/NewPost`}>create</Link>
          </button>
        </div>
        <h1 className="px-4 my-4 text-[#999999] text-sm ">
          {data?.data?.user[0]?.Bio ? data?.data?.user[0]?.Bio : "add a bio"}
        </h1>
        <div className="px-4 text-sm">
          <h1 className="text-[#767676]"> WORK</h1>
          <p className="text-[#999999] font-mono ">
            {data?.data?.user[0]?.job == ""
              ? data?.data?.user[0]?.job
              : "regulare user"}{" "}
          </p>
        </div>
        <div className="px-4 text-sm ">
          <h1 className="text-[#767676]"> JOINED</h1>
          <p className="text-[#999999] font-mono pb-4 ">
            {data?.data?.user[0]?.created_at
              ? format(new Date(data?.data?.user[0]?.created_at), "dd/MM/yyyy")
              : "not added"}
          </p>
        </div>
      </section>
    </section>
  );
};

export default UserSection;
