//@ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { v4 as uuid, v4 } from "uuid";
import {
  AiFillPlusCircle,
  AiOutlineClose,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import { FaLongArrowAltRight } from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAuth } from "../../context/useAuth";
import { UserType } from "../../types";
import { useRouter } from "next/router";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import usePost from "../../api/PostApi";
import CoverUploader from "./CoverUploader";
import Tag from "./Tag";

interface Tag {
  id: string;
  body: string;
}
const PostForm = () => {
  const router = useRouter();
  const { quill, quillRef } = useQuill();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [user, setUser] = useState({} as UserType);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tag, setTag] = useState<Tag>({
    id: "",
    body: "",
  });
  const [imageUrls, setImageUrls] = useState("");
  const [addPostLoading, setAddPostLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { auth, addLocalPost } = useAuth();
  const { addPost } = usePost();
  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        setBody(quill.root.innerHTML); // Get innerHTML using quill
      });
    }
  }, [quill, quillRef]);

  useEffect(() => {
    if (!auth.accessToken) router.push("/auth/login");
    const fetchUser = async () => {
      try {
        const userInfo = await axiosPrivate.get(`/users/${auth.userId}`);
        setUser(userInfo?.data?.user[0]);
      } catch (error) {}
    };
    fetchUser();
  }, [auth.accessToken]);

  const author = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    profile: user.profile,
    job: user.job,
    created_at: user.created_at,
  };

  const POST = {
    title: title,
    author,
    body: quill?.root?.innerHTML,
    date: Date.now(),
    cover: imageUrls,
    tags: tags,
    likes: 0,
    likedBy: [],
  };

  const deleteTag = (id) => {
    const newTags = tags.filter((tag) => tag.id !== id);
    setTags(newTags);
  };

  const handleAddTag = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tag.body === "") {
      notify("🦄 ! tag should not be empty");
      return;
    }
    setTags([...tags, tag]);
    setTag({
      id: "",
      body: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag({
      id: uuid(),
      body: e.target.value,
    });
  };

  const notify = (msg: string) => {
    toast.warn(msg, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const insertToEditor = (url) => {
    const range = quill.getSelection();
    quill.insertEmbed(range.index, "image", url);
  };

  const saveToServer = async (file) => {
    const body = new FormData();
    body.append("file", file);
    const imageRef = ref(storage, `images/posts/${file.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, file);
    await getDownloadURL(snapshot.ref)
      .then((url) => {
        insertToEditor(url);
      })
      .finally(() => {});
  };

  // Open Dialog to select Image File
  const selectLocalImage = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      saveToServer(file);
    };
  };

  useEffect(() => {
    if (quill) {
      // Add custom handler for Image Upload
      quill.getModule("toolbar").addHandler("image", selectLocalImage);
    }
  }, [quill]);

  const handelAddPost = async (POST) => {
    if (!POST.title) {
      toast.warn("title should not be empty");
      return;
    }
    setAddPostLoading(true);
    addLocalPost(POST);
    await addPost(POST, axiosPrivate);
    setAddPostLoading(false);
    router.push("/");
  };

  return (
    <div className='  flex justify-center  bg-[#f5f5f5] dark:bg-black dark:text-white min-h-[90vh]  space-y-2 '>
      <section className='max-w-4xl w-[95%] flex flex-col items-start gap-3 '>
        <section className='border relative shadow bg-white dark:bg-black dark:text-white p-4 rounded-lg mx-auto max-w-5xl w-[90%] place-content-center  '>
          <Link href={"/"}>
            <button className='absolute right-2  top-2  rounded-full w-8 h-8 grid place-content-center bg-[#3b49de] text-white '>
              <FaLongArrowAltRight />
            </button>
          </Link>

          <CoverUploader setImageUrls={setImageUrls} />

          <div className='mt-8'>
            <input
              type='text'
              name=''
              id=''
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='New post titel here... '
              className='w-full px-4 py-4 text-3xl dark:bg-black dark:text-white font-extrabold tracking-wider  text-[#525252]  outline-none'
            />
          </div>
          <div className='flex flex-wrap space-x-3 items-center'>
            <div className='flex flex-wrap space-x-1'>
              {tags?.map((tag) => {
                return <Tag deleteTag={deleteTag} tag={tag} />;
              })}
            </div>
            <form
              className='flex items-center justify-between w-full'
              onSubmit={handleAddTag}
            >
              <input
                type='text'
                placeholder='add tags... '
                className='w-full px-4 py-4 text-xl dark:bg-black dark:text-white  font-extrabold  text-[#525252]  outline-none'
                value={tag.body}
                onChange={handleChange}
              />
              <button className='rounded-full w-[30px] h-[30px] border grid place-items-center'>
                <AiFillPlusCircle size={24} />
              </button>
              <ToastContainer />
            </form>
          </div>
          <div className='w-[100%]    '>
            <div ref={quillRef} />
          </div>
        </section>
        <button
          className='  px-3 py-2 mx-auto max-w-5xl w-[90%] rounded border bg-[#3b49de]/70 hover:bg-[#3b49de] transition-opacity delay-150 text-white font-bold tracking-wide '
          onClick={() => {
            handelAddPost(POST);
          }}
        >
          {addPostLoading ? "Loading" : "Publish"}
        </button>
      </section>
    </div>
  );
};

export default PostForm;
