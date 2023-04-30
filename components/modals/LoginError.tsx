import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useAuth } from "../../context/useAuth";
import { motion } from "framer-motion";
import Link from "next/link";
interface LoginErrorType {
  msg: string;
}
const LoginErrorModal = ({ msg }: LoginErrorType) => {
  const { setopenErrorLoginModal } = useAuth();
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="w-full overflow-hidden h-[100vh] z-10 fixed inset-0 backdrop-blur-sm grid place-items-center "
    >
      <article className="bg-white border rounded-lg max-w-[500px] w-[95%] pb-4 shadow relative ">
        <button
          className="absolute top-1 right-1 p-1 rounded-full border shadow"
          onClick={() => setopenErrorLoginModal(false)}
        >
          <AiOutlineCloseCircle size={24} />
        </button>
        <div className="grid place-items-center p-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/155/155714.png?w=740&t=st=1672996970~exp=1672997570~hmac=e57f96fc312749f4f76048c7a6be70431674c6e8db5e97058d3d467ee64edc57"
            alt=""
            className="rouded-lg w-[100px] h-[100px] "
          />
        </div>
        <div className="p-4">
          <p className="text-sm text-[#686868] font-mono text-center">{msg}</p>
        </div>
        <div className="grid place-items-center px-4 text-sm space-y-3 w-full  ">
          <button
            className=" w-full py-1 border mx-4 border-[#3b49de] rounded shadow "
            onClick={() => setopenErrorLoginModal(false)}
          >
            cancel
          </button>
          <Link href={"/auth/register"} className="w-full  ">
            <button
              className=" w-full py-1  border border-[#3b49de] rounded shadow "
              onClick={() => setopenErrorLoginModal(false)}
            >
              create account
            </button>
          </Link>
        </div>
      </article>
    </motion.div>
  );
};

export default LoginErrorModal;
