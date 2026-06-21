import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("USER_NOT_FOUND");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("INVALID_CREDENTIALS");
                    }

                } catch (err: any) {
                    throw err;
                }
            }
        })
    ],
    callbacks: {
        async jwt({token,user}) {
            if(user) {
                token._id = user._id?.toString();
                token.shareToken = user.shareToken;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({session, token}) {
            if(token) {
                session.user._id = token._id;
                session.user.shareToken = token.shareToken;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret:process.env.AUTH_SECRET
}