"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Background from "@/components/Background";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ChangePasswordPage = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    // console.log(urlToken);
    setToken(urlToken || "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const body = {
        token: token,
        password: newPassword,
      };

      const res = await axios.post("/api/users/changePassword", body);
      // console.log(res);
      router.push("/login");
      setTimeout(() => {
        toast.success("Password reset successfully");
      }, 1000);
    } catch (error) {
      // console.log("Error resetting password:", error);
      toast.error("Password reset failed");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Background />
      <div className="w-80 mx-auto max-w-lg bg-white border-2 border-purple-300 rounded-lg p-8 mt-12">
        <h1 className="text-3xl text-purple-800 font-bold mb-6 text-center">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="newPassword" className="block text-md font-medium">
              New Password:
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
            />
          </div>
          {/* {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}  */}
          <div className="flex justify-center mt-5">
            <button
              type="submit"
              className="w-28 px-4 py-2 bg-purple-600 hover:bg-purple-800 text-white font-semibold rounded-md transition duration-200"
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
