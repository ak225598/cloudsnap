"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Background from "@/components/Background";

function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);

  const verifyUserEmail = async () => {
    try {
      const res = await axios.post("/api/users/verifyEmail", { token });
      setVerified(true);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <>
      <Toaster position="top-right" />
      <Background />
      <div className="mx-auto max-w-lg bg-white border-2 border-purple-300 rounded-lg p-8 mt-12 text-center">
        <h1 className="text-4xl text-purple-800 font-bold mb-6">
          Email Verification
          <div className="mb-4 border-b-2 border-purple-600 mt-2"></div>
        </h1>
        {verified && (
          <div className="mb-8">
            <h2 className="text-lg text-gray-800 mb-2">
              Email verification successful. You can now log in by clicking the
              button below.
            </h2>
            <h2 className="text-lg text-gray-800 mt-2">
              You're now ready to securely store your photos and videos with us.
            </h2>
          </div>
        )}
        <button
          type="submit"
          className="w-40 px-4 py-2 bg-purple-600 hover:bg-purple-800 text-white font-semibold rounded-md transition duration-200"
        >
          <Link href="/login">Login Now</Link>
        </button>
      </div>
    </>
  );
}

export default VerifyEmailPage;
