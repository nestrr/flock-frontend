import NextAuth, { type JWT } from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_CLIENT_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_CLIENT_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_TENANT_ID}/v2.0`,
      authorization: {
        params: {
          scope: `openid profile email ${process.env.AUTH_MICROSOFT_ENTRA_APP_ID}/User.Read offline_access`,
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
    async jwt({ token, account, trigger, user }) {
      if ((trigger === "signIn" || trigger === "signUp") && !!account) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL!}/profile/me`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${account?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            image: user.image,
          }),
        });
        return {
          ...token,
          id: account.userId,
          accessToken: account?.access_token,
          expiresAt: account?.expires_at,
          refreshToken: account?.refresh_token,
        };
      } else if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      } else {
        const { refreshToken } = token as JWT;
        if (!refreshToken) return null;
        try {
          const response = await fetch(
            `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_TENANT_ID}/oauth2/v2.0/token`,
            {
              method: "POST",
              body: new URLSearchParams({
                client_id: process.env.AUTH_MICROSOFT_ENTRA_CLIENT_ID!,
                client_secret: process.env.AUTH_MICROSOFT_ENTRA_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
              }),
            }
          );
          const tokensOrError = await response.json();

          if (!response.ok) throw tokensOrError;

          const newTokens = tokensOrError as {
            access_token: string;
            expires_in: number;
            refresh_token?: string;
          };

          return {
            ...token,
            accessToken: newTokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + newTokens.expires_in),
            // Some providers only issue refresh tokens once, so preserve if we did not get a new one
            refreshToken: newTokens.refresh_token
              ? newTokens.refresh_token
              : refreshToken,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      }
    },
    async session({ session, token }) {
      const accessToken = session?.accessToken ?? token.accessToken;
      const userId = session?.userId ?? token.sub;
      return {
        ...session,
        accessToken,
        user: { ...session.user, id: userId },
      };
    },
  },
});

export const providers = [MicrosoftEntraID];
