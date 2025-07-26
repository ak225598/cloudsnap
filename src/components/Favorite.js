import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import MediaCard from "./MediaCard";
import LoadingSpinner from "./LoadingSpinner";

export default function Favorite() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getUserDetails();
  }, []);

  // Function to fetch user details
  const getUserDetails = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/users/getFavMedia");
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

  const favoriteMedia = userData?.media.filter((media) => {
    return media.isFav;
  });
  return (
    <div>
      <div className="container px-8 py-4">
        <h2 className="text-2xl font-semibold mb-6 text-left text-gray-900">
          Your Favorites
        </h2>
        {isLoading ? (
          <div className="text-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {favoriteMedia?.map((media, index) => (
              <MediaCard
                key={`${media.url}-${index}`}
                media={media}
                deleteMedia={handleDeleteMedia}
              />
            ))}
          </div>
        )}
        {!isLoading && favoriteMedia?.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No Favorites.</p>
        )}
      </div>
    </div>
  );
}
