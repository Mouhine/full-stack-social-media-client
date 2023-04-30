import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useGoogleLogin } from "@react-oauth/google";
import useAuthFn from "../../api/AuthApi";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
const Login = () => {
  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const { login, register } = useAuthFn();
  const [userCred, setUserCred] = useState({
    email: "",
    password: "",
  });
  const [ValidEmail, setValidEmail] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const { setMsg, setopenErrorLoginModal } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer  ${tokenResponse.access_token}`,
            },
          }
        );

        await login({
          email: userInfo.data.email,
          password: `${userInfo.data.given_name.toUpperCase()}@r` + 22,
        });
        setLoading(false);
      } catch (error) {}
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(userCred.email));
  }, [userCred.email]);

  const handleLogin = async () => {
    if (!ValidEmail || !userCred.email || !userCred.password) {
      setMsg("please provide a valid email");
      setopenErrorLoginModal(true);
      return;
    }
    setLoading(true);
    await login(userCred);
    setLoading(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserCred((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  return (
    <section className=' h-[90vh] flex items-center justify-center  '>
      <div className=' grid grid-cols-12   md:h-[50vh] gap-4 bg-white max-w-3xl w-[90%] rounded shadow  '>
        {/* inputs */}
        <section className=' col-span-12 md:col-span-8 flex p-4    flex-col space-y-4 justify-center items-center'>
          <div>
            <h1 className='text-lg font-bold '>Login in to your account</h1>
            <p className='text-sm font-thin  tracking-normal text-gray-400  text-center '>
              please enter your information
            </p>
          </div>
          <div className='flex flex-col space-y-4 w-full mx-auto text-sm'>
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={userCred.email}
              onChange={handleChange}
              className='border py-1 rounded px-4  dark:bg-gray-100   outline-0 focus-visible:border-green-500'
            />
            <input
              type='password'
              name='password'
              id='password'
              placeholder='password'
              value={userCred.password}
              onChange={handleChange}
              className='border py-1  rounded px-4   dark:bg-gray-100  outline-0 focus-visible:border-green-500'
            />
          </div>
          <div className='space-y-3 w-full  mx-auto dark:text-gray-600 text-sm '>
            <button
              className=' w-full rounded bg-gray-200 border flex items-center justify-center py-1  '
              onClick={handleLogin}
            >
              {loading ? "Loading ..." : "Log in "}
            </button>
            <button
              className='w-full rounded bg-gray-200 border flex items-center justify-center py-1 '
              onClick={() => googleLogin()}
            >
              <FcGoogle className='mr-3' />
              Login with Google
            </button>
            <div className='py-4 flex items-center space-x-3  justify-center '>
              <h1>Do not have account </h1>
              <Link href={"/auth/register"} className='ml-4 text-blue-700'>
                Register
              </Link>
            </div>
          </div>
        </section>
        {/* logo */}
        <section className=' bg-[#e5e5ec] relative  place-items-center col-span-12 md:col-span-4 row-start-1  grid '>
          <div className='w-[100px] md:w-[200px] h-[100px] my-4  md:h-[200px] rounded-full bg-[#613eb7] '></div>

          <div className='w-full backdrop-blur-sm h-[50%] absolute bottom-0'></div>
        </section>
      </div>
    </section>
  );
};

export default Login;
