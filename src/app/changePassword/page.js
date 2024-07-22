"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Background from "@/components/Background";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ChangePasswordPage = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    if (urlToken == null) {
      router.push("/login");
    }
    setToken(urlToken || "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const body = {
        token: token,
        password: newPassword,
      };

      const res = await axios.post("/api/users/changePassword", body);
      router.push("/login");
      setTimeout(() => {
        toast.success("Password reset successfully");
      }, 1000);
    } catch (error) {
      toast.error("Password reset failed");
    }
  };

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPasswordToggle = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
      <Background />
      <div className="w-96 mx-auto mt-12 bg-white border border-gray-200 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl text-center text-purple-800 font-semibold mb-8">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="newPassword"
              className="block text-lg font-medium text-gray-700"
            >
              New Password:
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrorMessage("");
                }}
                className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                onClick={handleShowPasswordToggle}
              >
                <Image
                  src={showPassword ? "/hide.png" : "/view.png"}
                  alt={showPassword ? "Hide password" : "Show password"}
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-lg font-medium text-gray-700"
            >
              Confirm New Password:
            </label>
            <div className="relative mt-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorMessage("");
                }}
                className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                onClick={handleShowConfirmPasswordToggle}
              >
                <Image
                  src={showConfirmPassword ? "/hide.png" : "/view.png"}
                  alt={showConfirmPassword ? "Hide password" : "Show password"}
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>
          {errorMessage && (
            <p className="text-red-500 mb-6 text-center">{errorMessage}</p>
          )}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-32 py-3 bg-purple-600 hover:bg-purple-800 text-white font-bold rounded-lg transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePasswordPage;
