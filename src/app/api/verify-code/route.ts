import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { VerificationTokenModel } from "@/model/VerificationToken";
import { generateShareToken } from "@/helpers/generateShareToken";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();

        //in case of URL based data
        const decodedUsername = decodeURIComponent(username); // like special characters

        const pendingUser = await VerificationTokenModel.findOne({
            username: decodedUsername,
        });

        if (!pendingUser) {
            return Response.json(
                {
                    success: false,
                    message: "Verification Request not found",
                },
                { status: 404 },
            );
        }

        const isCodeValid = pendingUser.verifyCode === code;
        const isCodeAlive = pendingUser.expiresAt > new Date();

        if (isCodeValid && isCodeAlive) {
            const existingUser = await UserModel.findOne({
                $or: [
                    { username: pendingUser.username },
                    { email: pendingUser.email },
                ],
            });
            if (existingUser) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists",
                    },
                    { status: 400 },
                );
            }

            const shareToken = generateShareToken();

            const newUser = new UserModel({
                username: pendingUser.username,
                email: pendingUser.email,
                password: pendingUser.password,
                shareToken,
                isAcceptingMessages: true,
                messages: [],
            });
            //create new user
            await newUser.save();
            //delete pending sign up of that user
            await VerificationTokenModel.deleteOne({
                _id: pendingUser._id,
            });

            return Response.json(
                {
                    success: true,
                    message: "User verified successfully",
                },
                { status: 200 },
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Invalid or expired Code",
                },
                { status: 400 },
            );
        }
    } catch (error) {
        console.error("Error verifying user : ", error);
        return Response.json(
            {
                success: false,
                message: "Error verifying user",
            },
            { status: 500 },
        );
    }
}