import React, { useState, useEffect } from "react";
import axios from "axios";
import { MoreVertical } from "lucide-react";

const getFileType = (url) => {
  if (!url) return "image";
  const extension = url.split(".").pop().toLowerCase();
  switch (extension) {
    case "mp4":
      return "video";
    case "pdf":
      return "pdf";
    default:
      return "image";
  }
};

function MediaCard({ media, deleteMedia }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.post("/api/users/deleteMedia", { mediaUrl: media.url });
      deleteMedia(media.url);
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const handleVideoClick = (e) => {
    e.preventDefault();
  };

  const renderMedia = () => {
    const type = getFileType(media.url);
    switch (type) {
      case "video":
        return (
          <video
            className="w-full h-full object-contain border rounded-t-lg p-4"
            controls
            onClick={handleVideoClick}
          >
            <source src={media.url} type="video/mp4" />
          </video>
        );
      case "pdf":
        return (
          <embed
            className="w-full h-full object-contain border rounded-t-lg p-4"
            src={media.url}
            type="application/pdf"
          />
        );
      default:
        return (
          <img
            className="w-full h-full object-contain border rounded-t-lg p-4"
            src={media.url}
            alt="Media"
          />
        );
    }
  };

  return (
    <>
      <div
        className="max-w-xs w-full bg-white rounded-lg overflow-hidden shadow-md m-4 cursor-pointer transform transition-transform hover:scale-105"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-48">{renderMedia()}</div>
        <div className="p-4 flex justify-between items-center">
          <span className="text-sm text-gray-500 truncate">{media.name}</span>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOptionsOpen(!isOptionsOpen);
              }}
              className="w-8 h-8 flex items-center justify-center focus:outline-1 rounded-full hover:bg-gray-200"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {isOptionsOpen && (
              <div className="py-2 absolute right-0 bottom-full mb-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                    setIsOptionsOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full"
                >
                  <img
                    src="/delete.png"
                    className="w-4 h-4 mr-2"
                    alt="Delete"
                  />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-3xl max-h-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2"
            >
              <img src="/close.png" className="w-6 h-6" alt="Close" />
            </button>
            <div className="m-4 h-96 p-4">{renderMedia()}</div>
            <div className="p-4">
              <h2 className="text-xl font-bold">{media.name}</h2>
              <p className="text-sm text-gray-500">
                Uploaded on: {new Date(media.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Media() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/getUserDetails");
      setUserData(res.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleDeleteLink = () => {
    getUserDetails(); // Refresh user details after deletion
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4 text-left">Your Media Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {userData?.media.map((media, index) => (
          <MediaCard key={index} media={media} deleteMedia={handleDeleteLink} />
        ))}
      </div>
    </div>
  );
}

export default Media;
