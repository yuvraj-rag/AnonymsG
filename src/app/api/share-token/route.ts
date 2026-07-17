import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { generateToken } from "@/helpers/generateToken";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions); //get session
    const user = session?.user; //we injected this earlier using jwt nextauth

    if(!session || !user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }

    const userId = user._id;

    try {
        const user = await UserModel.findById({ _id: userId });

        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 500}
            )
        }
        else{
            return Response.json(
            {
                success: true,
                message: "shareToken fetched successfully",
                shareToken: user.shareToken
            },
            { status: 200}
        )
        }

    } catch (error) {
        console.error("Failed to get shareToken")
        return Response.json(
            {
                success: false,
                message: "Failed to get the shareToken"
            },
            { status: 500}
        )
    }

}

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions); //get session
    const user = session?.user; //we injected this earlier using jwt nextauth

    if(!session || !user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }

    const userId = user._id;
    const newShareToken = generateToken();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {shareToken: newShareToken },
            {returnDocument: 'after'} //returns after updating the document
        );

        if(!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 500}
            )
        }
        else{
            return Response.json(
            {
                success: true,
                message: "New link generated successfully",
                shareToken: newShareToken
            },
            { status: 200}
        )
        }

    } catch (error) {
        console.error("Failed to regenerate link")
        return Response.json(
            {
                success: false,
                message: "Failed to generate a new link"
            },
            { status: 500}
        )
    }

}

