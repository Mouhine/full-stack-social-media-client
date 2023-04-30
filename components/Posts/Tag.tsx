import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface Tag {
  id: string;
  body: string;
}
type Props = {
  tag: Tag;
  deleteTag: (id: any) => void;
};

const Tag = ({ tag, deleteTag }: Props) => {
  return (
    <div
      key={tag.id}
      className='flex items-center p-1 rounded-xl bg-[#f3f3f3] text-slate-700'
    >
      {"#" + " " + tag.body}

      <button
        onClick={() => deleteTag(tag.id)}
        className='w-[20px] h-[20px] rounded-xl ml-2 border grid place-content-center '
      >
        <AiOutlineClose />
      </button>
    </div>
  );
};

export default Tag;
