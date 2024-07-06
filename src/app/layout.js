import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cloudsnap",
  description:
    "CloudSnap is a free and easy way to store your photos and videos online. We keep your files safe and private; only you can see what you upload. Our platform offers a seamless and user-friendly experience for everyone. Are you looking for a safe place to store your precious photos and videos online? Look no further than CloudSnap, the free and secure cloud storage solution for all your media needs.",
  icons: {
    icon: ["/icon/favicon.icon"],
    apple: ["/icon/apple-touch-icon.png?"],
    shortcut: ["/icon/apple-touch-icon.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
