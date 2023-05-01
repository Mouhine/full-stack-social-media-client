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
import Skelton from "../../components/modals/Skelton";
interface PostPage {
  post: PostType;
}
const PostPage: React.FC<PostPage> = ({ post }) => {
  const router = useRouter();
  const { auth, setIsOpen, setPostID, setOpenLoginModal, likeLocalPost } =
    useAuth();
  const [addLike, setAddLike] = useState(true);
  const { likePost, savePost } = usePost();
  const { followUser, unfollowUser } = useUser();

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
      return followUser(post?.author?.id!, follower);
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
      return unfollowUser(post?.author.id, auth.userId);
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

  const { data: postQuery, isLoading } = useQuery({
    queryFn: async () => {
      return await axios.get(`/posts/${router.query?.id}`);
    },
  });
  const follower = {
    id: postQuery?.data?.post?.author?.id!,
    firstName: postQuery?.data?.post?.author?.firstName,
    lastName: postQuery?.data?.post?.author?.lastName,
    profile: postQuery?.data?.post?.author?.profile,
    following_by: auth?.userId,
  } as Follower;

  const isLikedByMe = postQuery?.data?.post?.likedBy?.includes(auth.userId);
  const isFollower = data?.data?.user[0]?.followers?.includes(auth.userId);
  return (
    <article className="min-h-[100vh]">
      <ToastContainer />
      <div className="w-[90%] mx-auto grid grid-cols-12 gap-4   ">
        {/* post section */}
        {isLoading ? (
          <Skelton />
        ) : (
          <PostBody
            post={postQuery?.data.post}
            id={router.query.id as string}
          />
        )}

        {/* user section */}
        <UserSectionPost
          post={postQuery?.data.post}
          isFollower={isFollower as boolean}
          unFollowUserMutation={unFollowUserMutation}
          followUserMutation={followUserMutation}
        />
      </div>
    </article>
  );
};

export default PostPage;
