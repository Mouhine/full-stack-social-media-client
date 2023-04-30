import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { BiLogOut } from "react-icons/bi";
import { RxUpdate } from "react-icons/rx";
import { AiFillDelete } from "react-icons/ai";
import { useAuth } from "../../context/useAuth";
import { UserType } from "../../types";
type Props = {
  handleLogout: () => Promise<void>;
  user: UserType;
  handleDeleteUser: () => Promise<void>;
};

function Menu({ handleLogout, user, handleDeleteUser }: Props) {
  const { auth } = useAuth();
  return (
    <motion.div
      className='rounded  border shadow p-2 bg-white absolute -end-4 -right-16 w-[200px]   '
      initial={{
        opacity: 0,
        y: 80,
      }}
      animate={{
        opacity: 1,
        y: 100,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <ul className=' flex flex-col space-y-2 '>
        <li
          className=' flex items  rounded-lg py-1 duration-00 cursor-pointer'
          onClick={handleLogout}
        >
          <BiLogOut className='mr-4' size={20} />
          <span className='text-sm'>LogOut</span>
        </li>

        <Link href={`/update_Profile/${auth.userId}`}>
          <li className=' flex items  rounded-lg py-1 duration-00 cursor-pointer '>
            <Link
              href={`/updateProfile/${user._id}`}
              className='flex items-center space-x-4'
            >
              <RxUpdate /> <span className='text-sm'>update profile</span>
            </Link>
          </li>
        </Link>
        <li
          className=' flex items hover:bg-red-500 hover:text-white rounded-lg py-2 px-1 duration-00 cursor-pointer '
          onClick={handleDeleteUser}
        >
          <AiFillDelete className='mr-4' size={20} />
          <span className='text-sm'>delete account</span>
        </li>
      </ul>
    </motion.div>
  );
}

export default Menu;
