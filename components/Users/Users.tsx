import React, { Suspense, lazy } from "react";
const User = lazy(() => import("./User"));
import UserSkelton from "../modals/userSkelton";
import { UserType } from "../../types";
import { useQuery } from "@tanstack/react-query";
import useUser from "../../api/userApi";
const Users = () => {
  const { getUsers } = useUser();
  const { data, isLoading } = useQuery({
    queryFn: getUsers,
    queryKey: ["users"],
  });

  return (
    <div className="   hidden place-items-center dark:bg-black dark:text-white lg:block space-y-1  p-2 bg-white rounded shadow border row-span-1 dark:border-gray-500">
      <h1 className="text-lg font-bold tracking-wide">
        Peaple you might be intrested
      </h1>

      {!isLoading ? (
        data?.data.users?.slice(0, 5)?.map((user: UserType, i: number) => {
          return (
            <Suspense fallback={<UserSkelton key={i} />} key={i}>
              <User user={user} key={user._id} />
            </Suspense>
          );
        })
      ) : (
        <div className="w-full grid place-items-center">
          {[1, 2, 3].map((s, i) => {
            return <UserSkelton key={i} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Users;
