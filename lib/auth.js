import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

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
