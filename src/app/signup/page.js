"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Background from "@/components/Background";
import Image from "next/image";
import { signIn } from "next-auth/react";

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

  const googleSignUp = async () => {
    await signIn("google");
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
      <div className="flex justify-center items-center mt-4">
        <div className="bg-white border-2 border-purple-300 rounded-lg shadow-lg p-8 w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Join Us!</h1>
            <p className="mt-2 text-sm text-gray-600">Create your account</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={onSignUp}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="John Doe"
                    value={user.username}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={`appearance-none block w-full px-3 py-2 border ${
                      emailError ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                    placeholder="you@example.com"
                    value={user.email}
                    onChange={handleInputChange}
                  />
                </div>
                {emailError && (
                  <p className="mt-2 text-sm text-red-600">{emailError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className={`appearance-none block w-full px-3 py-2 border ${
                      passwordError ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
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
                  <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={buttonDisabled}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  buttonDisabled
                    ? "bg-purple-300 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                } transition duration-150 ease-in-out`}
              >
                Sign up
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={googleSignUp}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
              >
                <Image
                  src="/google.png"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Google
              </button>
            </div>
          </div>
          <div className="text-sm text-center">
            <Link
              href="/login"
              className="font-medium text-purple-600 hover:text-purple-500 transition duration-150 ease-in-out"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
