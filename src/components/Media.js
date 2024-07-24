import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { MoreVertical, Search, ChevronDown, Play } from "lucide-react";
import { Download, Copy } from "lucide-react";

// Helper function to determine the file type
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

// Mediacard component to display individual media items
function MediaCard({ media, deleteMedia }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const optionsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setIsOptionsOpen(false);
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
      await axios.post("/api/users/deleteMedia", { mediaUrl: media.url });
      deleteMedia(media.url);
      await axios.post("/api/cloudinary/delete-asset", { url: media.url });
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const handleVideoClick = (e) => {
    e.preventDefault();
  };

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
    toast.success("Link copied to clipboard");
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
          <div className="relative" ref={optionsRef}>
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

// Custom dropdown component for sorting and filtering
function CustomDropdown({ options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-between items-center w-full rounded-full border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                className={`${
                  option.value === value
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700"
                } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900`}
                role="menuitem"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Media component
function Media() {
  const [userData, setUserData] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserDetails();
  }, []);

  // Function to fetch user details
  const getUserDetails = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/users/getUserDetails");
      setUserData(res.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMedia = (deletedUrl) => {
    setUserData((prevData) => ({
      ...prevData,
      media: prevData.media.filter((media) => media.url !== deletedUrl),
    }));
  };

  // Options for sorting and filtering
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
  ];

  const filterOptions = [
    { value: "all", label: "All Types" },
    { value: "image", label: "Images" },
    { value: "video", label: "Videos" },
    { value: "pdf", label: "PDFs" },
  ];

  const filteredAndSortedMedia = userData?.media
    .filter((media) => {
      const type = getFileType(media.url);
      return (
        (filterType === "all" || type === filterType) &&
        media.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "a-z":
          return a.name.localeCompare(b.name);
        case "z-a":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  return (
    <div className="container px-8 py-4">
      <h2 className="text-2xl font-semibold mb-6 text-left text-gray-900">
        Your Media Gallery
      </h2>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 pl-10 tx-sm font-medium text-gray-700 border rounded-full hover:bg-gray-100 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <CustomDropdown
          options={sortOptions}
          value={sortOrder}
          onChange={setSortOrder}
          placeholder="Sort by"
        />
        <CustomDropdown
          options={filterOptions}
          value={filterType}
          onChange={setFilterType}
          placeholder="Filter"
        />
      </div>
      {isLoading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredAndSortedMedia?.map((media, index) => (
            <MediaCard
              key={`${media.url}-${index}`}
              media={media}
              deleteMedia={handleDeleteMedia}
            />
          ))}
        </div>
      )}
      {!isLoading && filteredAndSortedMedia?.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No media found.</p>
      )}
    </div>
  );
}

export default Media;
