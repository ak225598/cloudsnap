"use client";
import { useState, useEffect } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-black mt-32">
      <h1 className="text-3xl font-medium mb-8">
        Just a moment... We're setting up your account!
      </h1>
      <div className="w-64 h-4 bg-gray-300 rounded-full overflow-hidden shadow-lg">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
