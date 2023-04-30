import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import { useAuth } from "../../context/useAuth";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import useAuthFn from "../../api/AuthApi";
import Link from "next/link";
const Register = () => {
  const PWD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;

  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    job: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [validPassowrd, setValidPassword] = useState<boolean>(true);
  const { register } = useAuthFn();
  const { setMsg, setopenErrorRegisterModal } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer  ${tokenResponse.access_token}` } }
      );

      try {
        const response = await register({
          firstName: userInfo.data.given_name as string,
          lastName: userInfo.data.family_name as string,
          email: userInfo.data.email as string,
          password: (`${userInfo.data.given_name.toUpperCase()}@r` +
            22) as string,
          profile: userInfo.data.picture as string,
        });
      } catch (error) {}
    },
    onError: (errorResponse) => "",
  });

  const handelRegister = async () => {
    if (
      !validPassowrd ||
      !userInfo.email ||
      !userInfo.firstName ||
      !userInfo.lastName
    ) {
      setMsg(
        "the fields firstName and lastName and email and password are required"
      );
      setopenErrorRegisterModal(true);
      return;
    }
    setLoading(true);
    const response = await register(userInfo);

    setLoading(false);
  };

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(userInfo.password));
  }, [userInfo.password]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  return (
    <section className=' flex justify-center items-center dark:bg-black dark:text-white mix-h-screen py-4   pt-8 '>
      <div className=' grid grid-cols-12  overflow-hidden  place-content-center max-w-5xl mx-auto bg-white border rounded  shadow '>
        {/* inputs */}
        <section className=' flex p-4  flex-col space-y-4 justify-center items-center col-span-12 md:col-span-6 '>
          <div className='text-center'>
            <h1 className='text-md font-medium '>Create your account</h1>
            <p className='text-sm font-thin  tracking-normal  text-center '>
              please enter your information
            </p>
          </div>
          <div className='flex flex-col space-y-2 text-sm w-full  '>
            <input
              type='text'
              name='firstName'
              id='firstName'
              placeholder='First name'
              value={userInfo.firstName}
              onChange={handleChange}
              className='border py-1 rounded px-4 dark:bg-gray-100  md:w-[400px] outline-0 focus-visible:border-green-500'
            />
            <input
              type='text'
              name='lastName'
              id='firstName'
              placeholder='last name'
              value={userInfo.lastName}
              onChange={handleChange}
              className='border py-2 rounded px-4 dark:bg-gray-100  md:w-[400px] outline-0 focus-visible:border-green-500'
            />
            <input
              type='email'
              placeholder='Email'
              value={userInfo.email}
              name='email'
              onChange={handleChange}
              className='border py-1 rounded px-4  md:w-[400px] dark:bg-gray-100  outline-0 focus-visible:border-green-500'
            />
            <input
              type='text'
              name='job'
              placeholder='tell as about your work'
              value={userInfo.job}
              onChange={handleChange}
              className='border py-1 rounded px-4  md:w-[400px] dark:bg-gray-100  outline-0 focus-visible:border-green-500'
            />

            <input
              type='password'
              name='password'
              id='password'
              placeholder='password'
              value={userInfo.password}
              onChange={handleChange}
              className={`border py-1 rounded px-4  dark:bg-gray-100  md:w-[400px] outline-0 ${
                validPassowrd ? "border-green-600" : ""
              } `}
            />

            <p className='p-2 bg-yellow-200 text-gray-500 md:w-[400px] text-[12px] font-mono rounded'>
              The password must include uppercase and lowercase letters and at
              least ane number and a special character must be at least 8
              characters
            </p>
          </div>
          <div className='space-y-3 mx-auto text-sm w-full dark:text-gray-600 md:w-[400px]  '>
            <button
              className=' w-full  rounded bg-gray-200 border flex items-center justify-center py-1  '
              onClick={handelRegister}
            >
              {loading ? "Loading ..." : "create account"}
            </button>
            <button
              className='w-full rounded bg-gray-200 border flex items-center justify-center py-1  '
              onClick={() => googleLogin()}
            >
              <FcGoogle className='mr-3' />
              Signup with Google
            </button>
            <ToastContainer />
          </div>
          <div className=' flex items-center space-x-3 justify-center '>
            <h1>already have an account </h1>
            <Link href={"/auth/login"} className='ml-4 text-blue-700'>
              Login
            </Link>
          </div>
        </section>
        {/* logo */}
        <section className=' bg-[#e5e5ec] relative  place-items-center col-span-12 md:col-span-6 row-start-1   grid  '>
          <div className='w-[100px] md:w-[200px] my-4 h-[100px]  md:h-[200px] rounded-full bg-[#613eb7] '></div>

          <div className='w-full backdrop-blur-sm h-[50%] absolute bottom-0'></div>
        </section>
      </div>
    </section>
  );
};

export default Register;
