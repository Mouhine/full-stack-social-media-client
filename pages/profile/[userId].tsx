import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import { Follower, PostType, UserType } from "../../types";
import useAuthFn from "../../api/AuthApi";
import { useRouter } from "next/router";
import Link from "next/link";
import ReadingList from "../../components/readingList";
import { AiOutlineUser } from "react-icons/ai";
import { GetServerSidePropsContext } from "next";
import Menu from "../../components/profile-compnents/Menu";
import Posts from "../../components/Posts/Posts";
import axios, { axiosPrivate } from "../../utils/axios";
import Followers from "../../components/Followers/Followers";
import useUser from "../../api/userApi";
import { useQuery } from "@tanstack/react-query";
import { useDeprecatedAnimatedState } from "framer-motion";
import { BeatLoader } from "react-spinners";
import UserSkelton from "../../components/modals/userSkelton";

const Profile = () => {
  const { auth, setAuth, posts, setFollowers, setReadingList } = useAuth();
  const { deleteUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({} as UserType);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signOut } = useAuthFn();
  const [view, setView] = useState<"posts" | "followers" | "readingList">(
    "posts"
  );

  const userPosts = useMemo(
    () => posts?.filter((post) => post?.author.id === user?._id!),
    [user, posts]
  );

  const handleChangeView = (View: typeof view) => {
    setView(View);
  };

  const handleLogout = async () => {
    await signOut();
    setAuth({
      userId: "",
      accessToken: "",
    });
    router.replace("/");
  };

  const handleDeleteUser = async () => {
    await deleteUser(auth.userId);
    setAuth({
      userId: "",
      accessToken: "",
    });
    router.push("/");
  };

  // fetch the user in the clinet and set it to a state
  // fetxh followers is pass it as props

  // const userQuery = useQuery({
  //   queryFn: async () => {
  //     return await axios.get(`/users/${router.query.userId}`);
  //   },
  // });

  const followerData = useQuery({
    queryFn: async () => {
      return await axios.get(`/users/${router.query.userId}/followers`);
    },
  });

  const getUser = async () => {
    setIsLoading(true);
    try {
      const res = await axiosPrivate.get(`/users/${router.query.userId}`);
      setUser(res.data.user[0]);
      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getUser();
  }, [auth.userId]);

  useEffect(() => {
    setFollowers(followerData.data?.data.followers);
    setReadingList(user.reading_list!);
  }, [auth.userId]);

  // console.log(userQuery?.data);
  return (
    <div className=" mb-6 min-h-[150vh] dark:bg-black dark:text-white  ">
      <section className="mx-auto   h-[50vh]  bg-black  relative  ">
        <div className=" bg-white py-4 absolute dark:bg-black dark:text-white dark:border left-1/2 top-1/2 -translate-x-1/2  max-w-[500px]  w-[95%] rounded-md shadow mx-auto  my-4   flex flex-col items-center">
          {isLoading ? (
            <UserSkelton />
          ) : (
            <div className="flex flex-col items-center">
              {auth.userId === user?._id && (
                <div className=" h-[30px] rounded-full absolute left-0 bg-red-500 m-1  bg-white border grid place-items-center">
                  <Link href={`/updateProfile/${user._id}`}>
                    <button className="rounded bg-[#1da1f2] text-white shadow px-3 py-2 w-full ">
                      update
                    </button>
                  </Link>
                </div>
              )}
              <div>
                <div className=" border w-[100px] h-[100px]   relative rounded-full  ">
                  {user?.profile ? (
                    <Image
                      src={user?.profile as string}
                      alt=""
                      className=" rounded-full w-full h-full "
                      width={200}
                      height={200}
                    />
                  ) : (
                    <div className=" w-[100px] h-[100px] grid place-content-center">
                      <AiOutlineUser size={32} />
                    </div>
                  )}
                  {auth.userId === user?._id && (
                    <div
                      className="w-[30px] h-[30px] dark:bg-black dar:text-white rounded-full absolute top-16 -right-2 bg-white border grid place-items-center "
                      onClick={() => setIsOpen((v) => !v)}
                    >
                      <BsThreeDotsVertical />
                    </div>
                  )}
                  {isOpen && (
                    <Menu
                      handleLogout={handleLogout}
                      user={user}
                      handleDeleteUser={handleDeleteUser}
                    />
                  )}
                </div>
              </div>
              {
                <div className=" flex flex-col items-center">
                  <h1 className="text-2xl font-somibold  ">
                    {user?.firstName + " " + user?.lastName}
                  </h1>
                  <h1 className="text-sm text-gray-300 font-somibold  ">
                    {user?.Bio || "add a bio"}
                  </h1>
                </div>
              }
            </div>
          )}
        </div>
      </section>

      <section className="mt-[50px] ">
        <div className="flex items-center space-x-10 justify-center">
          <p
            className={` ${
              view === "posts" && "underline text-blue-500"
            } cursor-pointer`}
            onClick={() => handleChangeView("posts")}
          >
            Posts
          </p>
          {auth.userId === user?._id && (
            <p
              className={`${
                view === "followers" && "underline text-blue-500"
              } cursor-pointer`}
              onClick={() => handleChangeView("followers")}
            >
              following
            </p>
          )}
          {auth.userId === user?._id && (
            <p
              className={`${
                view === "readingList" && "underline text-blue-500"
              } cursor-pointer`}
              onClick={() => handleChangeView("readingList")}
            >
              Reading List
            </p>
          )}
        </div>
      </section>
      {view === "posts" && (
        <div className="max-w-3xl dark:bg-black dark:text-white w-[95%] grid place-items-center mx-auto space-y-4 mt-8">
          <Posts posts={userPosts} />
        </div>
      )}

      <div>
        {view === "readingList" && auth.userId === user._id && (
          <ReadingList readingList={user.reading_list!} user={user} />
        )}
      </div>
      <div>
        {view === "followers" && auth.userId === user._id && <Followers />}
      </div>
    </div>
  );
};

export default Profile;
