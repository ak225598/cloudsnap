import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Help Center</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {[
              {
                question: "How do I upload images?",
                answer:
                  "Go to the Upload Images section, then click the Upload Media button. An upload widget box will appear, allowing you to upload media. After uploading, you can close the widget.",
              },
              {
                question: "How do I manage my media?",
                answer:
                  "To manage your media, go to the Media section. From there, you can view and delete media.",
              },
              {
                question: "How do I change my settings?",
                answer:
                  "To change your settings, go to the Settings section. From there, you can change your name, password, and delete your account.",
              },
              {
                question: "Who can see my profile?",
                answer:
                  "No one can see your profile except you. Your profile is private and not visible to other users.",
              },
              {
                question: "What file formats are supported for uploads?",
                answer:
                  "We support various file formats for uploads, including JPEG, PNG, GIF, and MP4. Make sure your files are in one of these formats to ensure successful uploads.",
              },
              {
                question:
                  "Is there a limit to the number of files I can upload?",
                answer:
                  "Currently, there is no limit to the number of files you can upload. However, there is a maximum file size limit of 10MB for images and 100MB for videos.",
              },
              {
                question: "How do I contact support?",
                answer:
                  "If you need further assistance, please reach out to me via email at ankit.iiitbh@gmail.com",
              },
              {
                question: "How can I delete my account?",
                answer:
                  "To delete your account, go to the Settings section and click on 'Delete Account'. Follow the on-screen instructions to permanently delete your account.",
              },
            ].map((item, index) => (
              <div key={index} className="border-b">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left py-2 focus:outline-none flex justify-between items-center"
                >
                  <span>{item.question}</span>
                  <span>{openIndex === index ? "-" : "+"}</span>
                </button>
                {openIndex === index && (
                  <div className="pl-4 pb-2">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Contact Support
          </h2>
          <p className="mb-4 text-gray-700">
            If you need further assistance, please reach out to me:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-neutral-50 rounded-lg shadow hover:bg-blue-100 transition duration-300">
              <Image
                src="/gmail.png"
                alt="Email Icon"
                width={24}
                height={24}
                className="mr-3"
              />
              <div>
                <Link href="mailto:ankit.iiitbh@gmail.com" target="blank">
                  <span className="text-blue-500 hover:underline cursor-pointer">
                    ankit.iiitbh@gmail.com
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex items-center p-4 bg-neutral-50 rounded-lg shadow hover:bg-blue-100 transition duration-300">
              <Image
                src="/linkedin.png"
                alt="LinkedIn Icon"
                width={24}
                height={24}
                className="mr-3"
              />
              <div>
                <Link
                  href="https://www.linkedin.com/in/ankitkumar225/"
                  target="blank"
                >
                  <span className="text-blue-500 hover:underline cursor-pointer">
                    Ankit Kumar
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex items-center p-4 bg-neutral-50 rounded-lg shadow hover:bg-blue-100 transition duration-300">
              <Image
                src="/github.png"
                alt="GitHub Icon"
                width={24}
                height={24}
                className="mr-3"
              />
              <div>
                <Link href="https://github.com/ak225598" target="blank">
                  <span className="text-blue-500 hover:underline cursor-pointer">
                    Ankit Kumar
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
