import React, { useState } from "react";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import { Upload, Image, Film } from "lucide-react";

export default function UploadComponent() {
  const [mediaItems, setMediaItems] = useState([]);

  const handleMediaUpload = async (uploadedMediaUrl, name) => {
    try {
      const res = await axios.get("/api/users/getUserDetails");

      const body = {
        email: res.data.data.email,
        link: uploadedMediaUrl,
        name,
      };

      await axios.post("/api/users/mediaDB", body);
      setMediaItems((prevItems) => [
        ...prevItems,
        { url: uploadedMediaUrl, name },
      ]);
    } catch (error) {
      console.error("Error in media upload process:", error);
    }
  };

  const onUploadSuccess = (response) => {
    const { secure_url, original_filename, format } = response.info;
    const name = `${original_filename}.${format}`;
    handleMediaUpload(secure_url, name);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-xl shadow-lg bg-white">
      <UploadHeader />
      <UploadButton onSuccess={onUploadSuccess} />
      {mediaItems.length > 0 && <MediaGallery mediaItems={mediaItems} />}
    </div>
  );
}

const UploadHeader = () => (
  <div className="text-center">
    <h1 className="text-4xl font-semibold mb-4 text-gray-800">
      Media uploader
    </h1>
    <p className="text-lg text-gray-600 mb-6">
      Seamlessly upload and manage your media files
    </p>
    <div className="flex justify-center items-center space-x-4 mb-6">
      <Image className="text-blue-500" size={24} />
      <Film className="text-green-500" size={24} />
    </div>
    <p className="text-sm text-gray-500">
      Supports a wide range of image and video formats
      <br />
      Ensure images are within the size limit of 10 MB and videos are within 100
      MB
    </p>
  </div>
);

const UploadButton = ({ onSuccess }) => (
  <CldUploadWidget
    signatureEndpoint="/api/users/mediaUpload"
    onSuccess={onSuccess}
  >
    {({ open }) => (
      <button
        onClick={open}
        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center space-x-2 text-lg font-semibold mt-6"
      >
        <Upload size={24} />
        <span>Upload Media</span>
      </button>
    )}
  </CldUploadWidget>
);

const MediaGallery = ({ mediaItems }) => (
  <div className="mt-12 w-full">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
      Your uploaded media
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {mediaItems.map((item, index) => (
        <MediaItem key={index} url={item.url} name={item.name} />
      ))}
    </div>
    <p className="text-gray-600 mt-8 text-center text-lg">
      Your media has been successfully added to your collection.
      <br />
      Feel free to upload more files as needed.
    </p>
  </div>
);

const MediaItem = ({ url, name }) => {
  const isVideo = /\.(mp4|avi|mov)$/i.test(url);
  return (
    <div className="w-full p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition duration-300">
      <div className="h-64 mb-3">
        {isVideo ? (
          <video controls className="w-full h-full object-contain rounded-lg">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={url}
            alt="Uploaded Media"
            className="w-full h-full object-contain rounded-lg"
          />
        )}
      </div>
      <p className="text-sm text-gray-600 truncate font-medium">{name}</p>
    </div>
  );
};
