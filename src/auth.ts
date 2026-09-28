// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      // รองรับ trailing slash
      const isProductEditOrDelete = /^\/products\/[^/]+\/(edit|delete)\/?$/.test(pathname);

      if (isProductEditOrDelete) {
        return Boolean(auth?.user);
      }

      return true;
    },
  },
});
