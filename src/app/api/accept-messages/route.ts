import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

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
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages: acceptMessages},
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
                message: "Message Accepting status set successfully"
            },
            { status: 200}
        )
        }

    } catch (error) {
        console.error("Failed to set user accepting messages")
        return Response.json(
            {
                success: false,
                message: "Failed to set user accepting messages"
            },
            { status: 500}
        )
    }

}

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
        const foundUser = await UserModel.findById(userId);
    
        if(!foundUser) {
            return Response.json(
                    {
                        success: false,
                        message: "User not found"
                    },
                    { status: 404}
                )
        }
    
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages
            },
            { status: 200}
        )
    } catch (error) {
        console.error("Error in fetching accept message status")
        return Response.json(
            {
                success: false,
                message: "Failed to get user accepting messages status"
            },
            { status: 500}
        )
    }
}