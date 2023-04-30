import React, { FC } from "react";
import { Follower } from "../../types";
import { AiOutlineUser } from "react-icons/ai";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAuth } from "../../context/useAuth";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "../../api/userApi";
interface FollowerType {
  follower: Follower;
}
const FollowerItem: FC<FollowerType> = ({ follower }) => {
  const { auth, unFollowLocalUser, followers } = useAuth();
  const { unfollowUser } = useUser();
  const queryClient = useQueryClient();

  const unFollowUserMutation = useMutation({
    mutationFn: () => {
      return unfollowUser(follower.id, auth.userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <div className=" w-full mx-auto flex items-center justify-between ">
      <section className="flex items-center space-x-6">
        <div className="w-[30px] h-[30px] rounded-full">
          {follower.profile ? (
            <img
              src={follower?.profile}
              alt=""
              className="w-full h-full object-fill rounded-full"
            />
          ) : (
            <AiOutlineUser size={20} />
          )}
        </div>
        <Link href={`/profile/${follower.id}`}>
          <div className="flex items-center space-x-2 text-[11px]">
            <span>{follower.firstName}</span>
            <span>{follower.lastName}</span>
          </div>
        </Link>
      </section>
      <section>
        <button
          className="px-2 py-2 rounded shadow outline-none bg-blue-300"
          onClick={() => {
            unFollowLocalUser(follower.id);
            unFollowUserMutation.mutate();
          }}
        >
          unfollow
        </button>
      </section>
    </div>
  );
};

export default FollowerItem;
