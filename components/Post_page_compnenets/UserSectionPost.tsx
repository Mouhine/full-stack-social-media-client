import Image from "next/image";
import { PostType } from "../../types";
import { AiOutlineUser } from "react-icons/ai";
import Link from "next/link";
import { useAuth } from "../../context/useAuth";
import { format } from "date-fns";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface UserSection {
  post: PostType;
  isFollower: boolean;
  followUserMutation: UseMutationResult<
    AxiosResponse<any, any> | undefined,
    unknown,
    void,
    unknown
  >;
  unFollowUserMutation: UseMutationResult<
    AxiosResponse<any, any> | undefined,
    unknown,
    void,
    unknown
  >;
}

const UserSectionPost = ({
  post,
  isFollower,
  followUserMutation,
  unFollowUserMutation,
}: UserSection) => {
  const { auth } = useAuth();
  console.log(isFollower);
  return (
    <section className="col-span-4 hidden lg:block   ">
      <section className="bg-white border min-h-[250px]   dark:bg-black dark:text-white rounded-lg">
        <div className="w-full bg-[#333] h-10 rounded-t-lg relative">
          <section className="flex items-end absolute top-5 left-3 space-x-4 w-full ">
            <div className="rounded-full w-[50px] h-[40px] bg-gray-100 dark:bg-blue-500 grid place-items-center ">
              {post?.author?.profile ? (
                <Image
                  src={post.author.profile}
                  alt=""
                  className="rounded-full w-full h-full "
                  height={12000}
                  width={12000}
                />
              ) : (
                <AiOutlineUser size={20} />
              )}
            </div>
            <div className="flex flex-col  relative w-full ">
              <Link
                href={`/profile/${post?.author?.id}`}
                className="cursor-pointer"
              >
                <p className="text-md font-bold mt-4 ">
                  {post?.author?.firstName?.toLocaleUpperCase()}
                </p>
              </Link>
            </div>
          </section>
        </div>
        <h1 className=" text-sm px-4 my-4 text-[#999999] pt-4 ">
          {post?.author?.job}
        </h1>
        <div className="px-4 text-sm ">
          <h1 className="text-[#767676]"> WORK</h1>
          <p className="text-[#999999] font-mono ">
            {post?.author?.job == "" ? post?.author?.job : "regulare user"}{" "}
          </p>
        </div>
        <div className="px-4 ">
          <h1 className="text-[#767676]"> JOINED</h1>
          <p className="text-[#999999] font-mono ">
            {post?.author?.created_at
              ? format(new Date(post?.author?.created_at), "dd/MM/yyyy")
              : "not added"}
          </p>
        </div>
      </section>
    </section>
  );
};

export default UserSectionPost;
