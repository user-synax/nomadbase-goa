import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const runtime = "nodejs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Call API route to authenticate user with database
        // This will be handled in a separate API route to avoid mongoose in middleware
        if (credentials.email && credentials.password) {
          return {
            id: "1",
            email: credentials.email,
            name: "User",
            image: null,
            role: "user",
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // TODO: Handle user creation/update in separate API route
      // This will be handled after successful sign-in via API call
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id || user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token._id;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to landing page after sign-in
      return baseUrl;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
