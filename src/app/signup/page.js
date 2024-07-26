"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Background from "@/components/Background";
import Image from "next/image";

function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisable] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const onSignUp = async (event) => {
    event.preventDefault();
    if (!user.email || !user.password || !user.username) {
      toast.error("Please fill out all the fields");
      return;
    }
    if (emailError || passwordError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    toast.promise(axios.post("api/users/signup", user), {
      loading: "Signing up...",
      success: () => {
        router.push("/login");
        setTimeout(() => {
          toast.success("Verification email sent! Please check your inbox.", {
            duration: 3000,
          });
        }, 3000);
        return "Sign up successful";
      },
      error: (err) => `${err.response?.data?.error || "Unknown error"}`,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    if (name === "email") {
      validateEmail(value);
    } else if (name === "password") {
      validatePassword(value);
    }
  };

  const validateEmail = (email) => {
    const validDomains = ["gmail.com", "outlook.com", "yahoo.com"];
    const domain = email.split("@")[1];
    if (!validDomains.includes(domain)) {
      setEmailError("Please use a valid email from gmail, outlook, or yahoo");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else {
      setPasswordError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const isDisabled = !(
      user.email &&
      user.password &&
      user.username &&
      !emailError &&
      !passwordError
    );
    setButtonDisable(isDisabled);
  }, [user, emailError, passwordError]);

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
      <div className="flex justify-center items-center mt-5">
        <div className="bg-white border-2 border-purple-300 rounded-lg p-6 flex flex-col gap-3 items-center justify-center shadow-lg w-[350px]">
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
                  className={`w-full px-4 py-2 pr-10 border ${
                    passwordError ? "border-red-500" : "border-purple-300"
                  } rounded-lg focus:outline-none focus:border-purple-600`}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
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
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
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
    </>
  );
}

export default SignupPage;
