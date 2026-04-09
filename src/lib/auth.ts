import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const SUPER_ADMINS = [
  "kalyank.123@gmail.com",
  "communications@mathcodelab.com",
];

const TEACHER_EMAILS = [
  "kalyank.123@gmail.com",
  "communications@mathcodelab.com",
  // Add additional teacher emails here
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
        if (SUPER_ADMINS.includes(user.email)) {
          token.role = "superadmin";
        } else if (TEACHER_EMAILS.includes(user.email)) {
          token.role = "teacher";
        } else {
          token.role = "student";
        }
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
