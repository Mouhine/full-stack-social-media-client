import React from "react";
import { useAuth } from "../../context/useAuth";
import FollowerItem from "./Follower";

const Followers = () => {
  const { followers } = useAuth();
  return (
    <div className="flex flex-col space-y-2 dark:bg-black dar:text-white max-w-3xl mt-8 p-4 bg-white rounded shadow mx-auto w-[95%]">
      {followers?.map((f, i) => {
        return <FollowerItem follower={f} key={f._id} />;
      })}
      {followers?.length === 0 && (
        <div className="py-4 grid place-content-center bg-white border shadow p-8 ">
          <h1 className=" text-black ">
            {" "}
            follow a user to see his lates posts
          </h1>
        </div>
      )}
    </div>
  );
};

export default Followers;
