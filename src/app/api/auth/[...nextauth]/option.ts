import GoogleProvider from "next-auth/providers/google";
import connect from "@/app/api/db/connect"
import User from "@/app/api/model/user";
import { JWT } from "next-auth/jwt";
import { NextAuthOptions, User as NextAuthUser, Account, Profile, Session } from "next-auth";

interface Token extends JWT {
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  error?: string;
  id?:number;
  email?: string;
  name?: string;
  image?: string;
}

interface UserInfo extends Token {
  id: number;
  email: string;
  name: string;
  image: string;
}

interface SessionUser extends Session {
  user: {
    id: number;
    email: string;
    name: string;
    image: string;
  };
  accessToken: string;
  error?: string;
}

async function refreshAccessToken(token: Token): Promise<Token> {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: token.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const refreshedTokens = await response.json();
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn(user: NextAuthUser, account: Account, profile: Profile) {
      try {
        await connect();
        console.log("Connected to MongoDB");
        console.log("User:", user);
        const userExists = await User.findOne({ email: user.user.email });
        console.log("User exists:", userExists);
        if (!userExists) {
          console.log("Creating user");
          console.log("User name:", user.user.name);
          const newUser = new User({
            name: user.user.name,
            image: user.user.image,
            email: user.user.email,
          });
          await newUser.save();
          console.log("User created ");
        }
        return true;
      } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return false;
      }
    },
    async redirect({  baseUrl }: {  baseUrl: string }) {
      return baseUrl + "/library";
    },
    async jwt({ token, account, user }: { token: Token; account?: Account; user?: NextAuthUser }) {
      if (account) {
        token.accessToken = account.access_token!;
        token.accessTokenExpires = Date.now() + (account.expires_in as number) * 1000;
        token.refreshToken = account.refresh_token!;
      }
      if (user) {
        token.id = user.id as number;
        token.email = user.email as string;
        token.name = user.name as string;
        token.image = user.image as string;
      }

      if (Date.now() > token.accessTokenExpires) {
        const newToken = await refreshAccessToken(token);
        token.accessToken = newToken.accessToken;
        token.accessTokenExpires = newToken.accessTokenExpires;
      }

      return token;
    },
    async session({ session, token }: { session: SessionUser; token: UserInfo }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

export default options;
