import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./azure-db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await getUserByEmail(credentials.email);
          if (!user) return null;
          const valid = await bcrypt.compare(credentials.password, user.password_hash);
          if (!valid) return null;
          return {
            id:          user.id,
            email:       user.email,
            name:        user.name,
            plan:        user.plan        as string,
            plan_status: user.plan_status as string,
          };
        } catch (err) {
          console.error("[auth] authorize error:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages:   { signIn: "/login", error: "/login" },
  secret:  process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id          = user.id;
        token.plan        = (user as any).plan        ?? "free";
        token.plan_status = (user as any).plan_status ?? "active";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id          = token.id;
        (session.user as any).plan        = token.plan;
        (session.user as any).plan_status = token.plan_status;
      }
      return session;
    },
  },
};

export const auth = () => getServerSession(authOptions);
