"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Background from "@/components/Background";

function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("/api/users/login", user);
      toast.success("Login success");
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (error) {
      // console.log("login failed ", error);
      toast.error(error.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!user.email || !user.password) {
      toast.error("Please enter email and password");
      return;
    }
    onLogin(event);
  };

  return (
    <>
      <Toaster position="top-right" />
      <Background />
      <div className="flex justify-center items-center mt-8">
        <div className="bg-white border-2 border-purple-300 rounded-lg p-10 flex flex-col gap-6 items-center justify-center shadow-lg">
          <h1 className="text-4xl font-semibold text-purple-800">
            Welcome Back!
          </h1>
          <form className="w-full max-w-md">
            <div className="mb-4 w-full">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                E-mail
              </label>
              <input
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
                type="email"
                name="email"
                id="email"
                placeholder="john.doe@example.com"
                value={user.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4 w-full">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••••"
                value={user.password}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className={`w-full px-4 py-2 ${
                !user.email || !user.password
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white font-semibold rounded-lg transition duration-200`}
              disabled={!user.email || !user.password}
              onClick={handleFormSubmit}
            >
              Sign In
            </button>
          </form>
          <div className="flex gap-3 flex-col justify-center items-center w-full">
            <Link
              href="/forgotPassword"
              className="text-purple-600 hover:underline mb-2 md:mb-0"
            >
              Forgot password?
            </Link>
            <Link href="/signup" className="text-purple-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
