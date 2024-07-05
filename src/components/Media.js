import React, { useState, useEffect } from "react";
import axios from "axios";

function MediaCard({ mediaUrl, deletelink }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getFileType = (url) => {
    if (!url) return "image";
    const extension = url.split(".").pop();
    switch (extension) {
      case "mp4":
        return "video";
      case "pdf":
        return "pdf";
      default:
        return "image";
    }
  };

  const handleDelete = async () => {
    // console.log("delete clicked");
    // console.log(mediaUrl);
    try {
      const body = {
        mediaUrl: mediaUrl,
      };
      const res = await axios.post("/api/users/deleteMedia", body);
      // console.log(res);
    } catch (error) {
      console.error("Error deleting media:", error);
    }
    deletelink();
  };

  const handleVideoClick = (e) => {
    e.preventDefault();
  };

  const renderMedia = () => {
    const type = getFileType(mediaUrl);
    switch (type) {
      case "video":
        return (
          <video
            className="w-full h-full object-contain border rounded-t-lg p-4"
            controls
            onClick={handleVideoClick}
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        );
      case "pdf":
        return (
          <embed
            className="w-full h-full object-contain border rounded-t-lg p-4"
            src={mediaUrl}
            type="application/pdf"
          />
        );
      default:
        return (
          <img
            className="w-full h-full object-contain border rounded-t-lg p-4"
            src={mediaUrl}
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
        <div className="p-4 flex justify-end items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="py-1"
          >
            <img src="/delete.png" className="w-4 h-4" alt="Delete" />
          </button>
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
      console.log(error);
    }
  };

  const handleDeleteLink = () => {
    getUserDetails(); // Refresh user details after deletion
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4 text-left">Your Media Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {userData?.media.map((mediaUrl, index) => (
          <MediaCard
            key={index}
            mediaUrl={mediaUrl}
            deletelink={handleDeleteLink}
          />
        ))}
      </div>
    </div>
  );
}

export default Media;
