import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, ChevronDown } from "lucide-react";
import MediaCard from "./MediaCard";
import getFileType from "@/helpers/getFileType";
import LoadingSpinner from "./LoadingSpinner";

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
      const res = await axios.get("/api/users/getUserMedia");
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
          <LoadingSpinner />
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
