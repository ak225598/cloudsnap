import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Download, Copy, Share2, Star, MoreVertical } from "lucide-react";
import axios from "axios";
import getFileType from "@/helpers/getFileType";

function MediaCard({ media, deleteMedia }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isFav, setIsFav] = useState(media.isFav);
  const optionsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setIsOptionsOpen(false);
        setIsShareMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle media deletion
  const handleDelete = async () => {
    try {
      deleteMedia(media.url);
      await axios.post("/api/cloudinary/delete-asset", { url: media.url });
      await axios.post("/api/users/deleteMedia", { mediaUrl: media.url });
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const handleVideoClick = (e) => {
    e.preventDefault();
  };

  // Function to handle download
  const handleDownload = async () => {
    try {
      const response = await fetch(media.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = media.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(media.url);
    toast.success("Link successfully copied!", {
      style: {
        background: "#ffffff",
        color: "#333333",
        border: "1px solid #dddddd",
        borderLeft: "4px solid #4caf50",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.08)",
        padding: "14px 18px",
        fontSize: "14px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      },
      iconTheme: {
        primary: "#4caf50",
        secondary: "#ffffff",
      },
      duration: 2000,
    });
  };

  const handleShare = (platform) => {
    let shareUrl;
    switch (platform) {
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          media.url
        )}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
          media.url
        )}&media=${encodeURIComponent(
          media.url
        )}&description=${encodeURIComponent(media.name)}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          media.url
        )}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          media.url
        )}`;
        break;
      default:
        console.log("Unsupported platform");
        return;
    }
    window.open(shareUrl, "_blank");
  };

  const handleSetFavourite = async () => {
    setIsFav(!isFav);
    await axios.post("/api/users/setFav", { mediaUrl: media.url });
  };

  // Function to render appropriate media type
  const renderMedia = (isModal = false) => {
    const type = getFileType(media.url);
    switch (type) {
      case "video":
        return (
          <div className="relative w-full h-full">
            <video
              className="w-full h-full object-contain"
              controls={isModal}
              autoPlay={isModal}
              onClick={handleVideoClick}
            >
              <source src={media.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {!isModal && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-8 h-8 text-gray-400 opacity-100" />
              </div>
            )}
          </div>
        );
      case "pdf":
        if (isModal) {
          return (
            <embed
              className="w-full h-full object-contain border rounded-t-lg p-4"
              src={media.url}
              type="application/pdf"
            />
          );
        } else {
          return (
            <div className="w-full h-full overflow-hidden object-contain">
              <embed
                src={`${media.url}#view=FitH`}
                className="w-full h-full"
                type="application/pdf"
              />
            </div>
          );
        }
      default:
        return (
          <img
            className="w-full h-full object-contain"
            src={media.url}
            alt={media.name}
          />
        );
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div
        className="max-w-xs w-full bg-white rounded-lg overflow-hidden shadow-md m-4 cursor-pointer transform transition-transform hover:scale-105"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-48 border rounded-t-lg p-4">
          {renderMedia(false)}
        </div>
        <div className="p-4 flex justify-between items-center">
          <span className="text-sm text-gray-500 truncate">{media.name}</span>
          <div className="relative flex justify-normal" ref={optionsRef}>
            <button
              className="w-8 h-8 flex items-center justify-center focus:outline-1 rounded-full hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                handleSetFavourite();
              }}
            >
              <Star
                className="w-4 h-4 transition-all duration-200"
                fill={isFav ? "#daad0b" : "none"}
                stroke={isFav ? "#daad0b" : "currentColor"}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOptionsOpen(!isOptionsOpen);
                setIsShareMenuOpen(false);
              }}
              className="w-8 h-8 flex items-center justify-center focus:outline-1 rounded-full hover:bg-gray-200"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {isOptionsOpen && (
              <div className="py-1 absolute right-0 bottom-full mb-2 w-40 bg-slate-100 rounded-md overflow-hidden shadow-xl z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                    setIsOptionsOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                    setIsOptionsOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsShareMenuOpen(!isShareMenuOpen);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                {isShareMenuOpen && (
                  <div className="px-4 py-2 flex justify-around">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare("whatsapp");
                        setIsOptionsOpen(false);
                        setIsShareMenuOpen(false);
                      }}
                    >
                      <img
                        src="/whatsapp.png"
                        className="w-6 h-6 hover:scale-110"
                        alt="WhatsApp"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare("facebook");
                        setIsOptionsOpen(false);
                        setIsShareMenuOpen(false);
                      }}
                    >
                      <img
                        src="/facebook.png"
                        className="w-6 h-6 hover:scale-110"
                        alt="Facebook"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare("x");
                        setIsOptionsOpen(false);
                        setIsShareMenuOpen(false);
                      }}
                    >
                      <img
                        src="/x.png"
                        className="w-6 h-6 hover:scale-110"
                        alt="X"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare("pinterest");
                        setIsOptionsOpen(false);
                        setIsShareMenuOpen(false);
                      }}
                    >
                      <img
                        src="/pinterest.png"
                        className="w-6 h-6 hover:scale-110"
                        alt="Pinterest"
                      />
                    </button>
                  </div>
                )}
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
            <div className="m-4 h-96 p-4">{renderMedia(true)}</div>
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

export default MediaCard;
