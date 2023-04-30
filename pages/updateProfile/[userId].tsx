//@ts-nocheck
import React, { useEffect, useState } from "react";
import { UserType } from "../../types";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useRouter } from "next/router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";
import useUser from "../../api/userApi";
import { BeatLoader } from "react-spinners";
import { FiUpload } from "react-icons/fi";
import { useAuth } from "../../context/useAuth";
import { useQuery } from "@tanstack/react-query";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const UpdateProfile = () => {
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();
  const [user, setUser] = useState({} as UserType);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [Bio, setBio] = useState("");
  const [job, setJob] = useState("");
  const [loading, isLoading] = useState(false);
  const [uploadAvatar, setUploadAvatar] = useState(null);
  const [coverUpload, setcoverUpload] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverloading, setcoverIsLoading] = useState(false);
  const [avatarloading, setavatarIsLoading] = useState(false);
  const { auth } = useAuth();
  const { updateUser } = useUser();
  const getUser = async () => {
    try {
      return await axiosPrivate.get(`/users/${router.query.userId}`);
    } catch (error) {}
  };

  const { data, isLoading: quueryLoading } = useQuery({
    queryFn: getUser,
  });

  useEffect(() => {
    setFirstName(data?.data?.user[0]?.firstName);
    setLastName(data?.data?.user[0]?.lastName);
    setEmail(data?.data?.user[0]?.email);
    setBio(data?.data?.user[0]?.Bio as string);
    setJob(data?.data?.user[0]?.job as string);
    setUser(data?.data.user[0]);
  }, [quueryLoading]);

  const userInfo = {
    firstName,
    lastName,
    email,
    Bio,
    job,
    cover: coverUrl ? coverUrl : user?.cover,
    profile: avatarUrl ? avatarUrl : user?.profile,
  };

  const uploadAvatarFn = async () => {
    setavatarIsLoading(true);
    if (uploadAvatar == null) return;

    const imageRef = ref(storage, `images/covers/${uploadAvatar.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, uploadAvatar);

    await getDownloadURL(snapshot.ref)
      .then((url) => {
        setAvatarUrl(url);
      })
      .finally(() => {
        setavatarIsLoading(false);
        toast.success("uploaded successfully");
      });
  };

  const uploadCoverFn = async () => {
    if (coverUpload == null) return;

    const imageRef = ref(storage, `images/covers/${coverUpload.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, coverUpload);
    setcoverIsLoading(true);
    await getDownloadURL(snapshot.ref)
      .then((url) => {
        setCoverUrl(url);
      })
      .finally(() => {
        setcoverIsLoading(false);
        toast.success("uploaded successfully");
      });
  };

  const handleUpdateUser = async () => {
    isLoading(true);
    await updateUser(router.query.userId as string, userInfo);
    router.replace(`/profile/${auth.userId}`);
    isLoading(false);
  };

  return (
    <div className="dark:bg-black dark:text-white">
      <ToastContainer />
      {user && (
        <div className="max-w-6xl mx-auto  grid place-content-center ">
          <section className="space-y-3 px-3 mx-4 bg-white dark:bg-black dark:text-white dark:border shadow p-2  ">
            <h1 className="py-4 text-2xl font-bold">User</h1>
            <input
              type="text"
              placeholder="first Name"
              className="w-full rounded px-4 py-2 border"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="lastName"
              className="w-full rounded px-4 py-2 border"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <input
              type="email"
              placeholder="email"
              className="w-full rounded px-4 py-2 border"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="bio"
              className="w-full rounded px-4 py-2 border"
              value={Bio}
              onChange={(e) => {
                setBio(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="job title"
              className="w-full rounded px-4 py-2 border"
              value={job}
              onChange={(e) => {
                setJob(e.target.value);
              }}
            />
            <div className="flex space-x-4 relative items-start">
              <div className="w-[40px] h-[40px] rounded-full">
                {coverUpload ? (
                  <img
                    src={URL.createObjectURL(coverUpload)}
                    alt=""
                    className="w-full h-full rounded-full "
                  />
                ) : (
                  <img
                    src={data?.data.user[0].cover || ""}
                    alt=""
                    className="w-full h-full rounded-full border "
                  />
                )}
              </div>
              <label
                htmlFor="input-files"
                className="py-2 px-8 rounded z-10 border mb-4 bg-white dark:bg-black dark:text-white "
              >
                {coverloading ? <BeatLoader color="#36d7b7" /> : "change Cover"}
              </label>
              <input
                type="file"
                accept="image/*"
                id="input-files"
                disabled={coverloading}
                onChange={(e) => {
                  setcoverUpload(e.target.files[0]);
                }}
                hidden
              />
              <button
                className="ml-auto absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-300 "
                onClick={uploadCoverFn}
              >
                <FiUpload />
              </button>
            </div>
            <div className="flex space-x-4 relative items-start">
              <div className="w-[40px] h-[40px] rounded-full">
                {uploadAvatar ? (
                  <img
                    src={URL.createObjectURL(uploadAvatar)}
                    alt=""
                    className="w-full h-full rounded-full "
                  />
                ) : (
                  <img
                    src={data?.data.user[0].profile || ""}
                    alt=""
                    className="w-full h-full rounded-full "
                  />
                )}
              </div>
              <label
                htmlFor="input"
                className="py-2 px-8 rounded z-10 border mb-4 bg-white dark:bg-black dark:text-white "
              >
                {avatarloading ? (
                  <BeatLoader color="#36d7b7" />
                ) : (
                  "change avatar"
                )}
              </label>
              <input
                type="file"
                accept="image/*"
                id="input"
                onChange={(e) => {
                  setUploadAvatar(e.target.files[0]);
                }}
                hidden
              />
              <button
                className="ml-auto absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-300 "
                onClick={uploadAvatarFn}
              >
                <FiUpload />
              </button>
            </div>
            <button
              className="rounded bg-[#1da1f2] text-white shadow px-3 py-2 "
              onClick={handleUpdateUser}
            >
              {loading ? "Loading ..." : "update"}
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
