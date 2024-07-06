"use client";
import React, { useState } from "react";
import Profile from "@/components/Profile";
import UploadComponent from "@/components/MediaUploader";
import Media from "@/components/Media";
import Help from "@/components/Help";
import Settings from "@/components/Settings";

const components = {
  media: Media,
  upload: UploadComponent,
  help: Help,
  settings: Settings,
  profile: Profile,
};

function Home() {
  const [activeComponent, setActiveComponent] = useState("media");

  const NavItem = ({ component, imgSrc, alt, children }) => (
    <div
      className="flex items-center cursor-pointer py-2 px-4 rounded-md hover:bg-gray-300"
      onClick={() => {
        setActiveComponent(component);
        window.history.pushState(null, "", `/home/${component}`);
      }}
    >
      <img src={imgSrc} alt={alt} className="w-6 h-6 mr-3" />
      <span>{children}</span>
    </div>
  );

  const ActiveComponent = components[activeComponent] || Media;

  return (
    <div className="flex h-screen">
      <div className="w-64 flex flex-col justify-between p-5 rounded-r-xl shadow-lg fixed top-0 left-0 h-full bg-white">
        <div>
          <img
            src="/logo.png"
            alt="Logo"
            className="w-40 h-32 mb-5 mx-2 rounded-sm opacity-90"
          />
          <NavItem component="media" imgSrc="/gallery.png" alt="Uploaded Media">
            Media
          </NavItem>
          <NavItem component="upload" imgSrc="/upload.png" alt="Upload">
            Upload
          </NavItem>
        </div>
        <div>
          <NavItem component="help" imgSrc="/question.png" alt="Help">
            Help
          </NavItem>
          <NavItem component="settings" imgSrc="/setting.png" alt="Settings">
            Settings
          </NavItem>
          <NavItem component="profile" imgSrc="/user.png" alt="Profile">
            Profile
          </NavItem>
        </div>
      </div>
      <div className="ml-64 flex-1 p-5">
        <ActiveComponent />
      </div>
    </div>
  );
}

export default Home;
