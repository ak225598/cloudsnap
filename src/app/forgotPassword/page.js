"use client";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Background from "@/components/Background";

export default function resetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = {
      email: email,
    };
    try {
      const res = await axios.post("/api/users/password-recovery-email", body);
      toast.success("Password reset instructions sent! Check your inbox");
    } catch (error) {
      // console.log(error.response.data);
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Background />
      <div className="w-96 mx-auto max-w-lg bg-white border-2 border-purple-300 rounded-lg p-8 mt-12 text-center">
        <h1 className="text-3xl font-bold text-center mt-2 mb-6 text-purple-800">
          Password Recovery
        </h1>
        <div className="relative py-4">
          <div className="flex justify-center items-center">
            <form className="flex flex-col gap-6">
              <label
                htmlFor="input-box"
                className="text-lg font-semibold text-purple-700"
              >
                Enter your Email for Password recovery
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
                  type="email"
                  name="input-box"
                  placeholder="Your Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className={`w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200`}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
          <p className="mt-8 text-sm text-gray-600 text-center">
            An email with password recovery instructions will be sent to the
            provided address.
          </p>
        </div>
      </div>
    </>
  );
}
