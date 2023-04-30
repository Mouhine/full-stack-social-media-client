import React, { useState } from "react";
import { Follower, UserType } from "../../types";
import useUser from "../../api/userApi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAuth } from "../../context/useAuth";
import { AiOutlineUser } from "react-icons/ai";
import { SlUserFollow } from "react-icons/sl";
import Link from "next/link";
import { BsPersonCheckFill } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BeatLoader } from "react-spinners";
interface userProps {
  user: UserType;
}
const User = ({ user }: userProps) => {
  const { auth, setOpenLoginModal, followLocalUser, unFollowLocalUser } =
    useAuth();

  const queryClient = useQueryClient();

  const { followUser, unfollowUser } = useUser();

  const follower = {
    id: user._id!,
    firstName: user.firstName,
    lastName: user.lastName,
    profile: user.profile,
    following_by: auth.userId,
  } as Follower;

  const followUserMutation = useMutation({
    mutationFn: () => {
      if (!auth.userId) {
        setOpenLoginModal(true);
        return Promise.reject("your not logged in");
      }
      return followUser(user._id!, follower);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <article className="flex justify-between items-center">
      <div className="flex items-center space-x-4 ">
        <section className="w-[30px] h-[30px] rounded-full">
          {user.profile ? (
            <img
              src={user.profile}
              alt=""
              className="w-full h-full rounded-full "
            />
          ) : (
            <div className="w-full grid place-items-center border h-full rounded-full">
              <AiOutlineUser />
            </div>
          )}
        </section>
        <section className="flex flex-col ">
          <Link href={`/profile/${user._id}`}>
            <h1 className="text-[12px] font-thin text-gray-300 ">
              {user.firstName + " " + user.lastName}
            </h1>
          </Link>
          <p className="text-[12px] font-thin text-gray-300 ">
            {" "}
            {user.job ? user.job : "User"}{" "}
          </p>
        </section>
      </div>
      {auth.userId !== user._id && (
        <button
          className="px-6 py-1 rounded border "
          onClick={() => {
            user?.followers?.includes(auth.userId)
              ? unFollowUserMutation.mutate()
              : followUserMutation.mutate();
          }}
        >
          {!followUserMutation.isLoading &&
            !unFollowUserMutation.isLoading &&
            user?.followers?.includes(auth.userId) && <BsPersonCheckFill />}
          {!followUserMutation.isLoading &&
            !unFollowUserMutation.isLoading &&
            !user?.followers?.includes(auth.userId) && <SlUserFollow />}

          {(followUserMutation.isLoading || unFollowUserMutation.isLoading) && (
            <BeatLoader color="red" size={"5px"} />
          )}
        </button>
      )}
    </article>
  );
};

export default User;
