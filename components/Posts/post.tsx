import React , {useState , useMemo} from "react";
import {
  AiFillHeart,
  AiOutlineDelete,
  AiOutlineHeart,
  AiOutlineUser,
} from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { PostType } from "../../types";
import Image from "next/image";
import { useAuth } from "../../context/useAuth";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usePost from "../../api/PostApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useScreen } from "usehooks-ts";
interface postProps {
  post: PostType;
}
const Post = ({ post }: postProps) => {

  const { deletePost, likePost, savePost } = usePost();
  const queryClient = useQueryClient();
  const { auth, setOpenLoginModal , likeLocalPost , deleteLocalPost} = useAuth();

  const { setPostID, setIsOpen } = useAuth();
  const router = useRouter();
  const isProfile = router.pathname.includes("profile");

  const isLikedByME = useMemo(() => post.likedBy?.includes(auth.userId), [post]);
  // react query

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!auth.userId) {
        setOpenLoginModal(true);
        return Promise.reject("your not logged in");
      }
      return deletePost(post._id!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("post deleted");
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!auth.userId) {
        setOpenLoginModal(true);
        return Promise.reject("your not logged in");
      }
      return savePost(auth.userId, { ...post, savedBy: auth.userId });
    },
    onSuccess: () => {
      toast.success("post saved");
    },
  });

  const likePostMutation = useMutation({
    mutationFn: () => {
      if (!auth.userId) {
        setOpenLoginModal(true);
        return Promise.reject("your not logged in");
      }
      return likePost(post._id!, auth.userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <article className='rounded border dark:border-gray-500 bg-white dark:bg-black  w-[100%] md:w-full mx-auto  shadow '>
      
      {/* author section */}
      {post.cover && (
        <div className=' rounded col-span-2 h-[200px] object-cover w-full	'>
          <img
            src={post.cover}
            alt=''
            className='w-full h-full rounded object-fill '
            loading='lazy'
          />
        </div>
      )}
      <div className='p-4'>
        <section className='flex space-x-4 items-center  '>
          <Link href={`/profile/${post.author.id}`}>
            <div className='rounded-full w-[30px] h-[30px] bg-gray-100 dark:bg-blue-600 grid place-items-center '>
              {post.author.profile ? (
                <Image
                  src={post.author.profile}
                  alt=''
                  className='rounded-full w-full h-full'
                  height={40}
                  width={40}
                  loading='lazy'
                />
              ) : (
                <AiOutlineUser size={24} />
              )}
            </div>
          </Link>
          <div className='flex  items-start justify-between relative w-full  '>
            <div className='flex flex-col '>
              <p className='text-[12px] font-bold text-[#c8c8c8]'>
                {post.author.firstName}
              </p>
              <p className='text-[12px] font-bold text-[#c8c8c8]'>
                {post.author.job}
              </p>
            </div>
            <div className='flex items-center space-x-4'>
              <p className=' text-[12px] text-[#c8c8c8]'>
                {format(new Date(post.date), "MM/dd/yyyy")}
              </p>
              {isProfile && auth.userId === post.author.id && (
                <button onClick={() => {
                  deleteLocalPost(post._id!)
                  deleteMutation.mutate()}}>
                  <AiOutlineDelete size={20} />
                </button>
              )}
            </div>
          </div>
        </section>
        {/* body section */}
        <section className=' mb-2 px-6'>
          <div className='flex flex-col col-span-3 '>
            <Link href={`/post/${post._id}`}>
              <h1 className=' text-lg font-bold my-2 text-[#101010] dark:text-white '>
                {post.title}
              </h1>
            </Link>
          </div>
        </section>
        {/* tags section */}
        <section className='flex space-x-4  px-6'>
          {post.tags.map((tag) => {
            return (
              <div
                key={tag.id}
                className='grid place-items-center px-2 font-thin text-[10px]'
              >
                {"#" + tag.body}
              </div>
            );
          })}
        </section>
        <section className='flex items-center justify-between h-16 '>
          <div className='flex items-center space-x-6 text-sm font-thin md:p-4 '>
            <button
              className={`flex items-center space-x-1 font-thin transition ease-in-out delay-100  p-2 rounded-lg  hover:bg-[#f5f5f5]   duration-200 cursor-pointer `}
              onClick={() => {
                likeLocalPost(post._id! , !isLikedByME as boolean)
                likePostMutation.mutate()
              }}
            >
              {isLikedByME ? (
                <AiFillHeart size={20} color='red' />
              ) : (
                <AiOutlineHeart size={20} />
              )}
              <span>{post?.likes!}</span>
              <span className='font-mono'>Reactions</span>
            </button>
            <section
              className='flex items-center space-x-1  transition ease-in-out delay-100  p-2 rounded-lg  hover:bg-[#f5f5f5]   duration-200 cursor-pointer '
              onClick={() => {
                setPostID(post._id!);
                setIsOpen(true);
              }}
            >
              <FaRegComment size={20} />

              <span className='font-mono'>Comments</span>
            </section>
          </div>
          <div
            className='transition ease-in-out delay-100  p-2 rounded-lg  hover:bg-[#f5f5f5]   duration-200'
            onClick={() => saveMutation.mutate()}
          >
            <BsFillBookmarkStarFill size={20} />
          </div>
        </section>
      </div>
    </article>
  );
};

export default Post;
