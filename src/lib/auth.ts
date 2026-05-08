import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserById } from "./azure-db";

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
        session.user.id = token.id;
        // Always re-read plan from DB so Stripe webhook upgrades reflect immediately
        // without requiring the user to log out and back in
        if (token.id) {
          try {
            const fresh = await getUserById(token.id);
            session.user.plan        = fresh?.plan        ?? token.plan        ?? "free";
            session.user.plan_status = fresh?.plan_status ?? token.plan_status ?? "active";
          } catch {
            session.user.plan        = token.plan        ?? "free";
            session.user.plan_status = token.plan_status ?? "active";
          }
        } else {
          session.user.plan        = token.plan        ?? "free";
          session.user.plan_status = token.plan_status ?? "active";
        }

        // Dev mode: open every feature for any authenticated user.
        // Flip OPEN_ALL_FEATURES to false in src/lib/tier.ts to enforce real plans.
        const { OPEN_ALL_FEATURES } = await import("./tier");
        if (OPEN_ALL_FEATURES) {
          session.user.plan        = "institutional";
          session.user.plan_status = "active";
        }
      }
      return session;
    },
  },
};

export const auth = () => getServerSession(authOptions);
