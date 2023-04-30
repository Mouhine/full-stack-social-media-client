import Users from "../components/Users/Users";
import { useAuth } from "../context/useAuth";
import { useEffect } from "react";
import UserSection from "../components/Users/UserSection";
import Posts from "../components/Posts/Posts";
import SignInBtn from "../components/SignInBtn";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/PostApi";
export default function Home() {
  const { auth, posts } = useAuth();

  return (
    <div className="">
      <main className="w-full dark:bg-black dark:text-white max-w-5xl md:w-[90%] mx-auto grid px-4  md:gap-2 lg:gap-4 grid-cols-1 md:grid-cols-12  ">
        <Posts posts={posts} />
        <div className="  lg:col-span-4 ">
          {auth.accessToken ? <UserSection /> : <SignInBtn />}
          <Users />
        </div>
      </main>
    </div>
  );
}
