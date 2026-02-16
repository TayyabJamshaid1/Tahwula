import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { ConnectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { createSessionAndSetCookies } from "../use-cases/sessions";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      await ConnectToDatabase();

      const provider = account?.provider; // "google" | "github"

      let existingUser = await User.findOne({
        email: user.email,
      });

      if (!existingUser) {
        existingUser = await User.create({
          email: user.email,
          name: user.name ?? user.email?.split("@")[0],
          avatarImg: user.image,
          provider,
          role: "simpleUser",
        });
      }

      await createSessionAndSetCookies(existingUser._id.toString());

      return true;
    },

    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
