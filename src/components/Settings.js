import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

function Settings() {
  const router = useRouter();
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeletePasswordPopupOpen, setIsDeletePasswordPopupOpen] = useState(false);
  const [isDeleteConfirmPopupOpen, setIsDeleteConfirmPopupOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/getUserDetails");
      setUserData(res.data.data);
      setNewUsername(res.data.data.username);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUsernameChange = async () => {
    try {
      const res = await axios.post("/api/users/changeUsername", {
        username: newUsername,
        email: userData.email,
      });
      toast.success("Username changed successfully");
      getUserDetails();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    try {
      const email = userData.email;
      const res = await axios.post("/api/users/updatePassword", {
        email,
        currentPassword,
        newPassword,
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      console.log("delete account called");
      const email = userData.email;
      const res = await axios.post("/api/users/deleteAccount", {
        email: email,
        password: deletePassword,
      });
      toast.success(res.data.message);
      router.push("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeletePasswordSubmit = () => {
    setIsDeletePasswordPopupOpen(false);
    setIsDeleteConfirmPopupOpen(true);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex flex-col flex-1 p-8 bg-white m-5 rounded-l-xl shadow-lg">
        {userData ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <p className="text-gray-600">
                Manage your account settings and set preferences.
              </p>
            </div>

            <div className="flex space-x-6 mb-6">
              <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-md w-1/3">
                <h3 className="text-lg font-semibold mb-4">Change Username</h3>
                <p className="text-gray-500 mb-4">
                  Update your username for a personalized experience.
                </p>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="New Username"
                />
                <button
                  onClick={handleUsernameChange}
                  className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  Save Username
                </button>
              </div>

              <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-md w-2/3">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <p className="text-gray-500 mb-4">
                  Ensure your account is secure by updating your password
                  regularly.
                </p>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Current Password"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="New Password"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Confirm New Password"
                />
                <button
                  onClick={handlePasswordChange}
                  className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  Save Password
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Delete Account</h3>
              <p className="text-gray-500 mb-4">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              <button
                onClick={() => setIsDeletePasswordPopupOpen(true)}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Delete Account
              </button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {isDeletePasswordPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Enter Current Password
            </h3>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Current Password"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeletePasswordPopupOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePasswordSubmit}
                className="px-4 py-2 bg-purple-500 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-500 mb-4">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteConfirmPopupOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsDeleteConfirmPopupOpen(false);
                  handleDeleteAccount();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;
