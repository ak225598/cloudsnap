"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Background from "@/components/Background";
import Loader from "@/components/loader";

function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisable] = useState(true);
  const [loader, setLoader] = useState(false);

  const onSignUp = async (event) => {
    event.preventDefault();
    if (!user.email || !user.password || !user.username) {
      toast.error("Please fill out all the fields");
      return;
    }
    try {
      setLoader(true);
      const response = await axios.post("api/users/signup", user);
      setLoader(false);
      // console.log("signup Success", response.data);
      router.push("/login");
      toast.success("Sign up success");
      setTimeout(() => {
        toast.success("Check your email for verification", {
          duration: 5000,
        });
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Sign up failed");
      // console.log("signup failed");
      // console.log(error.response.data);
      setLoader(false);
    }
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const isDisabled = !(user.email && user.password && user.username);
    setButtonDisable(isDisabled);
  }, [user]);

  return (
    <>
      <Toaster position="top-right" />
      <Background />
      {!loader && (
        <div className="flex justify-center items-center mt-8">
          <div className="bg-white border-2 border-purple-300 rounded-lg p-6 flex flex-col gap-5 items-center justify-center shadow-lg w-[350px]">
            <h1 className="text-4xl font-semibold text-purple-800">Join Us!</h1>
            <form className="w-full max-w-md" onSubmit={onSignUp}>
              <div className="mb-4 w-full">
                <label htmlFor="username" className="block text-gray-700 mb-2">
                  Name
                </label>
                <input
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
                  type="text"
                  name="username"
                  id="username"
                  placeholder="john doe"
                  value={user.username}
                  onChange={handleInputChange}
                />
              </div>
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
                  placeholder="••••••••"
                  value={user.password}
                  onChange={handleInputChange}
                />
              </div>
              <button
                type="submit"
                className={`w-full px-4 py-2 ${
                  buttonDisabled
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white font-semibold rounded-lg transition duration-200`}
                disabled={buttonDisabled}
              >
                Signup
              </button>
            </form>
            <div className="pt-1">
              <Link href="/login" className="text-purple-600 hover:underline">
                Have an account? Log in
              </Link>
            </div>
          </div>
        </div>
      )}
      {loader && <Loader />}
    </>
  );
}

export default SignupPage;
