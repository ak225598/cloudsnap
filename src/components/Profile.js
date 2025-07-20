import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, logoutUser } from "../app/home/profileSlice";
import LoadingSpinner from "./LoadingSpinner";
import { formatDateLastLogin, formatDateMemberSince } from "@/helpers/utils";

function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/login");
  };

  if (profile.status === "loading") return <LoadingSpinner />;

  return (
    <div className="flex flex-col items-center p-8 rounded-lg shadow-lg bg-white m-5">
      <div className="w-full max-w-lg">
        <div className="flex items-center mb-6">
          <img
            src="/user.png"
            alt="Profile Picture"
            className="w-24 h-24 rounded-full mr-4 shadow-md"
          />
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-2">Account Details</h3>
          <p>
            <strong>Last Login:</strong>{" "}
            {formatDateLastLogin(profile.lastLogin)}
          </p>
          <p>
            <strong>Member Since:</strong>{" "}
            {formatDateMemberSince(profile.memberSince)}
          </p>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 focus:outline-none"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
