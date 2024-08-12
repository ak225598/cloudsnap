import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconnect";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user) {
        return false;
      }

      try {
        await connect();
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          // Create a new user
          dbUser = new User({
            username: user.name,
            email: user.email,
            googleId: user.id,
            isVerified: true,
            lastLogin: new Date(),
          });
          await dbUser.save();
        } else {
          // Update existing user
          dbUser.lastLogin = new Date();
          if (!dbUser.googleId) {
            dbUser.googleId = user.id;
          }
          await dbUser.save();
        }

        const tokenData = {
          id: dbUser._id,
          username: dbUser.username,
          email: dbUser.email,
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
          expiresIn: "7d",
        });

        // Set the token in a cookie
        cookies().set("token", token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60,
        });

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 0,
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
