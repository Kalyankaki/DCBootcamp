import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const SUPER_ADMINS = [
  "kalyank.123@gmail.com",
  "communications@mathcodelab.com",
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.role = SUPER_ADMINS.includes(user.email) ? "superadmin" : "student";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
