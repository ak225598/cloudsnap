import { useState } from "react";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";

export default function UploadComponent() {
  const [mediaUrls, setMediaUrls] = useState([]);

  const handleMediaUpload = async (uploadedMediaUrl) => {
    try {
      const res = await axios.get("/api/users/getUserDetails");
      console.log("User details fetched successfully");
      const body = {
        email: res.data.data.email,
        link: uploadedMediaUrl,
      };
      console.log("The body is ", body);
      try {
        const resp = await axios.post("/api/users/mediaDB", body);
        console.log("Media URL uploaded to DB", resp);
        setMediaUrls((prevUrls) => [...prevUrls, uploadedMediaUrl]);
      } catch (error) {
        console.error("Error uploading media URL to DB", error);
      }
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  const onUploadSuccess = (response) => {
    console.log("Upload response", response);
    const uploadedMediaUrl = response.info.secure_url;
    console.log("Uploaded URL: ", uploadedMediaUrl);
    handleMediaUpload(uploadedMediaUrl);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-xl shadow-lg bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">
          Media Uploader
        </h1>
        <p className="text-gray-600 mb-6">
          Upload images and videos in various formats.
          <br />
          Ensure images are within the size limit of 10 MB and videos are within
          100 MB.
        </p>
        <CldUploadWidget
          signatureEndpoint="/api/users/mediaUpload"
          onSuccess={onUploadSuccess}
        >
          {({ open }) => (
            <button
              onClick={open}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md shadow-md transition duration-300 ease-in-out"
            >
              Upload Media
            </button>
          )}
        </CldUploadWidget>
      </div>

      {mediaUrls.length > 0 && (
        <div className="mt-10">
          <h1 className="text-3xl font-semibold mb-4 text-gray-800">
            Uploaded Media
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaUrls.map((url, index) =>
              url.endsWith(".mp4") ||
              url.endsWith(".avi") ||
              url.endsWith(".mov") ? (
                <div
                  key={index}
                  className="w-full h-64 p-2 border rounded-lg shadow-md bg-white"
                >
                  <video
                    controls
                    className="w-full h-full object-contain rounded-lg"
                  >
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div
                  key={index}
                  className="w-full h-64 p-2 border rounded-lg shadow-md bg-white"
                >
                  <img
                    src={url}
                    alt="Uploaded Media"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              )
            )}
          </div>
          <p className="text-gray-600 mt-6 text-center">
            Your media has been successfully uploaded. You can upload another
            file if needed.
          </p>
        </div>
      )}
    </div>
  );
}
