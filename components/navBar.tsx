import React, { useState, useEffect } from "react";
import { BiEdit } from "react-icons/bi";
import { useAuth } from "../context/useAuth";
import Link from "next/link";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { UserType } from "../types";
import { AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { useRouter } from "next/router";
const NavBar = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [user, setUser] = useState({} as UserType);
  const router = useRouter();
  const getUser = async () => {
    try {
      const response = await axiosPrivate.get(`/users/${auth.userId}`);
      setUser(response.data.user[0]);
    } catch (error) {}
  };
  useEffect(() => {
    getUser();
  }, [auth.userId]);

  return (
    <section className='w-full bg-white dark:bg-black dark:text-white '>
      <nav className='  flex justify-between items-center   max-w-5xl w-[100%]  md:px-0  mx-auto py-6    h-4  '>
        <div className=' px-4 flex items-center justify-between space-x-12 '>
          <Link href={`/`}>
            <h1 className='text-lg font-semibold  cursor-pointer '>READER</h1>
          </Link>

          <div className=' max-w-[600px] w-full relative flex items-center  rounded md:border-none  '>
            <div
              className='absolute right-2 md:top-0 p-2 cursor-pointer border rounded-full md:border-none  '
              onClick={() => {
                router.push(`/Search`);
              }}
            >
              <AiOutlineSearch />
            </div>
            <input
              type='text'
              placeholder='search'
              className='px-4 py-1 border rounded  w-full hidden md:block '
              onClick={() => {
                router.push(`/Search`);
              }}
            />
          </div>
        </div>
        <div className=' px-4 '>
          {auth.userId ? (
            <div className='flex justify-end space-x-4 w-[200px]  items-center'>
              <Link href={`/profile/${auth.userId}`}>
                <div className=' w-[35px] h-[35px] flex items-center space-x-4 rounded-full bg-gray-100 dark:bg-blue-600 border shadow'>
                  {user?.profile ? (
                    <img
                      src={user.profile}
                      alt=''
                      className=' rounded-full w-full h-full object-fill '
                    />
                  ) : (
                    <div className='w-full grid place-items-center border h-full rounded-full'>
                      <AiOutlineUser />
                    </div>
                  )}
                </div>
              </Link>

              <Link href={"/NewPost"}>
                <div className='px-4 rounded border  flex items-center p-1 '>
                  <span className='tracking-wider font-semibold text-sm cursor-pointer '>
                    write
                  </span>
                  <BiEdit className='ml-2' />
                </div>
              </Link>
            </div>
          ) : (
            <div className='place-self-end '>
              <Link href={"/auth/register"}>
                <button className='border ml-auto text-sm rounded py-1 px-2 outline-none font-sans		 '>
                  SingUp / Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </section>
  );
};

export default NavBar;
