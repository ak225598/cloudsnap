"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Background from "@/components/Background";
import Image from "next/image";

function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const onLogin = async (event) => {
    event.preventDefault();
    if (!user.email || !user.password) {
      toast.error("Please enter email and password");
      return;
    }
    if (emailError) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const res = await axios.post("/api/users/login", user);
      toast.success("Login success");
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    if (name === "email") {
      validateEmail(value);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password && !emailError));
  }, [user, emailError]);

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
      <div className="flex justify-center items-center mt-7">
        <div className="bg-white border-2 border-purple-300 rounded-lg p-10 flex flex-col gap-6 items-center justify-center shadow-lg">
          <h1 className="text-4xl font-semibold text-purple-800">
            Welcome Back!
          </h1>
          <form className="w-full max-w-md" onSubmit={onLogin}>
            <div className="mb-4 w-full">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                E-mail
              </label>
              <input
                className={`w-full px-4 py-2 border ${
                  emailError ? "border-red-500" : "border-purple-300"
                } rounded-lg focus:outline-none focus:border-purple-600`}
                type="email"
                name="email"
                id="email"
                placeholder="john.doe@example.com"
                value={user.email}
                onChange={handleInputChange}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            <div className="mb-4 w-full">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2 pr-10 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••••"
                  value={user.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  <Image
                    src={showPassword ? "/hide.png" : "/view.png"}
                    alt={showPassword ? "Hide password" : "Show password"}
                    width={20}
                    height={20}
                  />
                </button>
              </div>
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
