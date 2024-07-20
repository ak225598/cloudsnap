import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

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

  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handlePasswordChange = async () => {
    if (!validatePassword(newPassword)) {
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
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
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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

  const togglePasswordVisibility = (passwordType) => {
    switch (passwordType) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      case "delete":
        setShowDeletePassword(!showDeletePassword);
        break;
    }
  };

  return (
    <>
      <style jsx global>{`
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
      `}</style>
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
                <div className="relative mb-4">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Current Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    <Image
                      src={showCurrentPassword ? "/hide.png" : "/view.png"}
                      alt={
                        showCurrentPassword ? "Hide password" : "Show password"
                      }
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
                <div className="relative mb-4">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    className={`w-full p-3 pr-10 border ${
                      passwordError ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                    placeholder="New Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    <Image
                      src={showNewPassword ? "/hide.png" : "/view.png"}
                      alt={showNewPassword ? "Hide password" : "Show password"}
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
                <div className="relative mb-4">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full p-3 pr-10 border ${
                      passwordError ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                    placeholder="Confirm New Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    <Image
                      src={showConfirmPassword ? "/hide.png" : "/view.png"}
                      alt={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1 mb-4">
                    {passwordError}
                  </p>
                )}
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
            <div className="relative mb-4">
              <input
                type={showDeletePassword ? "text" : "password"}
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Current Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility("delete")}
              >
                <Image
                  src={showDeletePassword ? "/hide.png" : "/view.png"}
                  alt={showDeletePassword ? "Hide password" : "Show password"}
                  width={20}
                  height={20}
                />
              </button>
            </div>
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