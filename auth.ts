import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_CLIENT_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_CLIENT_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_TENANT_ID}/v2.0`,
      authorization: {
        params: {
          scope: `openid profile email ${process.env.AUTH_MICROSOFT_ENTRA_APP_ID}/User.Read`,
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // based on guide: https://authjs.dev/getting-started/session-management/protecting?framework=next-js
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    // based on guide: https://authjs.dev/guides/integrating-third-party-backends#storing-the-token-in-the-session
    async jwt({ token, account }) {
      if (!!token.accessToken) return token;
      return { ...token, accessToken: account?.access_token };
    },
    async session({ session, token }) {
      const accessToken = session?.accessToken ?? token.accessToken;
      const res = await fetch(`${process.env.API_URL!}/profile/me`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }),
      });
      const details = await res.json();
      return { ...session, accessToken, user: { ...session.user, ...details } };
    },
  },
});

export const providers = [MicrosoftEntraID];
