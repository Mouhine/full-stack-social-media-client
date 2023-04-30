//@ts-nocheck
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { ChangeEvent, useState } from "react";
import { v4 as uuid, v4 } from "uuid";
import { storage } from "../../firebase";
import { toast } from "react-toastify";
import { AiOutlineCloseCircle, AiOutlineCloudUpload } from "react-icons/ai";

type Props = {
  setImageUrls: React.Dispatch<React.SetStateAction<string>>;
};

const CoverUploader = (props: Props) => {
  const [imageUpload, setImageUpload] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (imageUpload == null) return;

    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, imageUpload);

    await getDownloadURL(snapshot.ref)
      .then((url) => {
        props.setImageUrls(url);
      })
      .finally(() => {
        setLoading(true);
      });
  };

  const resetCover = () => {
    setImageUpload(null);
    setLoading(false);
    setImageUrls("");
  };

  return (
    <div className='flex flex-col space-y-4 items-start'>
      <label
        htmlFor='input-files'
        className='py-2 px-8 rounded z-10 border mb-4 dark:bg-black dark:text-white bg-white '
      >
        add cover
      </label>
      <input
        type='file'
        accept='image/*'
        id='input-files'
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setImageUpload(e.target.files[0]);
          setLoading(true);
        }}
        hidden
      />

      {loading && (
        <div className='h-[280px] w-[80%]  mx-auto  py-3 '>
          <img
            src={URL.createObjectURL(imageUpload)}
            alt=''
            className='w-full h-full object-fill shadow-md rounded-md '
          />
          <div className='flex items-center space-x-4 py-2'>
            <button className='border rounded-full p-2' onClick={resetCover}>
              <AiOutlineCloseCircle />
            </button>
            <button
              className='border rounded-full p-2'
              onClick={() => {
                uploadFile().then(() => {
                  toast.success("image uploaded");
                });
              }}
            >
              <AiOutlineCloudUpload />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverUploader;
