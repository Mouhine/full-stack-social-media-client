import React, { Suspense, lazy, useMemo } from "react";
// import Post from "./post";
const Post = lazy(() => import("./post"));
import { PostType, UserType } from "../../types";
import Skelton from "../modals/Skelton";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../../api/PostApi";
import { useAuth } from "../../context/useAuth";

const Posts = ({ user, posts }: { user?: UserType; posts: PostType[] }) => {
  const { isLoading } = useAuth();
  return (
    <div className="md:col-span-8 lg:col-span-8 overflow-y-scroll scrollbar-hide max-h-screen space-y-3  ">
      {!isLoading
        ? posts?.map((post, i) => {
            return (
              <Suspense fallback={<Skelton key={i} />}>
                <Post post={post} key={post._id} />
              </Suspense>
            );
          })
        : [1, 2, 3, 4, 5].map((_, i) => {
            return <Skelton key={i} />;
          })}

      {posts?.length === 0 && (
        <div className="  shadow  dark:text-white text-black rouded py-8">
          <p>there is no posts</p>
        </div>
      )}
    </div>
  );
};

export default Posts;
