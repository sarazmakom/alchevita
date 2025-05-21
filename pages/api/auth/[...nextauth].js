import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import dbConnect from "@/db/connect";
import { User } from "@/db/models/User";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    // 1) On initial sign-in, look up (or create) the user in Mongo and stash their _id
    async signIn({ user, account, profile }) {
      if (account.provider === "github") {
        try {
          await dbConnect();

          let userDoc = await User.findOne({ githubId: profile.id });
          if (!userDoc) {
            userDoc = await User.create({
              email: user.email,
              name: user.name,
              githubId: profile.id,
            });
          }

          // Attach our MongoDB _id to the NextAuth user object
          user.id = userDoc._id.toString();
        } catch (err) {
          console.error("Error saving user to database:", err);
          return false;
        }
      }
      return true;
    },

    // 2) Whenever a JWT is created or updated, persist that `user.id` onto the token
    async jwt({ token, user }) {
      if (user?.id) {
        token.userId = user.id;
      }
      return token;
    },

    // 3) When session() is called (client‑side), merge token.userId into session.user.id
    async session({ session, token }) {
      // session.user => { name, email, image }
      // token.userId => our Mongo _id
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId,
        },
      };
    },
  },
};

export default NextAuth(authOptions);
