import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import prisma from "../../../lib/prisma";

import GoogleProvider from "next-auth/providers/google";

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
      console.log(session.id);

      return session;
    },

    // async signIn({ account, user, session }) {
    //   //const userId = await PrismaAdapter.getUser(user);
    //   let userId;
    //   try {
    //     const email = user.email;
    //     let result = await fetch(
    //       "http://localhost:3000/api/get_user/" + email,
    //       {
    //         method: "GET",
    //         headers: { "Content-Type": "application/json" },
    //       }
    //     );
    //     let data = await result.json();
    //     console.log(session);
    //     //session.id = data.id;
    //   } catch (error) {
    //     console.error(error);
    //   }

    //   return true; // Do different verification for other providers that don't have `email_verified`
    // },
  },

  // session: async ({ session, token }) => {
  //   if (session?.user) {
  //     console.log(session);
  //     console.log("token:" + token);
  //     session.user.id = token.sub;
  //   }
  //   return session;
  // },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
