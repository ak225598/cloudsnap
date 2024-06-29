import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function Profile() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/getUserDetails");
      console.log(res);
      setUserData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDateMemberSince = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateLastLogin = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 rounded-lg shadow-lg bg-white m-5">
      {userData ? (
        <div className="w-full max-w-lg">
          <div className="flex items-center mb-6">
            <img
              src="/user.png"
              alt="Profile Picture"
              className="w-24 h-24 rounded-full mr-4 shadow-md"
            />
            <div>
              <h2 className="text-2xl font-bold">{userData.username}</h2>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-2">Account Details</h3>
            <p>
              <strong>Last Login:</strong>{" "}
              {formatDateLastLogin(userData.lastLogin)}
            </p>
            <p>
              <strong>Member Since:</strong>{" "}
              {formatDateMemberSince(userData.createdAt)}
            </p>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 focus:outline-none"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
