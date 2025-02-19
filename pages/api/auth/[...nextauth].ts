import { NextApiHandler } from "next";
import NextAuth, { SessionOptions, SessionStrategy } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import prisma from "../../../lib/prisma";

import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { randomBytes, randomUUID } from "crypto";
export const options = {
 
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,

  // need to know absolute url for server-side(this) fetch request
  callbacks: {
    async session({ user, session }) {
      
      session.id = user.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
