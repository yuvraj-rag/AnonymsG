import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { VerificationTokenModel } from "@/model/VerificationToken";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        
        const existingUserByUsername = await UserModel.findOne({ username });
        if (existingUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists",
                },
                { status: 400 },
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            return Response.json(
                {
                    success: false,
                    message: "User already exists with this email",
                },
                { status: 400 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000,
        ).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        const pendingSignUp = await VerificationTokenModel.findOne({ email });

        if (pendingSignUp) {
            pendingSignUp.username = username;
            pendingSignUp.password = hashedPassword;
            pendingSignUp.verifyCode = verifyCode;
            pendingSignUp.expiresAt = expiryDate;

            await pendingSignUp.save();
        } else {
            const newVerificationToken = new VerificationTokenModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode,
                expiresAt: expiryDate,
            });
            await newVerificationToken.save();
        }

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode,
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 },
            );
        }

        return Response.json(
            {
                success: true,
                message: "User registered. Verify your email.",
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error registering user", error);
        const mongoError = error as { code?: number }; 
        //for new requests on pending sign ups and avoiding race conditions

        if (mongoError.code === 11000) {
            return Response.json(
                {
                    success: false,
                    message: "Username or email is already reserved",
                },
                {
                    status: 400,
                },
            );
        }
        return Response.json(
            {
                success: false,
                message: "Error while registering user",
            },
            {
                status: 500,
            },
        );
    }
}
