import React, { useState } from "react";
import { Follower, PostType, UserType, Comment } from "../../types";
import axios from "../../utils/axios";
import { FaCommentAlt, FaHeart } from "react-icons/fa";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { useAuth } from "../../context/useAuth";
import usePost from "../../api/PostApi";
import { toast, ToastContainer } from "react-toastify";
import { GetServerSidePropsContext } from "next";
import UserSectionPost from "../../components/Post_page_compnenets/UserSectionPost";
import PostBody from "../../components/Post_page_compnenets/PostBody";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUser from "../../api/userApi";
import { useRouter } from "next/router";
interface PostPage {
  post: PostType;
  user: UserType;
  comments: Comment[];
}
const PostPage: React.FC<PostPage> = ({ post, user, comments }) => {
  const router = useRouter();
  const { auth, setIsOpen, setPostID, setOpenLoginModal, likeLocalPost } =
    useAuth();
  const [addLike, setAddLike] = useState(true);
  const { likePost, savePost } = usePost();
  const { followUser, unfollowUser } = useUser();

  const follower = {
    id: post?.author?.id!,
    firstName: post?.author?.firstName,
    lastName: post?.author?.lastName,
    profile: post?.author?.profile,
    following_by: auth?.userId,
  } as Follower;

  const isLikedByMe = post.likedBy?.includes(auth.userId);
  const queryClient = useQueryClient();

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

  const followUserMutation = useMutation({
    mutationFn: () => {
      if (!auth.userId) {
        setOpenLoginModal(true);
        return Promise.reject("your not logged in");
      }
      return followUser(user._id!, follower);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "author"] });
    },
  });

  const unFollowUserMutation = useMutation({
    mutationFn: () => {
      if (!auth.userId) {
        setOpenLoginModal(true);
        return Promise.reject("your not logged in");
      }
      return unfollowUser(user._id!, auth.userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "author"] });
    },
  });

  const { data } = useQuery({
    queryFn: async () => {
      return await axios.get(`/users/${post.author.id}`);
    },
    queryKey: ["author"],
  });

  const isFollower = data?.data?.user[0]?.followers?.includes(auth.userId);

  return (
    <article className="min-h-[100vh]">
      <ToastContainer />
      <div className="w-[90%] mx-auto grid grid-cols-12 gap-4   ">
        <section className="col-span-1 h-[300px]  dark:bg-black dark:text-white hidden md:flex    flex-col space-y-6 justify-center items-center  ">
          <div
            className="flex flex-col space-y-2 items-center cursor-pointer  "
            onClick={() => {
              likeLocalPost(post._id!, addLike);
              likePostMutation.mutate();
              setAddLike(!addLike);
            }}
          >
            <FaHeart size={22} color={isLikedByMe ? "red" : "black"} />
            <p className="font-mono text-xsm">{post?.likes}</p>
          </div>
          <div
            className="flex flex-col space-y-2 items-center cursor-pointer"
            onClick={() => {
              setIsOpen((v) => !v);
              setPostID(post._id!);
            }}
          >
            <FaCommentAlt size={22} />
            <p className="font-mono text-xsm">{comments.length}</p>
          </div>
          <div onClick={() => saveMutation.mutate()} className="cursor-pointer">
            <BsFillBookmarkStarFill size={22} />
          </div>
        </section>
        {/* post section */}
        <PostBody
          post={post}
          comments={comments}
          id={router.query.id as string}
        />

        {/* user section */}
        <UserSectionPost
          post={post}
          isFollower={isFollower as boolean}
          unFollowUserMutation={unFollowUserMutation}
          followUserMutation={followUserMutation}
        />
      </div>
    </article>
  );
};

export default PostPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const response = await axios.get(`/posts/${context.params?.id}`);
  const userResponse = await axios.get(
    `/users/${response.data.post.author.id}`
  );
  const commentsResponse = await axios.get(`/comments/${context.params?.id}`);

  return {
    props: {
      post: response.data.post,
      comments: commentsResponse.data.comments,
    }, // will be passed to the page component as props
  };
}
