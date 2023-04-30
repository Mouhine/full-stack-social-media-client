import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { Auth, Comment, Follower, PostType, UserType } from "../types";
import { GetServerSidePropsContext } from "next";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/PostApi";
interface authType {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postID: string;
  setPostID: React.Dispatch<React.SetStateAction<string>>;
  openLoginModal: boolean;
  setOpenLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  updatReadingList: boolean;
  setUpdatReadingList: React.Dispatch<React.SetStateAction<boolean>>;
  posts: PostType[];
  setPosts: React.Dispatch<React.SetStateAction<PostType[] | []>>;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[] | []>>;
  addLocalPost: (post: PostType) => void;
  deleteLocalPost: (id: string) => void;
  likeLocalPost: (id: string, addLike: boolean) => void;
  addLocalComment: (comment: Comment) => void;
  deleteLocalComment: (id: string) => void;
  saveLocalPost: (post: PostType) => void;
  unsaveLocalPost: (id: string) => void;
  readingList: PostType[] | [];
  setReadingList: React.Dispatch<React.SetStateAction<PostType[] | []>>;
  likeLocalComment: (id: string, addCommentLike: boolean) => void;
  followers: [] | Follower[];
  setFollowers: React.Dispatch<React.SetStateAction<[] | Follower[]>>;
  followLocalUser: (follower: Follower) => void;
  unFollowLocalUser: (id: string) => void;
  users: [] | UserType[];
  setUsers: React.Dispatch<React.SetStateAction<[] | UserType[]>>;

  openErrorLoginModal: boolean;
  setopenErrorLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  openErrorRegisterModal: boolean;
  setopenErrorRegisterModal: React.Dispatch<React.SetStateAction<boolean>>;
  msg: string;
  setMsg: React.Dispatch<React.SetStateAction<string>>;
  setUserPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
  userPosts: PostType[];
  isLoading: boolean;
}
const AuthContext = createContext<authType>({} as authType);
export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState({
    accessToken: "",
    userId: "",
  });

  const [isLogin, setIsLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [postID, setPostID] = useState("");
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openErrorLoginModal, setopenErrorLoginModal] = useState(false);
  const [openErrorRegisterModal, setopenErrorRegisterModal] = useState(false);
  const [updatReadingList, setUpdatReadingList] = useState(false);
  const [posts, setPosts] = useState<PostType[] | []>([]);
  const [comments, setComments] = useState<Comment[] | []>([]);
  const [readingList, setReadingList] = useState<PostType[] | []>([]);
  const [followers, setFollowers] = useState<Follower[] | []>([]);
  const [users, setUsers] = useState<UserType[] | []>([]);
  const [msg, setMsg] = useState("");
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const productionURL = "https://social-media-server-3ppk.onrender.com";
  const BaseURL = "http://localhost:5000";

  const addLocalPost = (post: PostType) => {
    setPosts((prev) => [...prev, post]);
  };

  const deleteLocalPost = (id: string) => {
    const filtredPosts = posts.filter((post) => post._id !== id);
    setPosts(filtredPosts);
  };

  const likeLocalPost = (id: string, addLike: boolean) => {
    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post._id === id) {
          if (addLike) {
            return {
              ...post,
              likes: post.likes! + 1,
              likedBy: [...post.likedBy!, auth.userId],
            };
          } else {
            return {
              ...post,
              likes: post.likes! - 1,
              likedBy: post.likedBy?.filter((user) => user !== auth.userId),
            };
          }
        } else {
          return post;
        }
      });
    });
  };

  const addLocalComment = (comment: Comment) => {
    setComments((prev) => [...prev, comment]);
  };

  const deleteLocalComment = (id: string) => {
    const filtredomments = comments.filter((comment) => comment._id !== id);
    setComments(filtredomments);
  };

  const likeLocalComment = (id: string, addCommentLike: boolean) => {
    setComments((prevComments) => {
      return comments.map((comment) => {
        if (comment._id === id) {
          if (addCommentLike) {
            return {
              ...comment,
              likes: comment.likes + 1,
            };
          } else {
            return {
              ...comment,
              likes: comment.likes - 1,
            };
          }
        } else {
          return comment;
        }
      });
    });
  };

  const saveLocalPost = (post: PostType) => {
    setReadingList((prev) => [...prev, post]);
  };

  const unsaveLocalPost = (id: string) => {
    setReadingList((prevPosts) => {
      return readingList.filter((post) => post._id !== id);
    });
  };

  const followLocalUser = (follower: Follower) => {
    setFollowers((prev) => [...prev, follower]);
  };

  const unFollowLocalUser = (id: string) => {
    setFollowers((prev) => {
      return followers.filter((follower) => follower.id !== id);
    });
  };

  const postQuery = useQuery({
    queryFn: getPosts,
    queryKey: ["posts"],
  });

  useEffect(() => {
    setPosts(postQuery.data?.data.posts);
  }, [postQuery.isLoading]);

  return (
    <AuthContext.Provider
      value={{
        isLoading: postQuery.isLoading,
        auth,
        setAuth,
        isLogin,
        setIsLogin,
        isOpen,
        setIsOpen,
        postID,
        setPostID,
        openLoginModal,
        setOpenLoginModal,
        updatReadingList,
        setUpdatReadingList,
        posts,
        setPosts,
        comments,
        setComments,
        addLocalPost,
        deleteLocalPost,
        likeLocalPost,
        addLocalComment,
        deleteLocalComment,
        saveLocalPost,
        unsaveLocalPost,
        readingList,
        setReadingList,
        likeLocalComment,
        unFollowLocalUser,
        followLocalUser,
        users,
        setUsers,
        setFollowers,
        followers,
        openErrorLoginModal,
        openErrorRegisterModal,
        setopenErrorLoginModal,
        setopenErrorRegisterModal,
        msg,
        setMsg,
        userPosts,
        setUserPosts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
