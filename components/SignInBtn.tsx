import React from "react";
import { useRouter } from "next/router";

type Props = {};

function SignInBtn({}: Props) {
  const router = useRouter();
  function goToLogin() {
    router.replace("/auth/register");
  }
  return (
    <div className='col-span-4 mb-4 border dark:border-gray-500 bg-white dark:bg-slate-900 grid place-content-center min-h-[200px] rounded-md '>
      <button className='shadow p-2 rounded-md border' onClick={goToLogin}>
        Login/SignIn
      </button>
    </div>
  );
}

export default SignInBtn;
